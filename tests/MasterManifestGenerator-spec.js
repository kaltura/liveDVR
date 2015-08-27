/**
 * Created by elad.benedict on 8/23/2015.
 */

var proxyquire = require('proxyquire');
var m3u8Parser = require('../lib/promise-m3u8');
var fs = require('fs');
var sinon = require('sinon');
var Q = require('Q');
var chai = require('chai');
var expect = chai.expect;
var path = require('path');
PlaylistItem = require('m3u8/m3u/PlaylistItem');

describe('MasterManifestGenerator spec', function() {

    it('should get master manifest', function(done){
        var masterManifestCreator = createMasterManifestGenerator();
        masterManifestCreator.getManifest('mbr').done(function(m3u){
            expect(m3u.items.StreamItem.length).to.equal(3);
            expect(m3u.items.StreamItem[0].get('uri')).to.eql(path.normalize('/home/dev/DVR/12345/475136'));
            expect(m3u.items.StreamItem[1].get('uri')).to.eql(path.normalize('/home/dev/DVR/12345/555555'));
            expect(m3u.items.StreamItem[2].get('uri')).to.eql(path.normalize('/home/dev/DVR/12345/679936'));
            done();
        });
    });

    it('should request correct manifest', function(done){
        var mocks;
        var masterManifestCreator = createMasterManifestGenerator(function(m){
            mocks = m;
        });
        masterManifestCreator.getManifest('mbr').done(function() {
            expect(mocks['./NetworkClientFactory'].getNetworkClient().read.firstCall.args[0]).to.eql("http://localhost:1935/test/smil:12345_mbr.smil/playlist.m3u8");
            done();
        });
    });

    it('should exclude port if not supplied', function(done){
        var mocks;
        var customizeMocksFunction = function(m){
            mocks = m;
        };
        var customizeCtorParamsFunction = function(){
            return ['12345', 'localhost', null, 'test', 'http://basePath'];
        };
        var masterManifestCreator = createMasterManifestGenerator(customizeMocksFunction, customizeCtorParamsFunction);

        masterManifestCreator.getManifest('mbr').done(function() {
            expect(mocks['./NetworkClientFactory'].getNetworkClient().read.firstCall.args[0]).to.eql("http://localhost/test/smil:12345_mbr.smil/playlist.m3u8");
            done();
        });
    });

    it('should request all manifest by default', function(done){
        var mocks;

        var customizeMocksFunction = function(m){
            mocks = m;
        };
        var masterManifestCreator = createMasterManifestGenerator(customizeMocksFunction);
        masterManifestCreator.getManifest().done(function() {
            expect(mocks['./NetworkClientFactory'].getNetworkClient().read.firstCall.args[0]).to.eql("http://localhost:1935/test/smil:12345_all.smil/playlist.m3u8");
            done();
        });
    });

    it('should get all flavors', function(done){
        var masterManifestCreator = createMasterManifestGenerator();
        masterManifestCreator.getAllFlavors().done(function(flavorsData) {
            expect(flavorsData.length).to.equal(3);
            expect(flavorsData[0]).to.eql({
                bandwidth : 475136,
                liveURL : 'http://kalsegsec-a.akamaihd.net/dc-1/m/ny-live-publish1/kLive/smil:1_oorxcge2_publish.smil/chunklist_b475136.m3u8',
                entryId : '12345'
            });
            done();
        });
    });

    function createMasterManifestGenerator(customizeMocks, customizeCtorParams) {

        var m3u8 = '#EXTM3U' + '\n' +
              '#EXT-X-VERSION:3' + '\n' +
              '#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=475136' + '\n' +
              'http://kalsegsec-a.akamaihd.net/dc-1/m/ny-live-publish1/kLive/smil:1_oorxcge2_publish.smil/chunklist_b475136.m3u8' + '\n' +
              '#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=555555' + '\n' +
              'http://kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish3/kLive/smil:1_oorxcge2_publish.smil/chunklist_b475136.m3u8' + '\n' +
              '#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=679936' + '\n' +
              'http://kalsegsec-a.akamaihd.net/dc-1/m/ny-live-publish1/kLive/smil:1_oorxcge2_publish.smil/chunklist_b679936.m3u8';


        var networkClientStub = {
            read: sinon.stub().returns(Q(m3u8))
        };
        var networkClientFactoryMock = {
            getNetworkClient : function() {
                return networkClientStub;
            }
        };

        var mocks = {
            './NetworkClientFactory' : networkClientFactoryMock
        };

        if (customizeMocks) {
            customizeMocks(mocks);
        }

        ctorParams = ['12345', 'localhost', 1935, 'test', '/basePath'];

        if (customizeCtorParams){
            ctorParams = customizeCtorParams();
        }

        var proxyquireMasterManifestCtor = proxyquire('../lib/MasterManifestGenerator', mocks);
        var masterManifestGenerator = proxyquireMasterManifestCtor.apply(null, ctorParams);
        return masterManifestGenerator;
    }
});