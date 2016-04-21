"use strict";

module.exports = function(request){
    var isXHRRequest = function(){
        return (request.raw.req.headers['x-requested-with'] === "XMLHttpRequest");
    };

    return {
        isAjax: isXHRRequest,
        negotiateView: function(ajax_layout, layout){
            var resLayout;

            if (isXHRRequest()) {
                resLayout = { layout: ajax_layout };
            } else if (layout) {
                resLayout = { layout: layout };
            }

            return resLayout;
        }
    };
};
