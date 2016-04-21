'use strict';

var chai = require('chai'),
    rewire = require('rewire'),
    expect = chai.expect,
    assert = chai.assert,
    R = require('ramda'),
    path = require('path');

/*jshint -W030 */
describe('webnodes - Cookies Manager', function () {
    var npmModule,
        modulePath = path.resolve(path.join(process.cwd(), 'plugins/hapi-cookies-manager/lib/generator'));

    before(function (done) {
        npmModule = rewire(modulePath);

        done();
    });

    describe('Load Module', function () {
        it('Module exists', function (done) {
            expect(npmModule).to.exist;
            done();
        });

        it('Module exists', function (done) {
            expect(typeof npmModule).to.equal('function');
            done();
        });
    });
});
