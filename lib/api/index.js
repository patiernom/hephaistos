"use strict"

let apici = require('apici'),
    R = require('ramda');

module.exports = function (server) {
    let Apici = apici(server);

    return {
        Locations: {
            Cities: (token, next) => {
                Apici.do(Apici.EndPoint.Locations.Cities)
                    .with([token])
                    .on(Apici.HttpStatus.OK, result => next(null, result))
                    .on(Apici.HttpStatus.NOT_OK, err => next(err))
                    .call()
            },
            Reverse: (token, longitude, latitude, next) => {
                Apici.do(Apici.EndPoint.Locations.Cities)
                    .with([token])
                    .on(Apici.HttpStatus.OK, result => next(null, result))
                    .on(Apici.HttpStatus.NOT_OK, err => next(err))
                    .call()
            },
            Straight: (token, cityId, locId, address, civicNumber, next) => {
                Apici.do(Apici.EndPoint.Locations.Cities)
                    .with([token])
                    .on(Apici.HttpStatus.OK, result => next(null, result))
                    .on(Apici.HttpStatus.FORBIDDEN, result => next(null, result))
                    .on(Apici.HttpStatus.NOT_OK, err => next(err))
                    .call()
            }
        }
    }
}