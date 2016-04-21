'use strict';

var Enrich = require('http-enrich');

module.exports = function (restClient, apiResolver) {
    return function (token, longitude, latitude, next) {
        restClient.get(apiResolver('locations/geocode/reverse'))
            .headers(Enrich.Headers.Default(token))
            .query({
                'longitude': longitude,
                'latitude': latitude
            })
            .end(next);
    };
};
