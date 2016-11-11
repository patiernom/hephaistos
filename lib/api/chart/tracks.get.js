'use strict';

var Enrich = require('http-enrich');

module.exports = function (restClient, apiResolver) {
    return function (apikey, country, page, page_size, format, f_has_lyrics, next) {
        restClient.get(apiResolver('chart.tracks.get'))
            .headers(Enrich.Headers.Default())
            .query({
                'apikey': apikey,
                'country': country,
                'page': page,
                'page_size': page_size,
                'format': format,
                'f_has_lyrics': f_has_lyrics
            })
            .end(next);
    };
};
