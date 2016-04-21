"use strict";

module.exports = {
    getCurrentPrefixDirectory: function(options, defaultDir) {
        let prefixDirectory = defaultDir || "dist";

        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            prefixDirectory = options.prefix
        }

        return prefixDirectory;
    }
}

