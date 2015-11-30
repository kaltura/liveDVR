/**
 * Created by AsherS on 8/24/15.
 */

var Q = require('q');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var m3u8promise = require('../../lib/promise-m3u8');
var chai = require('chai');
var expect = chai.expect;
var path = require('path');

describe('flavor-downloader tests', function() {
    var mocks;
    var clock;

    beforeEach(function () {
        clock = sinon.useFakeTimers();
    });

    afterEach(function () {
        clock.restore();
    });

    function generateHttpUtilsMock(isReject) {
        var reject = function(){
            return Q.reject(new Error());
        };
        var func = isReject ? reject : Q.resolve;
        var httpUtilsMock = {
            downloadFile: sinon.stub().returns(func())
        };

        return httpUtilsMock;
    }

    function generatePromiseM3u8Mock(path) {
        var m3u8Mock = {
            parseM3U8: sinon.stub().returns(m3u8promise.parseM3U8(path))
        };
        return m3u8Mock;
    }

    function generateQioMock(listOfFiles) {
        var qioMock = {
            list: sinon.stub().returns(Q.resolve(listOfFiles)),
            makeTree: sinon.stub().returns(Q.resolve())
        };
        return qioMock;
    }

    function generateChunklistM3umGeneratorMock(isReject) {
        var func = isReject ? Q.reject : Q.resolve;
        var m3u8Mock = {
            init: sinon.stub().returns(Q.resolve()),
            update: sinon.stub().returns(func())
        };

        return sinon.stub().returns(m3u8Mock);
    }

    function getFlavorDownloader(updateMocks) {
        var mockObjects = {};
        mockObjects['./utils/http-utils'] = generateHttpUtilsMock();
        mockObjects['q-io/fs'] = generateQioMock([]);
        mockObjects['./TwoPhasedChunklistManifestGenerator'] = generateChunklistM3umGeneratorMock();
        mockObjects['./promise-m3u8'] = generatePromiseM3u8Mock(path.join(__dirname, '/../resources/flavor-downloader-data/simpleManifest.m3u8'));
        mockObjects['./logger/logger'] = sinon.stub().returns({
            info: sinon.stub(),
            error: sinon.stub(),
            warn: sinon.stub(),
            debug: sinon.stub()
        });

        if (updateMocks) {
            updateMocks(mockObjects);
        }

        mocks = mockObjects;

        var flavorDownloaderCtor = proxyquire('../../lib/FlavorDownloader', mockObjects);
        var flavorDownloader = new flavorDownloaderCtor('m3u8Url', 'destPath', 'entryId', 'flavor', 'newPlaylistName');
        return flavorDownloader;
    }

    it('should download all files successfully', function (done) {
        var flavorDownloader = getFlavorDownloader();
        flavorDownloader.on("iteration-end", function() {
            try {
                expect(mocks['./utils/http-utils'].downloadFile.callCount).to.eql(6);
                done();
            }
            catch (err) {
                done(err);
            }
        });
        flavorDownloader.start();
    });

    it('should try to download failed ts again', function (done) {
        var listOfFiles = ['media-uefvqmelj_b1017600_11.ts', 'media-uefvqmelj_b1017600_12.ts', 'media-uefvqmelj_b1017600_13.ts', 'media-uefvqmelj_b1017600_15.ts'];
        var flavorDownloader = getFlavorDownloader(function (mocks) {
            mocks['q-io/fs'] = generateQioMock(listOfFiles);
        });

        flavorDownloader.on("iteration-end", function () {
            try {
                expect(mocks['./utils/http-utils'].downloadFile.callCount).to.eql(2);
                done();
            } catch (e) {
                done(e);
            }
        });

        flavorDownloader.start();
    });

    it('should shutdown downloader after 1 iteration', function (done) {
        var flavorDownloader = getFlavorDownloader();
        var iterationStartCallback = sinon.stub();
        flavorDownloader.on("iteration-start", iterationStartCallback);
        flavorDownloader.on("iteration-end", function () {
            try {
                expect(iterationStartCallback.callCount).to.eql(1);
                expect(mocks['./utils/http-utils'].downloadFile.callCount).to.eql(6);
                flavorDownloader.stop();
                clock.tick(10000);
                expect(iterationStartCallback.callCount).to.eql(1);
                done();
            }
            catch (e) {
                done(e);
            }
        });
        flavorDownloader.start();
    });
    it('should recover after failed manifest download', function (done) {
        var flavorDownloader = getFlavorDownloader(function (mocks) {
            mocks['./utils/http-utils'] = generateHttpUtilsMock(true);
        });

        var iterationStartStub = sinon.stub();
        flavorDownloader.on("iteration-start", iterationStartStub);
        flavorDownloader.on("iteration-end", function () {
            expect(mocks['./utils/http-utils'].downloadFile.callCount).to.eql(1);
            expect(iterationStartStub.callCount).to.eql(1);
            clock.tick(10000);
            try {
                expect(mocks['./utils/http-utils'].downloadFile.callCount).to.eql(2);
                expect(iterationStartStub.callCount).to.eql(2);
                done();
            } catch (e) {
                done(e);
            }
        });
        flavorDownloader.start();
    });

    it('should recover after failed ts download', function (done) {
        var stub = sinon.stub();
        stub.onCall(3).returns(Q.reject());
        stub.returns(Q.resolve());

        var httpUtilsMock = {
            downloadFile: stub
        };

        var flavorDownloader = getFlavorDownloader(function (mocks) {
            mocks['./utils/http-utils'] = httpUtilsMock;
        });

        var iterationStartStub = sinon.stub();
        flavorDownloader.on("iteration-start", iterationStartStub);
        flavorDownloader.on("iteration-end", function () {
            expect(mocks['./utils/http-utils'].downloadFile.callCount).to.eql(6);
            expect(iterationStartStub.callCount).to.eql(1);
            clock.tick(10000);
            try {
                expect(iterationStartStub.callCount).to.eql(2);
                done();
            } catch (e) {
                done(e);
            }
        });

        flavorDownloader.start();
    });

    it('should fail after m3u8generator.init() failed', function (done) {
        var flavorDownloader = getFlavorDownloader(function (mocks) {
            mocks['./TwoPhasedChunklistManifestGenerator']= sinon.stub().returns(m3u8Mock);
        });
        var m3u8Mock = {
            init: sinon.stub().returns(Q.reject(new Error()))
        };
            flavorDownloader.start()
                .then(
                function(){
                    done("Promise should failed")
                }
                ,
                function(){
        done()
                }
            )
    });

});