"use strict"

let RestClient = require('unirest'),
    R = require('ramda');

let getApiEndPoint = (resource, API) => {
    return API.apiCaller(resource, RestClient)
};

let executeCallbacks = (callbacks) => {
    let _cb = callbacks

    return (result) => {
        for (let index in _cb) {
            let callbackTrigger = _cb[index]
            if (callbackTrigger.trigger(result))
                callbackTrigger.callback(result)
        }
    }
};

let callbackEnvelope = (triggerFn, callback) => {
    return {
        trigger: triggerFn,
        callback: callback
    }
}

module.exports = (API) => {
    return (resource) => {
        let _resource = resource;

        return {
            with: (paramsArray) => {

                let _params = paramsArray || [],
                    _callbacks = []

                let recursiveOn = {

                    on: (callbackTrigger, apiResultCallback) => {

                        _callbacks.push(callbackEnvelope(callbackTrigger, apiResultCallback))

                        return recursiveOn
                    },

                    call: () => {

                        let endPointParams = R.concat(_params, executeCallbacks(_callbacks))

                        let endpoint = getApiEndPoint(_resource, API)
                        endpoint.apply(null, endPointParams)
                    }
                };

                return recursiveOn
            }
        }
    }
}
