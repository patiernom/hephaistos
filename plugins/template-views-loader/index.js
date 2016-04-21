'use strict';

var path = require('path'),
    Handlebars = require('handlebars'),
    ecosystem = require('ecosystem')(),
    engine = Handlebars.create();

exports.register = function (server, options, next) {
    var that = this,
        logDebug = (options && options.debug) || false,
        indexViews = [],
        numOfPlugins = 0,
        count = 0,
        countFolders = 0,
        commonViews = {
            path: [],
            layout: [],
            partials: [],
            helpers: []
        },
        exitCondition = function (callback) {
            if ((numOfPlugins <= 0) && (count <= 0) && (countFolders <= 0)) {
                callback();
            }
        },
        initCollections = function (indexing) {
            commonViews.path.push(path.resolve(options.views.commonPath));
            commonViews.layout.push(path.resolve(options.views.commonLayout));
            commonViews.partials.push(path.resolve(options.views.commonPartials));
            commonViews.helpers.push(path.resolve(options.views.commonHelpers));

            indexing(path.resolve(options.views.commonPath), './');
            indexing(path.resolve(options.views.commonLayout), 'layout/');
            indexing(path.resolve(options.views.commonPartials), 'partials/');
            indexing(path.resolve(options.views.commonHelpers), 'helpers/');
        },
        addViewToIndex = function (type) {
            type = type || '';

            return function (file) {
                indexingViews(type + file);
            };
        },
        indexingViews = function (view) {
            if (indexViews.indexOf(view) > -1) {
                console.error("You can't register views with same name: " + view);
                throw new Error("You can't register views with same name: " + view);
            }
            indexViews.push(view);
        },
        logResults = function () {
            if (logDebug) {
                console.log(commonViews.path);
                console.log(commonViews.layout);
                console.log(commonViews.partials);
                console.log(commonViews.helpers);

                indexViews.forEach(function (item) {
                    console.log(item);
                });
            }
        },
        setUpServerViews = function () {
            logResults();

            if (options.artifacts) {
                server.expose('artifacts_config', options.artifacts.config || '');

                if (options.artifacts.common) {
                    server.expose('artifacts_common_js', options.artifacts.common.javascript || []);
                    server.expose('artifacts_common_css', options.artifacts.common.stylesheets || []);
                }
            }

            server.expose('views_settings', {
                engines: {
                    html: engine
                },
                path: commonViews.path,
                layoutPath: commonViews.layout,
                layout: true,
                partialsPath: commonViews.partials,
                helpersPath: commonViews.helpers
            });

            next();
        },
        indexingCommonDir = function (uri, type) {
            ecosystem.getDirFiles(uri, function (files) {
                files.forEach(function (file) {
                    ecosystem.getDirInfo(path.resolve(path.join(uri, file)), function (err, stats) {
                        if (err || !stats.isDirectory()) {
                            addViewToIndex(type)(file);
                        }
                    });
                });
            });
        },
        recursiveScanDir = function (uri) {
            ecosystem.getDirFiles(uri, function (files) {
                count += files.length;

                files.forEach(function (file) {
                    var filePath = uri,
                        currentPath = path.resolve(path.join(filePath, file));

                    ecosystem.getDirInfo(currentPath, function (err, stats) {
                        if (!err && stats.isDirectory()) {
                            countFolders += 1;
                            var folder = file,
                                folderPath = path.resolve(path.join(filePath, folder));

                            commonViews[folder.toLowerCase()].push(folderPath);

                            ecosystem.getDirFiles(folderPath, function (files) {
                                files.forEach(addViewToIndex(folder + '/'));
                                countFolders -= 1;
                                count -= 1;
                                exitCondition(setUpServerViews);
                            });
                        } else {
                            commonViews.path.push(filePath);
                            addViewToIndex('./')(file);
                            count -= 1;
                            exitCondition(setUpServerViews);
                        }
                    });
                });
            });
        };

    /* Manifest Plugin options
     //-------------------------------------------
     // "commonPath": "client/views",
     // "commonLayout": "client/views/layout",
     // "commonPartials": "client/views/partials",
     // "commonHelpers": "client/views/helpers"
     //-------------------------------------------
     */

    /* Webnodes configuration options
     //-------------------------------------------
     // "views": [Optional/String] --> "path to views folder"
     //-------------------------------------------
     */

    // Main function
    if (process.env.NODE_MANIFEST) {
        initCollections(indexingCommonDir);

        var plugins = ecosystem.getPlugins(process.env.NODE_MANIFEST);

        ecosystem.filterPlugins(that, plugins, ecosystem.getViewUri, ecosystem.pluginImplementsViews, function (webnodes) {
            numOfPlugins = webnodes.length;

            if (numOfPlugins === 0 ){
                next();
            }

            webnodes.forEach(function (item) {
                var uri = ecosystem.getUriFromPlugin(item);

                numOfPlugins -= 1;

                recursiveScanDir(uri);
            });
        });
    }
};

exports.register.attributes = {
    pkg: require('./package.json')
};
