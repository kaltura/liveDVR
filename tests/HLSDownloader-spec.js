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
        Q.delay(1000).done(function(){
            expect(mocks['./DownloadUtils'].downloadFile.callCount).to.be.at.least(2);
            done();
        });
    });
});
