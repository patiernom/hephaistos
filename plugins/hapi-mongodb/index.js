'use strict';

var driver = require('./mongo-driver');

exports.register = function (server, options, next) {
    var db = driver.getConnection(options);

    db.on('error', driver.closeFunction(server, "Connection to mongodb server return an error\n"));

    db.on('close', driver.closeFunction(server, "Connection to mongodb server is closed\n"));

    db.open(driver.openConnection(server, "Connected correctly to mongodb server\n", next));
};

exports.register.attributes = {
    pkg: require('./package.json')
};


//var mongoDb = request.server.plugins['server-mongodb'].db;
//
//mongoDb.collection('seo').find({}).toArray(function(err, result){
//    //console.log(err);
//    console.log(result);
//});
