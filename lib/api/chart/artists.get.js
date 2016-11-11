'use strict';

var Enrich = require('http-enrich');

module.exports = function (restClient, apiResolver) {
    return function (apikey, country, page, page_size, format, next) {
        restClient.get(apiResolver('chart.artists.get'))
            .headers(Enrich.Headers.Default())
            .query({
                'apikey': apikey,
                'country': country,
                'page': page,
                'page_size': page_size,
                'format': format
            })
            .end(next);
    };
};
