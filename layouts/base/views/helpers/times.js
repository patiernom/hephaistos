"use strict";

module.exports = function(n, block) {

    var accum = '',
        data = {};
    for(var i = 1; i <= n; i++) {
        data.index = i;
        accum += block.fn(this, {data: data});
    }

    return accum;
};
