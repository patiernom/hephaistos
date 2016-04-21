"use strict";

var path = require('path');

module.exports = function(context) {
    var response = '';

    switch(process.env.NODE_ENV){
        case 'development':
            var config = require(path.resolve(path.join(context.config, 'config.json'))).js

            context.src.forEach(function(item){
                var path = item.toString(),
                    name = path.substring(path.lastIndexOf("/") + 1, path.indexOf('.js')).replace('.min', ''),
                    founded = false;

                if (config) {
                    for (var key in config) {
                        if (config.hasOwnProperty(key)) {
                            if (config[key].libname === name) {
                                config[key].srcfiles.forEach(function(file){
                                    var isAsync = (!file.external) ? 'defer' : '';

                                    founded = true;
                                    response += "<script " + isAsync + " src='/js/" + file.directory + file.filename +"'></script>"
                                });
                            }
                        }
                    }
                }

                if (!founded) {
                    response += "<script defer src='/js/" + item +"' defer></script>"
                }
            });

            break;
        case 'production':
            context.src.forEach(function(file){
                response += "<script defer src='/" + file +"' defer></script>"
            });

            break;
        default:
            console.error('no Enviroment defined');
    }

    return response;
};
