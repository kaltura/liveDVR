/**
 * Created by elad.benedict on 8/30/2015.
 */

var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var Q = require('q');

describe('Entry downloader spec', function() {

    var flavorDownloaderMock;

    var createEntryDownloader = function (customizeMocks) {

        var loggerMock = {
            info : sinon.stub(),
            error : sinon.stub(),
            debug : sinon.stub(),
            warn : sinon.stub(),
        };

        flavorDownloaderMock = {
            stop : sinon.stub().returns(Q.resolve()),
            start : sinon.stub().returns(Q.resolve()),
            on : sinon.stub()
        };
        var flavorDownloaderCtorMock = sinon.stub().returns(flavorDownloaderMock);


        masterManifestGeneratorMock = {
            getAllFlavors : sinon.stub().returns(Q([
                {
                    bandwidth : 400000,
                    liveURL : 'http://someLiveURL/1',
                    entryId : 'entry1'
                },
                {
                    bandwidth : 600000,
                    liveURL : 'http://someLiveURL/2',
                    entryId : 'entry2'
                },
                {
                    bandwidth : 900000,
                    liveURL : 'http://someLiveURL/2',
                    entryId : 'entry2'
                }
            ]))
        };

        var masterManifestGeneratorCreatorMock = sinon.stub().returns(masterManifestGeneratorMock);

        var mocks = {
            './logger/logger' : sinon.stub().returns(loggerMock),
            './FlavorDownloader' : flavorDownloaderCtorMock,
            './MasterManifestGenerator' : masterManifestGeneratorCreatorMock
        };

        if (customizeMocks) {
            customizeMocks(mocks);
        }

        var entryDownloaderCtor = proxyquire('../../lib/EntryDownloader', mocks);
        return new entryDownloaderCtor('12345', 'host', 8888, 'appName');
    };

    it('should succeed starting if all downloaders and manifest generator succeed starting', function (done) {

        var entryDownloader = createEntryDownloader();
        entryDownloader.start().then(function(){
            done();
        }).done(null, function(err){
            done(err);
        });
    });

    it('should fail starting if manifest generator fails to start', function (done) {

        var injectMock = function(){
            masterManifestGeneratorMock.getAllFlavors = sinon.stub().returns(Q.reject());
        };

        var entryDownloader = createEntryDownloader(injectMock);
        entryDownloader.start().then(function(){
            done(new Error('Start should fail'));
        }, function (){
            done();
        });
    });

    it('should fail starting if all of the downloaders fail to start', function (done) {

        var injectMock = function(){
            flavorDownloaderMock.start.returns(Q.reject());
        };

        var entryDownloader = createEntryDownloader(injectMock);
        entryDownloader.start().then(function(){
            done(new Error('Start should fail'));
        }).done(null, function(){
            expect(flavorDownloaderMock.start.callCount).to.equal(3);
            done();
        });
    });

    it('should succeed starting if one of the downloader fails to start', function (done) {

        var injectMock = function(){
            flavorDownloaderMock.start.onSecondCall().returns(Q.reject());
        };

        var entryDownloader = createEntryDownloader(injectMock);
        entryDownloader.start().then(function(){
            expect(flavorDownloaderMock.start.callCount).to.equal(3);
            done();
        }).done(null, function(err){
            done(err);
        });
    });

    it('should succeed stopping if all the downloaders succeed to stop', function (done) {

        var entryDownloader = createEntryDownloader();
        entryDownloader.start().then(function(){
            entryDownloader.stop();
        }).then(function(){
            expect(flavorDownloaderMock.stop.callCount).to.equal(3);
            done();
        }).done(null, function(err){
            done(err);
        });
    });
});

