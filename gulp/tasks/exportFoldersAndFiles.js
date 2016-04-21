'use strict';

var R = require('ramda'),
    path = require('path');

module.exports = function (gulp, plugins, helpers) {
    var base = path.resolve(helpers.projectSetting.projectDirectory + '/src'),
        exportsDir = [base + '/fonts/**/*', base + '/images/**/*'];

    return function(done){
        gulp.src(exportsDir, { base: base })
            .pipe(gulp.dest('./dist', { cwd: process.cwd() }))
            .on('end', done);
    };
};
