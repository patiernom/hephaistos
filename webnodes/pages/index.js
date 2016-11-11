'use strict';

exports.register = function (server, options, next) {
    var template = server.plugins['template-views-loader'],
        pages = require('./db/pages') || [];

    // Init views settings
    server.views(template.views_settings);

    pages.forEach(function(page){
        server.route({
            method: 'GET',
            path: options.baseRoute + page.url,
            config: require('./default')(server, page.id)
        });
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
