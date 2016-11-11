'use strict';

var Enrich = require('http-enrich');

module.exports = function (restClient, apiResolver) {
    return function (apikey, track_id, track_mbid, format, next) {
        restClient.get(apiResolver('track.lyrics.get'))
            .headers(Enrich.Headers.Default())
            .query({
                'apikey': apikey,
                'track_id': track_id,
                'track_mbid': track_mbid,
                'format': format
            })
            .end(next);
    };
};
