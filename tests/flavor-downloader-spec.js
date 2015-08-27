/**
 * Created by AsherS on 8/24/15.
 */

var Q = require('q');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var m3u8promise = require('../lib/promise-m3u8');
var chai = require('chai');
var expect = chai.expect;

describe('flavor-downloader tests', function() {

    var flavorDownloader = '../lib/flavor-downloader';

    var clock;
    beforeEach(function () {
        clock = sinon.useFakeTimers();
    });

    afterEach(function () {
        clock.restore();
    });

    function generateHttpUtilsMock(isReject) {
        var func = isReject ? Q.reject : Q.resolve;
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

    it('should download all files successfully', function (done) {

        var mocks = {};
        mocks['./utils/http-utils'] = generateHttpUtilsMock();
        mocks['q-io/fs'] = generateQioMock([]);
        mocks['./ChunklistManifestGenerator'] = generateChunklistM3umGeneratorMock();
        mocks['./promise-m3u8'] = generatePromiseM3u8Mock('/Users/AsherS/Projects/liveDVR/tests/resources/flavor-downloader-data/simpleManifest.m3u8');

        var flavorDownloaderMock = proxyquire(flavorDownloader, mocks);

        var flavorDownloaderObj = new flavorDownloaderMock('m3u8Url', 'destPath', 'entryId', 'flavor', 'newPlaylistName');
        flavorDownloaderObj.start();

        flavorDownloaderObj.on("iteration-end", function () {
            try {
                expect(mocks['./utils/http-utils'].downloadFile.callCount).to.eql(6);
                done();
            } catch(e) {
                done(e);
            }
        });
    });

    it('should try to download failed ts again', function (done) {

        var mocks = {};
        var listOfFiles = ['media-uefvqmelj_b1017600_11.ts', 'media-uefvqmelj_b1017600_12.ts', 'media-uefvqmelj_b1017600_13.ts', 'media-uefvqmelj_b1017600_15.ts'];

        mocks['./utils/http-utils'] = generateHttpUtilsMock();
        mocks['q-io/fs'] = generateQioMock(listOfFiles);
        mocks['./ChunklistManifestGenerator'] = generateChunklistM3umGeneratorMock();
        mocks['./promise-m3u8'] = generatePromiseM3u8Mock('/Users/AsherS/Projects/liveDVR/tests/resources/flavor-downloader-data/simpleManifest.m3u8');

        var flavorDownloaderMock = proxyquire(flavorDownloader, mocks);
        var flavorDownloaderObj = new flavorDownloaderMock('m3u8Url', 'destPath', 'entryId', 'flavor', 'newPlaylistName');

        flavorDownloaderObj.start();

        flavorDownloaderObj.on("iteration-end", function () {
            try {
                expect(mocks['./utils/http-utils'].downloadFile.callCount).to.eql(2);
                done();
            } catch(e) {
                done(e);
            }
        });
    });

    it('should shutdown downloader after 1 iteration', function (done) {

        var mocks = {};
        mocks['./utils/http-utils'] = generateHttpUtilsMock();
        mocks['q-io/fs'] = generateQioMock([]);
        mocks['./ChunklistManifestGenerator'] = generateChunklistM3umGeneratorMock();
        mocks['./promise-m3u8'] = generatePromiseM3u8Mock('/Users/AsherS/Projects/liveDVR/tests/resources/flavor-downloader-data/simpleManifest.m3u8');

        var flavorDownloaderMock = proxyquire(flavorDownloader, mocks);
        var flavorDownloaderObj = new flavorDownloaderMock('m3u8Url', 'destPath', 'entryId', 'flavor', 'newPlaylistName');

        flavorDownloaderObj.start();
        var iterationEndStub = sinon.stub();
        flavorDownloaderObj.on("iteration-start", iterationEndStub);
        flavorDownloaderObj.on("iteration-end", function () {
            expect(iterationEndStub.callCount).to.eql(1);
            expect(mocks['./utils/http-utils'].downloadFile.callCount).to.eql(6);
            flavorDownloaderObj.stop();
            clock.tick(10000);
            try {
                expect(iterationEndStub.callCount).to.eql(1);
                done();
            } catch(e) {
                done(e);
            }
        });
    });

    it('should recover after failed manifest download', function (done) {

        var mocks = {};
        mocks['./utils/http-utils'] = generateHttpUtilsMock(true);
        mocks['q-io/fs'] = generateQioMock([]);
        mocks['./ChunklistManifestGenerator'] = generateChunklistM3umGeneratorMock();
        mocks['./promise-m3u8'] = generatePromiseM3u8Mock('/Users/AsherS/Projects/liveDVR/tests/resources/flavor-downloader-data/simpleManifest.m3u8');

        var flavorDownloaderMock = proxyquire(flavorDownloader, mocks);
        var flavorDownloaderObj = new flavorDownloaderMock('m3u8Url', 'destPath', 'entryId', 'flavor', 'newPlaylistName');

        var iterationStartStub = sinon.stub();
        flavorDownloaderObj.on("iteration-start", iterationStartStub);

        flavorDownloaderObj.start();
        flavorDownloaderObj.on("iteration-error", function () {
            expect(mocks['./utils/http-utils'].downloadFile.callCount).to.eql(1);
            expect(iterationStartStub.callCount).to.eql(1);
            clock.tick(10000);
            try {
                expect(mocks['./utils/http-utils'].downloadFile.callCount).to.eql(2);
                expect(iterationStartStub.callCount).to.eql(2);
                done();
            } catch(e) {
                done(e);
            }
        });
    });

    it('should recover after failed ts download', function (done) {

        var stub = sinon.stub();
        stub.onCall(3).returns(Q.reject());
        stub.returns(Q.resolve());

        var httpUtilsMock = {
            downloadFile: stub
        };

        var mocks = {};
        mocks['./utils/http-utils'] = httpUtilsMock;
        mocks['q-io/fs'] = generateQioMock([]);
        mocks['./ChunklistManifestGenerator'] = generateChunklistM3umGeneratorMock();
        mocks['./promise-m3u8'] = generatePromiseM3u8Mock('/Users/AsherS/Projects/liveDVR/tests/resources/flavor-downloader-data/simpleManifest.m3u8');

        var flavorDownloaderMock = proxyquire(flavorDownloader, mocks);
        var flavorDownloaderObj = new flavorDownloaderMock('m3u8Url', 'destPath', 'entryId', 'flavor', 'newPlaylistName');

        var iterationStartStub = sinon.stub();
        flavorDownloaderObj.on("iteration-start", iterationStartStub);

        flavorDownloaderObj.start();
        flavorDownloaderObj.on("iteration-error", function (err) {
            expect(mocks['./utils/http-utils'].downloadFile.callCount).to.eql(6);
            expect(iterationStartStub.callCount).to.eql(1);
            clock.tick(10000);
            try {
                expect(iterationStartStub.callCount).to.eql(2);
                done();
            } catch(e) {
                done(e);
            }
        });
    });
});
