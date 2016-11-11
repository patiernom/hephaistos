'use strict';

var R = require('ramda'),
    webnodesManager = require('webnodes-manager');

module.exports = function (server) {
    var createSession = function () {
            return {
                navigation: {
                    visit: 1
                }
            };
        },

        responseView = function (rpl, request) {
            var visit = createSession(),
                data = createSession(),
                manager = webnodesManager(request),
                artifacts = manager.artifacts;

            data.currentLanguage = manager.language.getCurrentLanguage();
            data.navigation.search = {};

            data = R.merge(data, artifacts.loadStylesheets());
            data = R.merge(data, artifacts.loadJavascript());

            rpl.view('home', data).state('visit', visit);
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
            responseView(reply, request);
        }
    };
};
