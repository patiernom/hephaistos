'use strict';

var R = require('ramda'),
    path = require('path');

module.exports = function (gulp, plugins, helpers) {
    var config = helpers.getLibrary("config").lessVars,
        getJSONSource = function(){
            var sources = {};

            config.srcfiles.forEach(function(item){
                sources = R.merge(sources, require(path.resolve(item)));
            });

            return sources;
        };

    return function(done){
        plugins.file(config.name, '', { src: true })
            .pipe(plugins.lessJsonVariables(getJSONSource()))
            .pipe(gulp.dest(config.dest, { cwd: process.cwd()}))
            .on('end', done);
    };
};
