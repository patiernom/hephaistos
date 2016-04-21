'use strict';

var Enrich = require('http-enrich');

module.exports = function (restClient, apiResolver) {
    return function (token, next) {
        restClient.get(apiResolver('locations/cities'))
            .headers(Enrich.Headers.Default(token))
            .end(next);
    };
};
