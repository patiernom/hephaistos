"use strict"

let apici = require('apici'),
    R = require('ramda');

module.exports = function (server) {
    let Apici = apici(server);

    return {
        Chart: {
            ArtistsGet: (apikey, country, page, page_size, format, next) => {
                Apici.do(Apici.EndPoint.Chart.ArtistsGet)
                    .with([apikey, country, page, page_size, format])
                    .on(Apici.HttpStatus.OK, result => next(null, result))
                    .on(Apici.HttpStatus.NOT_OK, err => next(err))
                    .call()
            },
            TracksGet: (apikey, country, page, page_size, format, f_has_lyrics, next) => {
                Apici.do(Apici.EndPoint.Chart.TracksGet)
                    .with([apikey, country, page, page_size, format, f_has_lyrics])
                    .on(Apici.HttpStatus.OK, result => next(null, result))
                    .on(Apici.HttpStatus.NOT_OK, err => next(err))
                    .call()
            }
        },
        Track: {
            LyricsGet: (apikey, track_id, track_mbid, format, next) => {
                Apici.do(Apici.EndPoint.Track.LyricsGet)
                    .with([apikey, track_id, track_mbid, format])
                    .on(Apici.HttpStatus.OK, result => next(null, result))
                    .on(Apici.HttpStatus.FORBIDDEN, result => next(null, result))
                    .on(Apici.HttpStatus.NOT_OK, err => next(err))
                    .call()
            }
        }

    }
}