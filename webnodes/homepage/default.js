'use strict';

var ApiciApi = require('api'),
    ApiManager = require('api-response-manager'),
    Boom = require('boom'),
    fpError = require('fp-error-handling'),
    tokenManager = require('token-device'),
    geoDecoding = require('geodecoding'),
    R = require('ramda'),
    webnodesManager = require('webnodes-manager'),
    async = require('async');

module.exports = function (server) {
    let Api = ApiciApi(server);

    var getResult = ApiManager.getResponse,
        getErrorMessage = ApiManager.getError,
        createSession = function (token) {
            return {
                navigation: {
                    token: token
                }
            };
        },
        resetCart = function (request, token, callback) {
            var cart = request.state['cart'];

            if (cart && cart.checkout) {
                Api.Checkout.Delete(token,
                    cart.checkout.cartId,
                    function (/*result*/) {
                        //return result; do and forget
                    }
                );
            }

            callback();
        },
        getListOfCities = function (token, callback) {
            let onSuccess = (apiResult) => {
                callback(null, geoDecoding.getCities(getResult(apiResult).cities));
            }

            let onError = (err) => {
                let error = Boom.create(err.status, getErrorMessage(err))
                callback(error);
            }

            Api.Locations.Cities(token, fpError(onError, onSuccess));
        },
        getUserAddresses = function (token, userId, callback) {
            let onError = (err) => {
                let error = Boom.create(err.status, getErrorMessage(err))
                callback(error);
            }

            let onSuccess = (apiResult) => {
                callback(null, getResult(apiResult).addresses);
            }

            Api.Users.Addresses(token, userId, fpError(onError, onSuccess));
        },
        responseView = function (rpl, request) {
            let onError = (err) => {
                rpl(err);
            }

            return function (token) {
                var visit = createSession(token),
                    data = createSession(token),
                    manager = webnodesManager(request),
                    auth = manager.authentication.getAuth(),
                    artifacts = manager.artifacts;

                let onSuccess = (apiResult) => {
                    data.cities = apiResult[0];

                    if (auth.isAuthenticated) {
                        data.user = auth.credentials;
                        data.user.addresses = apiResult[1];
                    }

                    data.currentLanguage = manager.language.getCurrentLanguage();
                    data.navigation.search = {};

                    data = R.merge(data, artifacts.loadStylesheets());
                    data = R.merge(data, artifacts.loadJavascript());

                    rpl.view('home', data).state('visit', visit).unstate('cart').unstate('currentSearch');
                }

                async.series(
                    [
                        (next) => {
                            getListOfCities(visit.navigation.token, next);
                        },
                        (next) => {
                            if (auth.isAuthenticated) {
                                getUserAddresses(visit.navigation.token, auth.credentials.userId, next);
                            } else {
                                next();
                            }
                        },
                        (next) => {
                            resetCart(request, visit.navigation.token, next);
                        }
                    ], fpError(onError, onSuccess)
                );
            }
        };

    return {
        auth: {
            mode: 'try',
            strategy: 'session'
        },
        state: {
            parse: true, // parse and store in request.state
            failAction: 'error' // may also be 'ignore' or 'log'
        },
        handler: function (request, reply) {
            let onError = (err) => {
                reply(ApiManager.errorContext(err));
            }

            let currentToken = (callback) => {
                var currentSession = tokenManager(request, ['visit']);

                currentSession.getToken(fpError(onError, callback));
            }

            currentToken(responseView(reply, request));
        }
    };
};
