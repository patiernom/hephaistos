"use strict";

var path = require('path');

module.exports = function(context) {
    var response = '';

    switch(process.env.NODE_ENV){
        case 'development':
            var config = require(path.resolve(path.join(context.config, 'config.json'))).css;

            context.src.forEach(function(item){
                var path = item.toString(),
                    name = path.substring(path.lastIndexOf("/") + 1, path.indexOf('.css')).replace('.min', ''),
                    founded = false;

                if (config){
                    for (var key in config) {
                        if (config.hasOwnProperty(key)) {
                            if (config[key].libname === name) {
                                config[key].srcfiles.forEach(function(file){
                                    founded = true;
                                    response += "<link rel='stylesheet' href='/css/" + file.directory + file.filename +"' >";
                                });
                            }
                        }
                    }
                }

                if (!founded) {
                    response += "<link rel='stylesheet' href='/css/" + item +"' >";
                }
            });

            break;

        case 'production':
            context.src.forEach(function(file){
                response += "<link rel='stylesheet' href='/" + file +"' >"
            });

            break;
        default:
            console.error('no Enviroment defined');
    }

    return response;
};
