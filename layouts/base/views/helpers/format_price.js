"use strict";

var ecosystem = require('ecosystem')();

module.exports = function(value) {
    return ecosystem.formatPrice(value);
};
