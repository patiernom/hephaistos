'use strict';

var ecosystem = require('ecosystem')(),
    operations = require('./lib/generator');

exports.register = function (server, options, next) {
    //Generate all cookies and sessions
    var that = this,
        logDebug = (options && options.debug) || false,

        logResults = function (msg) {
            if (logDebug) {
                console.log(msg);
            }
        },
        generateCookies = function (uri) {
            var data = require(uri);

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    operations[key](data[key], logResults);
                }
            }
        };

    operations = operations(server);

    /* Webnodes configuration options
     //-------------------------------------------
     // "cookie": [Optional/String] --> "path to cookies and sessions json"
     //-------------------------------------------
     */

    // Main function
    if (process.env.NODE_MANIFEST) {
        var plugins = ecosystem.getPlugins(process.env.NODE_MANIFEST);

        ecosystem.filterPlugins(that, plugins, ecosystem.getCookieJSONUri, ecosystem.pluginImplementsCookies, function (webnodes) {
            if (webnodes.length === 0 ){
                next();
            }

            webnodes.forEach(function (item) {
                var uri = ecosystem.getUriFromPlugin(item);
                logResults('uri: ' + uri);

                generateCookies(uri);
            });
        });
    }

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
