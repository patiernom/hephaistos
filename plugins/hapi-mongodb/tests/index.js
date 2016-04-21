'use strict';

var chai = require('chai'),
    expect = chai.expect,
    path = require('path'),
    rewire = require('rewire'),
    sinon = require('sinon');

/*jshint -W030 */
describe('plugins - server-mongodb module', function() {
    var npmModule,
        modulePath = path.resolve(path.join(process.cwd(), 'plugins/hapi-mongodb/mongo-driver'));

    beforeEach(function(done) {
        npmModule = rewire(modulePath);

        done();
    });

    describe('Module export', function() {
        it('exists', function(done) {
            expect(npmModule).to.exist;
            done();
        });

        it('is function', function(done) {
            expect(typeof npmModule).to.equal('object');
            done();
        });
    });

    describe('Module methods', function() {
        var expectDriver,
            testDriver = {},
            stubServer = {
                expose: function(name, body){
                    testDriver.name = name;
                    testDriver.method = body;
                },
                plugins: []
            },
            stubOptions = {
                connection:{
                    database: "test",
                    uri: "localhost",
                    port: 27017
                }
            };

        stubServer.plugins['hapi-safe-stop'] = {
            safeStop: function(){
                return;
            }
        };

        beforeEach(function(done) {
            npmModule.__set__('Db', function () {
                return { };
            });

            npmModule.__set__('ServerMongoDB', function () {
                return { };
            });

            done();
        });

        afterEach(function(done) {
            expectDriver = undefined;

            done();
        });

        describe('MongoDb Driver getConnection method', function() {
            it('is not undefined and is a function', function(done) {
                expect(npmModule.getConnection).to.not.be.undefined;
                expect(typeof npmModule.getConnection).to.equal('function');
                done();
            });

            it('return an object', function(done) {
                expectDriver = npmModule.getConnection(stubOptions);

                expect(expectDriver).to.not.be.undefined;
                expect(typeof expectDriver).to.equal('object');

                done();
            });
        });

        describe('MongoDb Driver closeFunction method', function() {
            it('is not undefined and is a function', function(done) {
                expect(npmModule.closeFunction).to.not.be.undefined;
                expect(typeof npmModule.closeFunction).to.equal('function');
                done();
            });

            it('return a function', function(done) {
                expectDriver = npmModule.closeFunction(stubServer, "test server");

                expect(expectDriver).to.not.be.undefined;
                expect(typeof expectDriver).to.equal('function');

                done();
            });

            it('called once safeStop', function(done) {
                var testSpy = sinon.spy(stubServer.plugins['hapi-safe-stop'], "safeStop");
                expectDriver = npmModule.closeFunction(stubServer, "test server");

                expectDriver();
                expect(testSpy.calledOnce).to.be.ok;

                done();
            });
        });

        describe('MongoDb Driver openConnection method', function() {
            it('is not undefined and is a function', function(done) {
                expect(npmModule.openConnection).to.not.be.undefined;
                expect(typeof npmModule.openConnection).to.equal('function');
                done();
            });

            it('return a function', function(done) {
                expectDriver = npmModule.openConnection(stubServer, "test server", function(){});

                expect(expectDriver).to.not.be.undefined;
                expect(typeof expectDriver).to.equal('function');

                done();
            });

            it('expose driver object on db param', function(done) {
                expectDriver = npmModule.openConnection(stubServer, "test server", function(){
                    expect(testDriver).to.not.be.undefined;

                    expect(testDriver.name).to.not.be.empty;

                    expect(testDriver.method).to.exist;

                    done();
                });

                expectDriver(null, {'connection':'fake'});

                //done();
            });

            it('called once next', function(done) {
                var testSpy = sinon.spy();
                expectDriver = npmModule.openConnection(stubServer, "test server", testSpy);

                expectDriver();
                expect(testSpy.calledOnce).to.be.ok;

                done();
            });
        });
    });
});
