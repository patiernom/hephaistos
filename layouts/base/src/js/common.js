/*exported common*/
/*global helpers*/
/*jshint strict:false */

var common = (function($, window, document, undefined){
    "use strict";
    var ajaxCommonResponse = function (data) {
            if (data) {
                alert(data);
            }
        },
        ajaxCommonRequest = helpers.ajaxRequest(ajaxCommonResponse, helpers.commonErrorMsg('#quiz'));

    return {
        init: function() {

            $(window).scroll(function(){
                if ($(this).scrollTop() > 100) {
                    $('.scrollToTop').fadeIn();
                } else {
                    $('.scrollToTop').fadeOut();
                }
            });

            $(document).on('click', '#quiz button', ajaxCommonRequest);
        }
    };
})(jQuery, window, document);
