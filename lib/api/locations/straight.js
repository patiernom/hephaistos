'use strict';

var Enrich = require('http-enrich');

module.exports = function (restClient, apiResolver) {
    return function (token, cityId, locId, address, civicNumber, next) {
        restClient.get(apiResolver('locations/geocode/straight'))
            .headers(Enrich.Headers.Default(token))
            .query({
                'cityId': cityId,
                'locId': locId,
                'address': address,
                'civicNumber': civicNumber
            })
            .end(next);
    };
};
