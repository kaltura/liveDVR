/**
 * Created by elad.benedict on 8/31/2015.
 */

var chai = require('chai');
var expect = chai.expect;
var Q = require('Q');
var tmp = require('tmp');
var path = require('path');
var _ = require('underscore');
var fs = require('fs');

describe('Worker component spec', function() {

    var networkClientMock;
    var tmpFolderObj;
    var wowzaMock;
    var worker;

    beforeEach(function(){
        var config = require('../../lib/Configuration');
        config.set('pollingInterval', 100);
        config.set('mockNetwork', true);
        config.set('mockBackend', true);

        config.set("mediaServer:hostname", "mediaServerHost");
        config.set("applicationName", "kLive");

        tmpFolderObj = tmp.dirSync({keep : true});
        console.log(tmpFolderObj.name)
        config.set('rootFolderPath', tmpFolderObj.name);
        console.log(config.get('rootFolderPath'));
        config.set('logFileName', path.join(tmpFolderObj.name, 'filelog-info.log'));

        networkClientMock = require('../../lib/NetworkClientFactory').getNetworkClient();
        wowzaMock = require('../mocks/wowzaMock')(networkClientMock);
        workerCtor = require('../../lib/Worker');
        worker = new workerCtor();
        worker.start();
    });

    afterEach(function(){
        delete require.cache[require.resolve('../../lib/mocks/NetworkClientMock')];
    })

    var validateFlavor = function(flavor){
        var flavorDir = path.join(tmpFolderObj.name, '12345', flavor);
        var filesInFlavorFolder = fs.readdirSync(flavorDir);
        console.log("Validating content of " + flavorDir);
        var expectedFileNamePattern = new RegExp(flavor + ".*\.ts$");
        var tsFiles = _.filter(filesInFlavorFolder, function(f){
            return f.match(expectedFileNamePattern);
        });
        expect(tsFiles.length).to.be.equal(24);
    };

    var validateFlavors = function(){
        _.each(['475136', '987136', '679936'], validateFlavor);
    };

    it('should download all chunks when there are no errors', function (done) {
        this.timeout(100000);
        Q.delay(10000).then(function(){
           return worker.stop();
        }).then(function(){
            validateFlavors();
            done();
        }).done(null, function(err){
            done(err);
        });
    });

    it('should download all chunks when there are chunklist read errors', function (done) {
        this.timeout(100000);

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

        Q.delay(10000).then(function(){
            return worker.stop();
        }).then(function(){
            validateFlavors();
            done();
        }).done(null, function(err){
            done(err);
        });
    });

    it('should download all chunks when there are chunk read errors', function (done) {
        this.timeout(100000);

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
            validateFlavors();
            done();
        }).done(null, function(err){
            done(err);
        });
    });
});