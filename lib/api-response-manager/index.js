"use strict";

let Boom = require('boom'),
    findError = function(response) {
        let errorMessage = "";

        if (response.body && response.body.msg) {
            errorMessage = response.body.msg;
        } else if (response.error && response.error.message) {
            errorMessage = response.error.message;
        }

        return errorMessage;
    };

module.exports = {
    getError: findError,
    getResponse: function(data) {
        return JSON.parse(data.body).message.body;
    },
    errorContext: function(err) {
        if (err.isBoom) {
            return err;
        } else {
            let error = Boom.create(err.status, findError(err));

            return error;
        }
    }
};
