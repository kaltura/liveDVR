/**
 * Created by elad.benedict on 8/23/2015.
 */

var proxyquire = require('proxyquire');
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;
var path = require('path');
var sinon = require('sinon');

describe('Promise m3u8 spec', function() {

    var createParser = function(customizeMocks){

        var readStreamMock = {
            on : sinon.stub()
        };

        var mocks = {
            'fs' : {
                createReadStream : sinon.stub().returns(readStreamMock)
            }
        };

        readStreamMock.on.withArgs('error').callsArgWithAsync(1, new Error("Whoops!"));

        if (customizeMocks) {
            customizeMocks(mocks);
        }

        var parser = proxyquire('../../lib/manifest/promise-m3u8', mocks);
        return parser;
    };

    it('should correctly read an M3U8', function(done)
    {
        var m3u8Parser = require('../../lib/manifest/promise-m3u8');
        var expectedManifest = fs.readFileSync(path.join(__dirname, '/../resources/simpleManifest.m3u8'), 'utf8');

        m3u8Parser.parseM3U8(path.join(__dirname, '/../resources/simpleManifest.m3u8')).then(function(manifest){
            expect(manifest.toString()).to.eql(expectedManifest.replace(/[\r]/g, ''));
        }).done(function(){
            done();
        });
    });

    it('should correctly read from a stream', function(done)
    {
        var m3u8Parser = require('../../lib/manifest/promise-m3u8');
        var expectedManifest = fs.readFileSync(path.join(__dirname, '/../resources/simpleManifest.m3u8'), 'utf8');

        var Readable = require('stream').Readable;
        var s = new Readable();
        s.push(expectedManifest);
        s.push(null); // Stream end

        m3u8Parser.parseM3U8(s).then(function(manifest){
            expect(manifest.toString()).to.eql(expectedManifest.replace(/[\r]/g, ''));
        }).done(function(){
            done();
        });
    });

    it('should return a failed promise when cannot read the referenced path', function(done)
    {
        var m3u8Parser = createParser();
        m3u8Parser.parseM3U8("nonExistantPath").then(function(){
            expect.fail();
            done(new Error("Stream should not be created successfully"));
        }, function(){
            done();
        });
    });
});