"use strict"

let Services = require('web-services'),
    apiEndpoint = require('./lib/core'),
    httpStatus = require('./lib/http-status');

let getServices = (services) => {
    return Services(services);
}

let getAppSettings = function (server) {
    let options = server.settings.app.options;

    return getServices(options.services);
};

module.exports = (server) => {
    let API = getAppSettings(server).API;

    return {
        do: apiEndpoint(API),
        EndPoint: API.getIndex(),
        HttpStatus: httpStatus
    }
};
