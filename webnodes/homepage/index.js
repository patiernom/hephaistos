'use strict';

exports.register = function (server, options, next) {
    var template = server.plugins['template-views-loader'];

    // Init views settings
    server.views(template.views_settings);

    // Index route
    server.route({
        method: 'GET',
        path: options.baseRoute,
        config: require('./default')(server)
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
