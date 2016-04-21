"use strict";

module.exports = function (rating) {
    rating = rating || 0;

    var totalStars = 5,
        integerPart = Math.floor(parseFloat(rating)),
        decimalPart = rating - integerPart,
        result = '<ul class="list-inline">';

    for (var i = 0; i < integerPart; i++) {
        result += '<li><i class="icon-star-o"></i></li>';
        totalStars--;
    }
    if (decimalPart > 0.4) {
        result += '<li><i class="icon-half-star"></i></li>';
        totalStars--;
    }
    for (i = 0; i < totalStars; i++) {
        result += '<li><i class="icon-star"></i></li>';
    }
    result += '<li class="rating-value">( ' + rating.toString().replace('.', ',') + ' )</li>';
    result += '</ul>';
    return result;
};
