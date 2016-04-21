'use strict';

exports.register = function (server, options, next) {
    var stop = function (context) {
        context = context || "Process stopped by user";

        server.root.stop(function () {
            console.log('Server stopped in safe mode. [ ' + context + ' ], stacktrace:'+ context.stack);
            process.exit();
        });
    };

    server.expose('safeStop', stop);

    process.on('SIGTERM', stop);
    process.on('SIGINT', stop);
    process.on('SIGQUIT', stop);
    process.on('uncaughtException', stop);

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};