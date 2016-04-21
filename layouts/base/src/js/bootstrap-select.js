/*!
 * jQuery Bootstrap Select
 * Original author: @patiernom
 * Further changes, comments:
 * Licensed under the MIT license
 */

/*global helpers */

"use strict";

;(function ($, window, document, undefined) {
    var pluginName = "bootstrapSelect",
        defaults = {
            deviceCheckFuntion: function(){
                return false;
            },
            skinClass: 'cssOfSkin',
            cssElementClass: 'cssForHideYourOriginalSelect',
            icon: 'icon-sort',
            changeEvent: function(/*ctx, e*/){
                return false;
            },
            selectEvent: function(ctx, e, done){
                done();
            }
        },
        getPluginName = function(){
            return "plugin_" + pluginName;
        },
        getDropDownSelector = function(context){
            return $('#select' + helpers.hashCodeFromString(context.element.id));
        },
        getOptions = function(context){
            return context.options;
        },
        getSelectOptions = function(element){
            return $(element).children('option');
        },
        setOffAnyEvents = function(selector, event){
            selector.off(event);
        },
        changeCaption = function(value) {
            getDropDownSelector(this).find('.value').text(value);
        },
        changeValue = function(value) {
            $(this.element).val(value);
        },
        getSelectedOption = function(options){
            var i = 0,
                option = options[i];

            for (; option; i+=1, option = options[i]){
                if (option.selected) {
                    return option;
                }
            }
        },
        generateOptions = function(elementId, options) {
           var optionsHtml = '',
               i = 0,
               option = options[i];

            optionsHtml += '<ul class="dropdown-menu" aria-labelledby="' + elementId + '" aria-labelledby="' + elementId + '">';

            for (; option; i+=1, option = options[i]){
                optionsHtml += '<li><a href="javascript:$.noop();" data-value="' + option.value + '">' + option.text + '</a></li>';
            }

            optionsHtml += '</ul>';

            return optionsHtml;
        },
        generateWrap = function(context) {
            var settings = getOptions(context),
                inheritCss = $(context.element).attr('class') || '',
                wrapElement = $('<div />',  {
                    'class': settings.skinClass + ' ' + inheritCss,
                    'id': 'select' + helpers.hashCodeFromString(context.element.id)
                });

            $(context.element).removeClass(inheritCss);
            $(context.element).wrap(wrapElement);
        },
        generateHTML = function(context, elementId, selected, optionsHtml) {
            var selectHTML = '',
                disabledState = ($(context.element).prop('disabled') === true ) ? 'disabled="disabled"' : '';

            selectHTML += '<div class="dropdown">';
            selectHTML += '<button class="btn btn-link dropdown-toggle" type="button" id="' + elementId + '" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ' + disabledState + '><span class="value">' + selected.text + '</span><i class="' + context.options.icon + '"></i></button>';
            selectHTML += optionsHtml;
            selectHTML += '</div>';

            return selectHTML;
        },
        generateSelectGUID = function()  {
            return helpers.generateUniqueID();
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
            if ($(document)) {
                var that = this,
                    elementGUID = generateSelectGUID(),
                    exposedInstance = that,
                    selector = $(that.element),
                    selectOptions = getSelectOptions(selector[0]),
                    settings = getOptions(that),
                    triggerEvent = function(){
                        selector.trigger('input');
                    };

                exposedInstance.changeCaption = changeCaption;
                exposedInstance.changeValue = changeValue;

                generateWrap(that);

                if (settings.deviceCheckFuntion()) {
                    selector.before(generateHTML(this, elementGUID, getSelectedOption(selectOptions), ""));

                    setOffAnyEvents(selector, 'input');
                    selector.on('input', function(e){
                        settings.changeEvent.apply(this, [exposedInstance, e]);
                    });
                } else {
                    selector.before(generateHTML(this, elementGUID, getSelectedOption(selectOptions), generateOptions(elementGUID, selectOptions)));
                    selector.addClass(settings.cssElementClass);

                    var dropDownSelector = getDropDownSelector(that);
                    setOffAnyEvents(dropDownSelector, 'click');

                    dropDownSelector.on('click', 'li', function(e){
                        settings.selectEvent.apply(this, [exposedInstance, e, triggerEvent]);
                    });

                    selector.on('input', function(e){
                        settings.changeEvent.apply(this, [exposedInstance, e]);
                    });
                }
            }
        },
        disable: function(){
            $(this.element).parent().find('.dropdown button').prop('disabled', true);
        },
        enable: function(){
            $(this.element).parent().find('.dropdown button').prop('disabled', false);
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, getPluginName())) {
                $.data(this, getPluginName(),
                    new Plugin(this, options)
                );
            }
        });
    };
})(jQuery, window, document);

