/**
 * Created by elad.benedict on 8/23/2015.
 */

var proxyquire = require('proxyquire');
var sinon = require('sinon');
var Q = require('q');
var chai = require('chai');
var expect = chai.expect;
PlaylistItem = require('m3u8/m3u/PlaylistItem');

describe('MasterManifestGenerator spec', function() {

    it('should get master manifest', function(done){
        var masterManifestCreator = createMasterManifestGenerator();
        masterManifestCreator.getManifest('http://wowza:1935/kLive/smil:testStream.smil/playlist.m3u8', 'mbr').done(function(m3u){
            expect(m3u.items.StreamItem.length).to.equal(3);
            expect(m3u.items.StreamItem[0].get('uri')).to.eql('../../kLive/12345/475136/manifest.m3u8');
            expect(m3u.items.StreamItem[1].get('uri')).to.eql('../../kLive/12345/555555/manifest.m3u8');
            expect(m3u.items.StreamItem[2].get('uri')).to.eql('../../kLive/12345/679936/manifest.m3u8');
            done();
        });
    });

    it('should request correct manifest', function(done){
        var mocks;
        var masterManifestCreator = createMasterManifestGenerator(function(m){
            mocks = m;
        });
        masterManifestCreator.getManifest('http://someRequestedPath', 'mbr').done(function() {
            expect(mocks['./NetworkClientFactory'].getNetworkClient().read.firstCall.args[0]).to.eql("http://localhost:1935/test/smil:12345_mbr.smil/playlist.m3u8");
            done();
        });
    });

    it('should not use any port if port is not supplied', function(done){
        var mocks;
        var customizeMocksFunction = function(m){
            mocks = m;
        };

        var logger = {
            trace : sinon.stub(),
            debug : sinon.stub(),
            info: sinon.stub(),
            warn : sinon.stub(),
            error: sinon.stub(),
            fatal: sinon.stub()
        };
        var customizeCtorParamsFunction = function(){
            return ['12345', 'localhost', null, 'test', logger];
        };
        var masterManifestCreator = createMasterManifestGenerator(customizeMocksFunction, customizeCtorParamsFunction);

        masterManifestCreator.getManifest('http://someRequestedPath', 'mbr').done(function() {
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
        masterManifestCreator.getManifest("http://someRequestedPath").done(function() {
            expect(mocks['./NetworkClientFactory'].getNetworkClient().read.firstCall.args[0]).to.eql("http://localhost:1935/test/smil:12345_all.smil/playlist.m3u8");
            done();
        });
    });

    it('should get all flavors for absolute URLs', function(done){
        var masterManifestCreator = createMasterManifestGenerator(null, null, true);
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

    it('should get all flavors for relative URLs', function(done){
        var masterManifestCreator = createMasterManifestGenerator();
        masterManifestCreator.getAllFlavors().done(function(flavorsData) {
            expect(flavorsData.length).to.equal(3);
            expect(flavorsData[0]).to.eql({
                bandwidth : 475136,
                liveURL : 'http://localhost:1935/test/smil:12345_all.smil/chunklist_b475136.m3u8',
                entryId : '12345'
            });
            done();
        });
    });

    function createMasterManifestGenerator(customizeMocks, customizeCtorParams, absoluteResponse) {

        var m3u8 = '#EXTM3U' + '\n';
        m3u8+= '#EXT-X-VERSION:3' + '\n';
        m3u8+= '#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=475136' + '\n';
        m3u8+= absoluteResponse ? 'http://kalsegsec-a.akamaihd.net/dc-1/m/ny-live-publish1/kLive/smil:1_oorxcge2_publish.smil/chunklist_b475136.m3u8' :'chunklist_b475136.m3u8';
        m3u8+='\n';
        m3u8+= '#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=555555' + '\n';
        m3u8+= absoluteResponse ? 'http://kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish3/kLive/smil:1_oorxcge2_publish.smil/chunklist_b555555.m3u8' : 'chunklist_b555555';
        m3u8+='\n';
        m3u8+= '#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=679936' + '\n';
        m3u8+= absoluteResponse ? 'http://kalsegsec-a.akamaihd.net/dc-1/m/ny-live-publish1/kLive/smil:1_oorxcge2_publish.smil/chunklist_b679936.m3u8' : 'chunklist_b679936.m3u8';

        var networkClientStub = {
            read: sinon.stub().returns(Q(m3u8))
        };
        var networkClientFactoryMock = {
            getNetworkClient : function() {
                return networkClientStub;
            }
        };

        var loggerMock = {
            trace : sinon.stub(),
            debug : sinon.stub(),
            info: sinon.stub(),
            warn : sinon.stub(),
            error: sinon.stub(),
            fatal: sinon.stub()
        };

        var mocks = {
            './NetworkClientFactory' : networkClientFactoryMock
        };

        if (customizeMocks) {
            customizeMocks(mocks);
        }

        ctorParams = ['12345', 'localhost', 1935, 'test', loggerMock];

        if (customizeCtorParams){
            ctorParams = customizeCtorParams();
        }

        var proxyquireMasterManifestCtor = proxyquire('../../lib/MasterManifestGenerator', mocks);
        var masterManifestGenerator = proxyquireMasterManifestCtor.apply(null, ctorParams);
        return masterManifestGenerator;
    }
});