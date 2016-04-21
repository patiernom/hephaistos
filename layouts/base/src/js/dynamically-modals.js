/*!
 * jQuery Bootstrap Dynamic Modal
 * Original author: @patiernom
 * Further changes, comments:
 * Licensed under the MIT license
 */

"use strict";

;(function ($, window, document, undefined) {
    var pluginName = "dynamicModals",
        defaults = {
            showHeader: true,
            showFooter: true,
            showClose: false,
            isAjax: false,
            modalId: 'idMyModal',
            title: 'Title',
            sizing: '', // modal-lg | modal-sm
            icons: {
                name: 'icon-',
                cssClass: 'myclass',
                circle: false
            },
            clearCaption: 'Cancel',
            successCaption: 'OK',
            clearAction: '',
            successAction: '',
            clearCallback: function(){},
            successCallback: function(){},
            openCallback: function(){},
            remoteContent: '' // URL of remote resource (HTML)
        },
        setQueryString = function(base, added){
            if (base.indexOf('?') !== -1){
                return [base, '?', added].join("");
            }else{
                return [base, '&', added].join("");
            }
        },
        getPluginName = function(){
            return "plugin_" + pluginName;
        },
        getOptions = function(element){
            return element.options;
        },
        generateModal = function(placementId, options){
            var modalHTML = '';

            modalHTML += '<div id="' + options.modalId + '" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="' + options.modalId + 'Label">';

            modalHTML += '<div class="modal-dialog ' + options.sizing + '" role="document">';

            modalHTML += '<div class="modal-content">';

            if (options.showHeader) {
                modalHTML += '<div class="modal-header">';
                modalHTML += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
                modalHTML += '<h4 class="modal-title page-header-styled" id="' + options.modalId + 'Label">';
                if (options.icons) {
                    if (options.icons.circle) {
                        modalHTML += '<i class="modal-header-icon icon-stack ' + options.icons.cssClass + '">';
                        modalHTML += '<i class="icon-circle back"></i>';
                        modalHTML += '<i class="' + options.icons.name + ' front"></i>';
                        modalHTML += '</i>';
                    } else {
                        modalHTML += '<i class="modal-header-icon"></i><i class="' + options.icons.name + ' ' + options.icons.cssClass + '"></i>';
                    }
                }
                modalHTML += '<span>' + options.title + '</span></h4>';
                modalHTML += '</div>';
            }

            modalHTML += '<div class="modal-body">';
            if ((!options.showHeader) && options.showClose){
                modalHTML += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
            }
            modalHTML += '<div class="modal-body-append"></div>';
            modalHTML += '</div>';

            if (options.showFooter) {
                modalHTML += '<div class="modal-footer">';
                modalHTML += '<button type="button" class="btn btn-default cancel" data-dismiss="modal">' + options.cancel + '</button>';
                modalHTML += '<button type="button" class="btn btn-success submit">' + options.success + '</button>';
                modalHTML += '</div>';
            }

            modalHTML += '</div>';
            modalHTML += '</div>';
            modalHTML += '</div>';

            $("#" + placementId).html(modalHTML);
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

            generateModal(this.element.id, currentOptions);

            $('#' + this.options.modalId).on('show.bs.modal', function () {
                var modal = $(this);

                $.ajax(currentOptions.remoteContent, {
                    method: "GET",
                    success: function (data) {
                        modal.find('.modal-body-append').html(data);
                        currentOptions.openCallback(data);
                    },
                    error: function (err) {
                        modal.find('.modal-body-append').html(err);
                        currentOptions.openCallback(data);
                    }
                });
            });

            $('#' + this.options.modalId).on('hidden.bs.modal', function () {
                if (currentOptions.wait) {
                    currentOptions.wait = false;
                    currentOptions.clearCallback(currentOptions.clearAction);
                }
            });

            $('#' + this.options.modalId).on('click', '.cancel', function () {
                if (currentOptions.wait) {
                    currentOptions.wait = false;
                    currentOptions.clearCallback(currentOptions.clearAction);
                }
            });

            $('#' + this.options.modalId).on('click', '.submit', function () {
                if (currentOptions.wait) {
                    currentOptions.wait = false;
                    currentOptions.successCallback(currentOptions.successAction);
                }
            });
        },
        hideModal: function(){
            $('.modal.in').modal('hide');
        },
        loadModal: function(url, cancel, succuss){
            var currentOptions = getOptions(this);
            currentOptions.remoteContent = url;
            currentOptions.successAction = succuss;
            currentOptions.clearAction = cancel;
            currentOptions.wait = true;

            $('#' + this.options.modalId).modal('show');
        },
        showModal: function(qs){
            if (qs) {
                var currentOptions = getOptions(this);
                currentOptions.remoteContent = setQueryString(currentOptions.remoteContent, qs);
            }

            $('#' + this.options.modalId).modal('show');
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
