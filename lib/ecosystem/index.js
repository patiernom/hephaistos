"use strict";

var fastError = require('fp-error-handling'),
    fs = require('fs'),
    path = require('path'),
    accounting = require('accounting'),
    util = require('util');

module.exports = function () {
    var pathViewDir = function (options) {
            return ((options.views && typeof options.views === "string") ? options.views : "views");
        },
        pathCookieJSON = function (options) {
            return ((options.cookieSession && typeof options.cookieSession === "string") ? options.cookieSession : "cookies.json");
        },
        isImplementedCookies = function (uri) {
            try {
                var stats = fs.lstatSync(uri);

                return (stats && stats.isFile());
            } catch (ex) {
                return false;
            }
        },
        isImplementedViews = function (uri) {
            try {
                var stats = fs.lstatSync(uri);

                return (stats && stats.isDirectory());
            } catch (ex) {
                return false;
            }
        },
        isWebnode = function (context, key) {
            return ((key.indexOf('./') === 0) && (context.name !== key.replace('./', '')));
        },
        getRootPath = function(context){
            return context.pluginOptions.webnodes.path;
        };

    return {
        getManifestAbsolutePath: function (callingModuleName) {
            var myArgs = process.argv.slice(2),
                myManifest = 'default';

            if (myArgs.indexOf("-manifest") !== -1) { //does our flag exist?
                myManifest = myArgs[myArgs.indexOf("-manifest") + 1]; //grab the next item
            }

            let basePath = path.dirname(require.resolve(callingModuleName));
            let manifestRelativePath = util.format('/config/manifests/%s.json', myManifest);

            return path.join(basePath, manifestRelativePath);
        },
        getWebNodesDir: function (settings) {
            return settings.cwd + settings.path;
        },
        logServer: function (msg) {
            if (process.send) {
                process.send({type: 'server:message', data: msg});
            } else {
                console.log(msg);
            }
        },
        errorServer: function (msg, data) {
            if (process.send) {
                process.send({type: 'server:error', data: msg + data});
            } else {
                console.error(msg, data);
            }
        },
        getPlugins: function (manifest) {
            return require(path.resolve(manifest)).plugins;
        },
        getDirFiles: function (path, callback) {
            fs.readdir(path, fastError(
                function (err) {
                    console.error(err);
                },
                callback
            ));
        },
        getDirInfo: function (path, callback) {
            fs.lstat(path, callback);
        },
        pluginImplementsViews: isImplementedViews,
        pluginImplementsCookies: isImplementedCookies,
        checkIsWebnode: isWebnode,
        filterPlugins: function (context, source, uriResolver, whatIsImplemented, callback) {
            var respArray = [];
            for (var key in source) {
                if (source.hasOwnProperty(key) && isWebnode(context, key)) {
                    var uri = uriResolver(context, key, source[key]);

                    if (whatIsImplemented(uri)) {
                        respArray.push({name: key, uri: uri});
                    }
                }
            }

            callback(respArray);
        },
        getViewsDir: pathViewDir,
        getCookieJSON: pathCookieJSON,
        getUriFromPlugin: function (plugin) {
            return plugin.uri;
        },
        getViewUri: function (context, pluginName, view) {
            return path.resolve(path.join(getRootPath(context), pluginName, pathViewDir(view)));
        },
        getCookieJSONUri: function (context, pluginName, plugin) {
            return path.resolve(path.join(getRootPath(context), pluginName, pathCookieJSON(plugin)));
        },
        formatPrice: (value) => {
            let price = value || "0"
            let options = {
                symbol : "€",
                decimal : ",",
                thousand: ".",
                precision : 2,
                format: "%s %v"
            }

            return accounting.formatMoney(price, options);
        }
    };
};
