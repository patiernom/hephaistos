'use strict';

var math = require('mathjs'),
    generateTtl = function(value){
        var node = math.parse(value),
            code = node.compile();

        return code.eval();
    };

module.exports = function (server) {
    var operations = [];

    operations["cookies"] = function(list, log){
        list.forEach(function (item) {
            log("define cookies " + item.name);

            item.options.ttl = generateTtl(item.options.ttl);

            server.state(item.name, item.options);
        });
    };

    operations["authorizations"] = function(list, log){
        list.forEach(function (item) {
            log("authorizations " + item.name);

            item.options.ttl = generateTtl(item.options.ttl);

            server.auth.strategy(item.name, item.strategy, item.options);
        });
    };

    return operations;
};
