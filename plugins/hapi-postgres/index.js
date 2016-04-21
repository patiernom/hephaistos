'use strict';

var pgDriver = require('./pg-driver');

exports.register = function (server, options, next) {
    pgDriver.openConnection(server, options, next);
};

exports.register.attributes = {
    pkg: require('./package.json')
};
