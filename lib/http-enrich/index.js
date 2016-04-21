"use strict"

module.exports = {
    Headers: {
        Default: token => {
            return {
                'User-Agent': 'Poseidon Server v1.0',
                'x-webs-token': token
            }
        },
        Initial: () => {
            return {
                'User-Agent': 'Poseidon Server v1.0',
                'x-webs-token': 'webs_api_appid'
            }
        }
    }
}