'use strict';

var R = require('ramda'),
    webnodesManager = require('webnodes-manager'),
    createSession = function () {
        return {
            navigation: {
                visit: 1
            }
        };
    },
    createPage = function (data) {
        return {
            pageDetail: {
                title: data.title,
                bgtitle: data.bgtitle,
                image: data.image,
                subtitle: data.subtitle,
                abstract: data.abstract,
                content: data.content
            }
        };
    },
    createMetas = function (data) {
        return {
            seo: {
                title: data.metatags.title,
                metatags: data.metatags.custom
            }
        };
    };

module.exports = function (server, page) {
    let responseView = (rpl, request, pageId) => {
            return function (token) {
                var visit = createSession(token),
                    data = createSession(token),
                    manager = webnodesManager(request),
                    auth = manager.authentication.getAuth(),
                    artifacts = manager.artifacts,
                    page = R.find(R.propEq('id', pageId))(require('./db/pages'));

                if (auth.isAuthenticated) {
                    data.user = auth.credentials;
                }

                data.currentLanguage = manager.language.getCurrentLanguage();
                data.navigation.search = {};

                data = R.merge(data, createPage(page));
                data = R.merge(data, createMetas(page));

                data = R.merge(data, artifacts.loadStylesheets());
                data = R.merge(data, artifacts.loadJavascript());

                rpl.view('page', data, {layout: page.template}).state('visit', visit);
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
            responseView(reply, request, page);
        }
    };
};
