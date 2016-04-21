'use strict';

// Following the 'Node.js require(s) best practices' by
// http://www.mircozeiss.com/node-js-require-s-best-practices/

// External libs
var ecosystem = require('ecosystem')(),
    poseidonCore = require('poseidon-core'),

    // Configurations
    manifestFilePath = ecosystem.getManifestAbsolutePath('server'),
    options = {
        relativeTo: ecosystem.getWebNodesDir({cwd: process.cwd(), path: "/webnodes"})
    };

module.exports = (function(){
    poseidonCore(manifestFilePath, options).start();
})();
