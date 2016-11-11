'use strict';

var fs = require('fs'),
    glob = require("glob-all"),
    path = require('path'),
    execSync = require('child_process').execSync,
    reporter = function(msg, type){

        switch (type){
            case 'start':
                console.log('');
                console.log('====================================');
                console.log(msg);
                break;
            case 'stop':
                console.log('------------------------------------');
                console.log(msg);
                console.log('====================================');
                break;
            case 'decorate':
                console.log('------------------------------------');
                console.log(msg);
                console.log('------------------------------------');
                break;
            default :
                console.log('------------------------------------');
                console.log(msg);
        }
    },
    dirExists = function(dir){
        try {
            var stats = fs.lstatSync(dir);

            return stats.isDirectory();
        }
        catch (e) {
            return false;
        }
    },
    installDependecies = function(cwd){
        //var cmd = 'cd ' + path.resolve(cwd) + '; npm install; linklocal -r;';
        var cmd = 'cd ' + path.resolve(cwd) + ' & npm install & linklocal -r';

        reporter('Install all dependecies from package.json ' + cwd + ':', 'decorate');
        var result = execSync(cmd);

        if (result.toString('utf8').length > 0){
            reporter(result.toString('utf8'), 'stop');
        }
    },
    clearDependencies = function(cwd){
        if (dirExists(path.resolve(cwd))) {
            //var cmd = 'rm -rf ' + path.resolve(cwd) + '';
            var cmd = 'RMDIR ' + path.resolve(cwd) + ' /s /q';

            reporter('Delete all modules into ' + cwd + ':', 'start');
            var result = execSync(cmd);

            if (result.toString('utf8').length > 0){
                reporter(result.toString('utf8'), '');
            }
        }
    };

module.exports = function (gulp, plugins, helpers) {
    return function (cb) {
        var files = glob.sync([
            './webnodes/**!(node_modules)/package.json',
            './server/package.json',
            './plugins/**!(node_modules)/package.json',
            './lib/**!(node_modules)/package.json',
            './lib/**!(node_modules)/**!(node_modules)/package.json',
            './layouts/**!(node_modules)/package.json',
            './package.json'
        ]);

        files.forEach(function (filename) {
            var currentDir = filename.substring(0,filename.indexOf("package"));

            if(currentDir !== './'){
                clearDependencies(currentDir + 'node_modules');
                installDependecies(currentDir);
            }
        });

        return cb;
    }
};