/**
 * Created by AsherS on 8/24/15.
 */

var proxyquire = require('proxyquire');
var sinon = require('sinon');
var Q = require('q');
var chai = require('chai');
var expect = chai.expect;
var os = require('os');
var path = require('path');
var qio = require('q-io/fs');

describe('http-utils tests', function() {

    var httpUtils = '../../lib/utils/http-utils';

    var createHttpUtils = function(mocks){
        var loggerStub = {
            info : sinon.stub(),
            debug : sinon.stub(),
            error : sinon.stub()
        };

        return proxyquire(httpUtils, mocks)(loggerStub);
    };

    function getNetworkClientMock(func) {
        var networkClientStub = {
            read: sinon.stub().returns(func())
        };

        var networkClientFactoryMock = {
            getNetworkClient : function() {
                return networkClientStub;
            }
        };

        return {
            '../NetworkClientFactory' : networkClientFactoryMock
        };
    }

    it('should succeed', function (done) {

        var text = "hello world!";
        var func = function () {
            return Q.resolve(text);
        };

        var mocks = getNetworkClientMock(func);
        var proxyHttpUtils = createHttpUtils(mocks);
        var destinationFile = path.join(os.tmpdir(), "tmp_test_file.txt");

        proxyHttpUtils.downloadFile('some_url', destinationFile ,10000)
            .done(function success() {
                qio.read(destinationFile)
                    .then(function(data) {
                        expect(data).to.equal(text);
                        done();
                    });
            });
    });

    it('should fail due to rejected promise', function (done) {
        var func = function () {
            return Q.reject();
        };

        var mocks = getNetworkClientMock(func);
        var proxyHttpUtils = createHttpUtils(mocks);
        var destinationFile = path.join(os.tmpdir(), "tmp_test_file.txt");

        proxyHttpUtils.downloadFile('some_url', destinationFile, 10000)
            .done(function success() {
                throw new Error("Promise is fulfilled instead of rejected");
            }, function failure() {
                done();
            });
    });

    it('should fail on write', function (done) {

        var func = function () {
            return Q.resolve("should resolve read");
        };

        var qfsMock = {
            write: sinon.stub().returns(Q.reject("should fail on rejected write"))
        };

        var mocks = getNetworkClientMock(func);
        mocks['q-io/fs'] = qfsMock;
        var proxyHttpUtils = createHttpUtils(mocks);

        proxyHttpUtils.downloadFile('some_url', "some_dest", 2000)
            .done(function success() {
                throw new Error("Promise is fulfilled instead of rejected");
            }, function failure() {
                done();
            });
    });
});

