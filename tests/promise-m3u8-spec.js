/**
 * Created by elad.benedict on 8/23/2015.
 */


var proxyquire = require('proxyquire');
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;
var path = require('path');

describe('Promise m3u8 spec', function() {
    it('should correctly read an M3U8', function(done)
    {
        var m3u8Parser = require('../lib/promise-m3u8');
        var expectedManifest = fs.readFileSync(path.join(__dirname, '/resources/simpleManifest.m3u8'), 'utf8');

        m3u8Parser.parseM3U8(path.join(__dirname, '/resources/simpleManifest.m3u8')).then(function(manifest){
            expect(manifest.toString()).to.eql(expectedManifest);
        }).done(function(){
            done();
        });
    });

    it('should correctly read from a stream', function(done)
    {
        var m3u8Parser = require('../lib/promise-m3u8');
        var expectedManifest = fs.readFileSync(path.join(__dirname, '/resources/simpleManifest.m3u8'), 'utf8');

        var Readable = require('stream').Readable;
        var s = new Readable();
        s.push(expectedManifest);
        s.push(null); // Stream end

        m3u8Parser.parseM3U8(s).then(function(manifest){
            expect(manifest.toString()).to.eql(expectedManifest);
        }).done(function(){
            done();
        });
    });
});