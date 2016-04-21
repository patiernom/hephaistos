"use strict";

module.exports = function (request) {
    var artifactsType = {
            JS: 0,
            CSS: 1
        },
        manageOutput = function(base, addition){
            var output = base || [];

            output.concat(addition || []);

            return output;
        },
        getData = function (data) {
            var output = [];

            output[0] = function (addition) {
                return manageOutput(data.artifacts_common_js, addition);
            };

            output[1] = function (addition) {
                return manageOutput(data.artifacts_common_css, addition);
            };

            return output;
        },
        getConfig = function (type, addition) {
            var common = request.server.plugins['template-views-loader'];

            return {
                config: common.artifacts_config || '',
                src: getData(common)[type](addition)
            }
        };

    return {
        language: {
            getCurrentLanguage: function () {
                return request.i18n.getLocale();
            }
        },
        artifacts: {
            loadJavascript: function (addition) {
                return {
                    javascript: getConfig(artifactsType.JS, addition)
                }
            },
            loadStylesheets: function (addition) {
                return {
                    stylesheets: getConfig(artifactsType.CSS, addition)
                }
            }
        },
        authentication: {
            getAuth: function () {
                return request.auth;
            }
        }
    }
};
