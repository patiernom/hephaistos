'use strict'

let responseNegotiator = require('response-negotiator'),
    webnodesManager = require('webnodes-manager'),
    R = require('ramda')

module.exports = (request, reply) => {

    let negotiator = responseNegotiator(request),
        manager = webnodesManager(request),
        artifacts = manager.artifacts,
        response = request.response

    if(!negotiator.isAjax()) {

        if (response.isBoom) {

            let data = {}
            data = R.merge(data, artifacts.loadStylesheets())
            data = R.merge(data, artifacts.loadJavascript())
            data = R.merge(data, { error: JSON.stringify(response.message, undefined, 4) })

            if(response.output.statusCode === 404) {
                console.warn(response.stack)
                return reply.view('404', data, {layout: 'exception_layout'}).code(response.output.statusCode);
            } else {
                console.error(response.stack)
                return reply.view('500', data, {layout: 'exception_layout'}).code(response.output.statusCode);
            }
        }
    }

    return reply.continue()
}