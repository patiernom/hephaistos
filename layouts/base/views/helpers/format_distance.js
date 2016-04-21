"use strict";

module.exports = function (distance) {
    var result = '';
    if (distance < 1) {
        result = (distance * 1000) + ' m';
    } else {
        result = distance.toString().replace('.', ',') + ' km';
    }
    return result;
};
