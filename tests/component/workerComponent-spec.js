/**
 * Created by elad.benedict on 8/31/2015.
 */

var config = require('../../common/Configuration');
var chai = require('chai');
var expect = chai.expect;
var Q = require('q');
var tmp = require('tmp');
var path = require('path');
var _ = require('underscore');
var fs = require('fs');
var rimraf = require('rimraf');


describe('Worker component spec', function() {

    var networkClientMock;
    var tmpFoldersToDelete = [];
    var wowzaMock;
    var worker;

    // HACK: grunt-mocha-test seems to ignore its option's "quiet" param which ignores console output
    // remove all logger transports to ensure nothing is written to console
    before(function(){
        config.set('logToConsole', false);
        config.set('flavorDownloaderTeardownInterval', 0);
    });

    // Delete all temp folders
    after(function(done){
        var promiseRimraf = Q.denodeify(rimraf);
        Q.fcall(function(){
            var promises = _.each(tmpFoldersToDelete, function(f){
                return promiseRimraf(f);
            });
            return Q.all(promises);
        }).done(function(){
            done();
        }, function(err){
            done(err);
        });
    });

    beforeEach(function(done){
        config.set('pollingInterval', 50);
        config.set('sessionDuration', 180000);
        config.set('mockNetwork', true);
        config.set('mockBackend', true);
        config.set('readMockBackendResponseFromFile', false);
        config.set("mediaServer:hostname", "mediaServerHost");
        config.set("mediaServer:port", null);
        config.set("applicationName", "kLive");

        var promiseTmp = Q.denodeify(tmp.dir);
        promiseTmp({keep : true}).then(function(tmpResult){
            tmpFolderPath = tmpResult[0];
            tmpFoldersToDelete.push();
            config.set('rootFolderPath', tmpFolderPath);
            config.set('oldContentFolderPath', tmpFolderPath);
            config.set('logFileName', path.join(tmpFolderPath, 'filelog-info.log'));

            networkClientMock = require('../../lib/NetworkClientFactory').getNetworkClient();
            wowzaMock = require('../mocks/wowzaMock')(networkClientMock);
            workerCtor = require('../../lib/Controller');
            worker = new workerCtor();
            worker.start();
            done();
        }).done(null, function(err){
            done(err);
        });
    });

    afterEach(function(){
        delete require.cache[require.resolve('../../lib/mocks/NetworkClientMock')];
    });

    var validateFlavor = function(flavor){
    	var persistenceFormat = require('../../common/PersistenceFormat');
        var flavorDir = persistenceFormat.getFlavorFullPath('12345', flavor.toString());
        var promiseReaddir = Q.denodeify(fs.readdir);

        return promiseReaddir(flavorDir).then(function(files){
            var expectedFileNamePattern = new RegExp(flavor + ".*\.ts$");
            var tsFiles = _.filter(files, function(f){
                return f.match(expectedFileNamePattern);
            });
            expect(tsFiles.length).to.be.equal(24);
        });
    };

    var validateFlavors = function(){
        var promises = _.map(['475136', '987136', '679936'], validateFlavor);
        return Q.all(promises);
    };

    it('should download all chunks when there are no errors', function (done) {
        this.timeout(4000);
        Q.delay(3000).then(function(){
           return worker.stop();
        }).then(function(){
            return validateFlavors();
        }).then(function(){
            done();
        }).done(null, function(err){
            done(err);
        });
    });

    it('should download all chunks when there are chunklist read errors', function (done) {
        this.timeout(4000);
        wowzaMock.read.withArgs({
            url: 'http://kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish2/kLive/smil:12345_all.smil/chunklist_b475136.m3u8',
            timeout: 10000
        }).onCall(3).returns(Q.reject("Whoops!"));

        wowzaMock.read.withArgs({
            url: 'http://kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish2/kLive/smil:12345_all.smil/chunklist_b679936.m3u8',
            timeout: 10000
        }).onCall(4).returns(Q.reject("Whoops!"));

        wowzaMock.read.withArgs({
            url: 'http://kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish2/kLive/smil:12345_all.smil/chunklist_b679936.m3u8',
            timeout: 10000
        }).onCall(5).returns(Q.reject("Whoops!"));

        Q.delay(3000).then(function(){
            return worker.stop();
        }).then(function(){
            return validateFlavors();
        }).then(function(){
            done();
        }).done(null, function(err){
            done(err);
        });
    });

    it('should download all chunks when there are chunk read errors', function (done) {
        this.timeout(4000);
        wowzaMock.read.withArgs({
            url: 'http://kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish2/kLive/smil:12345_all.smil/media-uia99r2td_b475136_7.ts',
            timeout: 10000
        }).onCall(0).returns(Q.reject("Whoops!"));

        wowzaMock.read.withArgs({
            url: 'http://kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish2/kLive/smil:12345_all.smil/media-uia99r2td_b475136_7.ts',
            timeout: 10000
        }).onCall(1).returns(Q.reject("Whoops!"));

        wowzaMock.read.withArgs({
            url: 'http://kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish2/kLive/smil:12345_all.smil/media-uia99r2td_b475136_7.ts',
            timeout: 10000
        }).onCall(2).returns(Q.reject("Whoops!"));

        Q.delay(3000).then(function(){
            return worker.stop();
        }).then(function(){
            return validateFlavors();
        }).then(function(){
            done();
        }).done(null, function(err){
            done(err);
        });
    });

    it('should download all chunks when stopped in mid broadcast and starting a new worker', function (done) {
        this.timeout(4000);
        var newWorker;
        Q.delay(1500).then(function () {
            return worker.stop();
        }).then(function () {
            return validateFlavors().then(function () {
                // Validation should not pass at this (early) stage
                done(new Error('validation should NOT pass'));
            }, function () {
                // Validation failure is expected - carry on
            });
        }).then(function () {
            workerCtor = require('../../lib/Controller');
            newWorker = new workerCtor();
            return newWorker.start();
        }).then(function () {
            return Q.delay(1500);
        }).then(function () {
            return worker.stop();
        }).then(function () {
            return validateFlavors();
        }).then(function () {
            done();
        }).done(null, function (err) {
            done(err);
        });
    });
});
