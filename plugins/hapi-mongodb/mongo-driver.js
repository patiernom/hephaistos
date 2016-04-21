'use strict';

var fastError = require('fp-error-handling'),
    Db = require('mongodb').Db,
    ServerMongoDB = require('mongodb').Server;



module.exports = {
    getConnection: function(settings){
        return new Db(settings.connection.database, new ServerMongoDB(settings.connection.uri, settings.connection.port));
    },
    closeFunction: function(server, msg){
        return function(){
            console.log(msg);
            server.plugins['hapi-safe-stop'].safeStop();
        }
    },
    openConnection: function(server, msg, cb){
        return fastError(
            function(cb){
                cb(error);
            },
            function(connection) {
                console.log(msg);
                server.expose('db', connection);

                cb();
            }
        );
    }
};


