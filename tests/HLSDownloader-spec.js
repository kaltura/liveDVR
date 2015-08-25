/**
 * Created by elad.benedict on 8/25/2015.
 */

var proxyquire = require('proxyquire');
var m3u8 = require('m3u8');
var fs = require('fs');
var sinon = require('sinon');
var Q = require('Q');
var chai = require('chai');
var expect = chai.expect;
var path = require('path');

describe('M3U8 Generator tests', function() {

    var clock;
    beforeEach(function(){
        clock = sinon.useFakeTimers();
    });

    afterEach(function(){
        clock.restore();
    });

    function createHLSDownloader(customizeMocks) {
        var downloadUtilsMock = {
            downloadFile : sinon.stub().returns(Q.reject(new Error("oops!")))
        };

        var mocks = {
            './DownloadUtils' : downloadUtilsMock
        };

        if (customizeMocks) {
            customizeMocks(mocks);
        }

        console.log(path.join(__dirname, '../lib/HLSDownloader.js'));
        var hlsDownloaderCtor = proxyquire(path.join(__dirname, '../lib/HLSDownloader'), mocks);
        var hlsDownloader = new hlsDownloaderCtor("http://kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish3/kLive/smil:1_oorxcge2_publish.smil/chunklist_b475136.m3u8", "/Users/AsherS/Downloads/DVR");
        return hlsDownloader;
    }

    it.only('Should handle network failures gracefully)', function (done) {
        var mocks;
        var downloader = createHLSDownloader(function (m){
            mocks = m;
        });
        downloader.start();
        clock.tick(9000);
        expect(mocks['./DownloadUtils'].downloadFile.callCount).to.equal(1);
        clock.tick(2000);
        expect(mocks['./DownloadUtils'].downloadFile.callCount).to.equal(2);
        done();
    });
});
