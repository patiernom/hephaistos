'use strict';

var exec = require('child_process').exec,
    fastError = require('fp-error-handling'),
    commonResponse = function (cb) {
        return fastError(
            function (err) {
                console.error(err);

                return cb;
            },
            function (stdout, stderr) {
                console.log(stdout);
                console.log(stderr);

                return cb
            }
        );
    };

module.exports = function (gulp, plugins, helpers) {
    return function (cb) {

        switch(process.env.NODE_ENV) {
            case 'development':
                exec('pm2 startOrRestart processes.dev.json', commonResponse(cb));
                break;
            case 'integration':
                exec('pm2 startOrRestart processes.integ.json', commonResponse(cb));
                break;
            case 'stage':
                exec('pm2 startOrRestart processes.stg.json', commonResponse(cb));
                break;
            case 'production':
                exec('pm2 startOrRestart processes.json', commonResponse(cb));
                break;
            default:
                exec('pm2 startOrRestart processes.dev.json', commonResponse(cb));
        }

    }
};

module.exports.dependecies = [];