'use strict';

var hapiPlugins = require('hapi-include-baselib'),
    MongoClient = require('mongodb').MongoClient,
    MongoWrapper = require('./mongoWrapper'),
    getMongoDbUrl = function(config) {
        return "mongodb://" + config.uri + ":" + config.port + "/" + config.database;
    };

exports.register = function (server, options, next) {
    MongoClient.connect(getMongoDbUrl(options.connection), options.settings || {}, function (error, db) {
        if (error) {
            next(error);
            return;
        }

        console.log("Connected correctly to mongodb server");
        var mongoInstance = new MongoWrapper(db);

        server.expose('collection', mongoInstance.collection.bind(mongoInstance));
        server.expose('find', mongoInstance.find.bind(mongoInstance));
        server.expose('findOne', mongoInstance.findOne.bind(mongoInstance));
        server.expose('findOneById', mongoInstance.findOneById.bind(mongoInstance));
        server.expose('insert', mongoInstance.insert.bind(mongoInstance));
        server.expose('update', mongoInstance.update.bind(mongoInstance));
        server.expose('remove', mongoInstance.remove.bind(mongoInstance));
        server.expose('close', mongoInstance.close.bind(mongoInstance));
        server.expose('db', db);

        next();
    });
};

exports.register.attributes = {
    pkg: require('./package.json')
};
