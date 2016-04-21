/*!
 * jQuery Bootstrap Offcanvas menu
 * Original author: @patiernom
 * Further changes, comments:
 * Licensed under the MIT license
 */

"use strict";

;(function ($, window, document, undefined) {
    var pluginName = "offcanvasMenu",
        defaults = {
            orientation: 'left',
            selector: '',
            wrap: ''
        },
        getPluginName = function(){
            return "plugin_" + pluginName;
        },
        getOptions = function(element){
            return element.options;
        },
        animateDirection = function(isActive, base, orientation) {
            if (orientation && orientation === 'right') {
                return isActive ? base : '100%';
            } else {
                return isActive ? '0px' : base;
            }
        },
        getDistance = function(orientation) {
            if (orientation && orientation === 'right') {
                return '30%';
            } else {
                return '-70%';
            }
        },
        displayOffcanvas = function(isActive, offcanvas, next) {
            if (isActive) {
                offcanvas.removeClass('hidden-xs');
            } else {
                offcanvas.addClass('hidden-xs');
            }

            next(offcanvas);
        },
        execAnimation = function(offcanvas, distance){
            return offcanvas.stop().animate({ left: distance });
        },
        toggleActive = function(root, offcanvas, options, next) {
            if (offcanvas && offcanvas.hasClass('active')) {
                offcanvas.removeClass('active');
                root.removeClass(options.wrap);
            } else {
                offcanvas.addClass('active');
                root.addClass(options.wrap);
            }

            next();
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {
        init: function () {
            var currentOptions = getOptions(this);

            $(this.element).on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                var that = this,
                    $root = $(currentOptions.selector),
                    offcanvas = $root.find('.offcanvas'),
                    heightCol = $root.find('.offcanvas-height-col'),
                    overlay = $root.find('.offcanvas-overlay');

                toggleActive($root, offcanvas, currentOptions, function(){
                    var isActive = offcanvas && offcanvas.hasClass('active'),
                        distance = animateDirection(isActive, getDistance(currentOptions.orientation, offcanvas), currentOptions.orientation);

                    displayOffcanvas(isActive, offcanvas, function(root){
                        execAnimation(root, distance);
                    });

                    execAnimation(heightCol, distance);

                    if (isActive) {
                        overlay.stop().css({ display: "block", opacity: 0 }).animate({ opacity: '1' });

                        $('body').css('overflow','hidden');
                    } else {
                        overlay.stop().animate({ opacity: '0' }).css({ display: "none" });

                        $('body').css('overflow','auto');
                    }
                    overlay.off('click');

                    overlay.one('click', function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        $(that).trigger('click');

                        return false;
                    });
                });
            });
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, getPluginName())) {
                $.data(this, getPluginName(),
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
