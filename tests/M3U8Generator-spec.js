/**
 * Created by elad.benedict on 8/12/2015.
 */

var proxyquire = require('proxyquire');
var m3u8 = require('m3u8');
var fs = require('fs');
var sinon = require('sinon');
var Q = require('Q');
var chai = require('chai');
var expect = chai.expect;
var path = require('path');
PlaylistItem = require('m3u8/m3u/PlaylistItem');

describe('M3U8 Generator tests', function() {

    function createManifestGenerator(customizeMocks)
    {
        var qioMock = {
            exists : sinon.stub().returns(Q(true)),
            write : sinon.stub().returns(Q())
        };

        var fsMock = {

            fileToRead : __dirname + '/resources/simpleManifest.m3u8',

            createReadStream : function() {
                var Stream = require('stream');
                var stream = new Stream();

                var content = fs.readFileSync(this.fileToRead);

                stream.pipe = function(dest) {
                    dest.write(content);
                    dest.end();
                    return dest;
                };

                return stream;
            }
        };

        var mocks = {
            'fs' : fsMock,
            'q-io/fs' : qioMock
        };

        if (customizeMocks) {
            customizeMocks(mocks);
        }

        var m3u8Generator = proxyquire('../lib/M3U8Generator',mocks)("c:\\somePath\\", "manifest.m3u8");
        return m3u8Generator;
    }

    it('Should read the existing manifest upon initialization (if there is one)', function (done) {

        var expectedManifest = fs.readFileSync(__dirname + '/resources/simpleManifest.m3u8', 'utf8');

        var m3u8Generator = createManifestGenerator();
        var promise = m3u8Generator.init();
        promise.done(function(currentManifest)
        {
            expect(currentManifest.toString()).to.eql(expectedManifest.replace(/[\r]/g, ''));
            done();
        });
    });

    /*it('Should reject reading an invalid M3U8', function (done) {

        var updateMocks = function(mocks) {
            mocks['fs'].fileToRead =  __dirname + '/resources/erronousManifest.m3u8';
        };

        var m3u8Generator = createManifestGenerator(updateMocks);
        var promise = m3u8Generator.init();
        promise.done(function(currentManifest)
        {
            done();
        });
    }); */

    it('Should create a new manifest upon initialization (if one does not already exist)', function (done) {

        var expectedManifest = fs.readFileSync(__dirname + '/resources/simpleManifest.m3u8', 'utf8');

        var updateMocks = function(mocks) {
            mocks['q-io/fs'].exists = sinon.stub().returns(Q(false));
        };
        var m3u8Generator = createManifestGenerator(updateMocks);

        var promise = m3u8Generator.init();
        promise.done(function(currentManifest)
        {
            expect(currentManifest.items.PlaylistItem.length).to.eql(0);
            expect(currentManifest.properties.mediaSequence).to.eql(0);
            done();
        });
    });

     it('should update chunk list correctly with new chunks', function (done) {
         var mocks;
         var updateMocks = function(m)
         {
            mocks = m;
         };
         var m3u8Generator = createManifestGenerator(updateMocks);

         var promise = m3u8Generator.init();
         var manifestBeforeUpdate;
         promise.then(function(currentManifest)
         {
             manifestBeforeUpdate = currentManifest.toString();
             var item1 = new PlaylistItem();
             item1.set('duration', 12.3);
             item1.set('uri', "uriName1");
             var item2 = new PlaylistItem();
             item2.set('duration', 23.4);
             item2.set('uri', "uriName2");
             return m3u8Generator.update([item1, item2]);
         }).done(function(){
             var lastWriteArgs = mocks['q-io/fs'].write.lastCall.args;
             expect(lastWriteArgs[0]).to.eql(path.join("c:\\somePath\\", "manifest.m3u8"));

             var expectedManifest = manifestBeforeUpdate +
                 '#EXTINF:12.3000,' + '\n' +
                 'uriName1'+ '\n' +
                 '#EXTINF:23.4000,' + '\n' +
                 'uriName2'+ '\n';

             expectedManifest = expectedManifest.replace('EXT-X-TARGETDURATION:13', 'EXT-X-TARGETDURATION:24');

             expect(lastWriteArgs[1]).to.eql(expectedManifest);
             done();
         });
     });
});
