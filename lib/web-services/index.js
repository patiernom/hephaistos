"use strict";

var util = require('util'),
    path = require('path');

module.exports = function(services) {
    services = services || require('./package.json')['serviceConfigFile'];

    var servicesJSON = require(path.resolve(process.cwd(), services)),
        API = servicesJSON.api,
        getProperty = function(source, property, defaultValue ){
            return ((source) && (source[property])) ? source[property] : defaultValue;
        },
        resolveEndPoint = function(param){
            return (param) ? param : '';
        },
        ApiResolveUri = function(end){
            return util.format('%s://%s/ws/%s/%s', getProperty(API, 'protocol', 'http'), getProperty(API, 'domain', ''), getProperty(API, 'version', '0.0'), resolveEndPoint(end));
        },
        resolvePath = function (name) {
            return path.resolve(process.cwd(), name);
        },
        getApiIndex = function(){
            return require(path.resolve(getProperty(API, 'index', ''))) || {};
        };

    return {
        API: {
            apiCaller: function(resource, restClient){
                return require(resolvePath(resource))(restClient, ApiResolveUri);
            },
            getUri: ApiResolveUri,
            getIndex: getApiIndex
        }
    };
};
