'use strict';

var chai = require('chai'),
    expect = chai.expect,
    path = require('path'),
    rest =  require('unirest');

/*jshint -W030 */
describe('lib - web-services module', function() {
    var npmModule, myModule,
        modulePath = path.resolve(path.join(process.cwd(), 'lib/web-services'));

    beforeEach(function(done) {
        npmModule = require(modulePath);
        done();
    });

    afterEach(function(done) {
        myModule = undefined;
        done();
    });

    describe('Load Module', function() {
        it('Module exists', function(done) {
            myModule = npmModule();

            expect(myModule).to.exist;
            expect(typeof myModule).to.equal('object');
            done();
        });

        it('Module with config', function(done) {
            myModule = npmModule('tests/lib/web-services/stubServices.json');

            expect(myModule).to.exist;
            expect(typeof myModule).to.equal('object');

            done();
        });
    });

    describe('API functions', function() {
        describe('getApiEndPoint', function() {
            it('exists', function(done) {
                myModule = npmModule();
                expect(myModule.API.apiCaller).to.exist;
                expect(typeof myModule).to.equal('object');
                done();
            });

            describe('URI format', function() {
                var myUri;

                beforeEach(function(done) {
                    myModule = npmModule();
                    myUri = myModule.API.getUri('lib/api/auth/device');
                    done();
                });

                it('is not undefined', function(done) {
                    expect(myUri).to.be.not.undefined;
                    done();
                });

                it('is not empty string', function(done) {
                    expect(myUri).to.not.be.empty;
                    done();
                });
            });

            describe('URI hostname', function() {
                it('is http://pizzabo.it/v1.1', function(done) {
                    var services = './tests/lib/web-services/stubServices.json',
                        myConfiguredLib = require(modulePath)(services),
                        myConfiguredUri = myConfiguredLib.API.getUri('auth/device'),
                        expectedURI = "http://www.pizzabo.it/v1.1/auth/device";

                    expect(myConfiguredUri).to.equal(expectedURI);
                    done();
                });

                it('is http://testapi.webs.it/v1.2', function(done) {
                    var services = './tests/lib/web-services/stubServices2.json',
                        myConfiguredLib = require(modulePath)(services),
                        myConfiguredUri = myConfiguredLib.API.getUri('auth/device'),
                        expectedURI = "http://www.pizzabo.it/v1.2/auth/device";

                    expect(myConfiguredUri).to.equal(expectedURI);
                    done();
                });
            });

            describe('End point full URI', function() {
                var services = './tests/lib/web-services/stubServices.json';

                beforeEach(function(done) {
                    myModule = npmModule(services);
                    done();
                });

                it('end point auth/device', function(){
                    var current = myModule.API.apiCaller('lib/api/auth/device', rest);

                    expect(typeof current).to.equal('function');
                });
            });
        });
    });
});
