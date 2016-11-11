'use strict';

var path = require('path');

/*jshint -W083 */
module.exports = function (gulp, plugins, helpers) {
    var libraries = helpers.getLibrary("config").less,
        gulpSequence = plugins.sequence.use(gulp),
        sequence = [],
        getSourceFile = function(source){
            var output = [];

            source.forEach(function(item){
                output.push(helpers.projectSetting.projectDirectory + '/' + item);
            });

            return output;
        },
        lessGenertion = function(library, done){
            console.log('Start to generate less Framework ' + library.libname + ' -  destination folder: ' + library.dest + ' - map folder: ' + library.maps);
            gulp.src(getSourceFile(library.srcfiles))
                .pipe(plugins.lessImport( library.libname + '.less'))
                .pipe(gulp.dest(path.resolve(helpers.projectSetting.projectDirectory + '/' + library.source)))
                .pipe(plugins.sourcemaps.init())
                .pipe(plugins.less())
                .pipe(plugins.sourcemaps.write(library.maps))
                .pipe(gulp.dest(path.resolve(helpers.projectSetting.projectDirectory + '/' + library.dest)))
                .on('end', done);
        };

    for (var key in libraries) {
        if (libraries.hasOwnProperty(key)){
            sequence.push(key);
            (function(index){
                gulp.task(index, function (cb) {
                    lessGenertion(libraries[index], cb);
                });
            })(key);
        }
    }

    return gulpSequence(sequence);
};

module.exports.dependecies = ['lessVariables'];
