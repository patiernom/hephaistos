'use strict';

let preResponse = require('./preresponse'),
    prefixDir = require('./lib/prefix');

exports.register = function (server, options, next) {

    let prefixDirectory = prefixDir.getCurrentPrefixDirectory(options, "dist"),
        template = server.plugins['template-views-loader'];

    server.views(template.views_settings);

    server.route({
        method: 'GET',
        path: '/js/{param*}',
        handler: {
            directory: {
                lookupCompressed: true,
                path: prefixDirectory + '/js'
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/css/{param*}',
        handler: {
            directory: {
                lookupCompressed: true,
                path: prefixDirectory + '/css'
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/images/{param*}',
        handler: {
            directory: {
                lookupCompressed: true,
                path: prefixDirectory + '/images'
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/fonts/{param*}',
        handler: {
            directory: {
                lookupCompressed: true,
                path: prefixDirectory + '/fonts'
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/doc/{param*}',
        handler: {
            directory: {
                lookupCompressed: true,
                path: prefixDirectory + '/doc'
            }
        }
    });

    server.ext('onPreResponse', preResponse);

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
