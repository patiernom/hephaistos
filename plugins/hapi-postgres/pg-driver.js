'use strict';

var  Db = require('pg');

module.exports = {
    openConnection: function(server, options, next){
        var fastError = require('fp-error-handling');

        Db.connect(options.url, fastError(
            function (err) {
                console.err(err);
            },
            function (client, done) {
                console.log('Postgres DB connected on port ' + client.port);
                server.expose('client', client);
                next(done);
            }
        ));
    }
};
