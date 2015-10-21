/**
 * Created by elad.benedict on 8/12/2015.
 */

var proxyquire = require('proxyquire');
var fs = require('fs');
var sinon = require('sinon');
var Q = require('Q');
var path = require('path');
PlaylistItem = require('m3u8/m3u/PlaylistItem');
var m3u8Parser = require('../../lib/promise-m3u8');
var chai = require('chai');
var expect = chai.expect;

describe('M3U8 Generator tests', function() {

    function createManifestGenerator(customizeMocks, dvrWindowSize) {
        var expectedManifest = fs.readFileSync(__dirname + '/../resources/simpleManifest.m3u8', 'utf8');

        var qioMock = {
            exists: sinon.stub().returns(Q(true)),
            write: sinon.stub().returns(Q())
        };

        var m3u8Mock = {
            'parseM3U8': sinon.stub().returns(m3u8Parser.parseM3U8(expectedManifest, {'verbatim': true}))
        };

        var loggerMock = {
            info: sinon.stub(),
            error: sinon.stub(),
            debug: sinon.stub()
        };

        var mocks = {
            'q-io/fs': qioMock,
            './promise-m3u8': m3u8Mock
        };

        if (customizeMocks) {
            customizeMocks(mocks);
        }

        var windowSize = dvrWindowSize ? dvrWindowSize : 60 * 60 * 2; // 2 Hours
        var m3u8Generator = proxyquire('../../lib/ChunklistManifestGenerator', mocks)("c:\\somePath\\", "manifest.m3u8", windowSize, loggerMock);
        return m3u8Generator;
    }


    it('Should read the existing manifest upon initialization (if there is one)', function (done) {

        var expectedManifest = fs.readFileSync(__dirname + '/../resources/simpleManifest.m3u8', 'utf8');

        var m3u8Generator = createManifestGenerator();
        var promise = m3u8Generator.init();
        promise.done(function (currentManifest) {
            expect(currentManifest.toString()).to.eql(expectedManifest.replace(/[\r]/g, ''));
            done();
        });
    });

    it('Should get the current manifest', function (done) {

        var expectedManifest = fs.readFileSync(__dirname + '/../resources/simpleManifest.m3u8', 'utf8');

        var m3u8Generator = createManifestGenerator();
        var promise = m3u8Generator.init();
        promise.then(function () {
            var currentManifest = m3u8Generator.getCurrentManifest();
            expect(currentManifest.toString()).to.eql(expectedManifest.replace(/[\r]/g, ''));
            done();
        });
    });


    it('Should create a new manifest upon initialization (if one does not already exist)', function (done) {

        var updateMocks = function (mocks) {
            mocks['q-io/fs'].exists = sinon.stub().returns(Q(false));
        };
        var m3u8Generator = createManifestGenerator(updateMocks);

        var promise = m3u8Generator.init();
        promise.done(function (currentManifest) {
            expect(currentManifest.items.PlaylistItem.length).to.eql(0);
            expect(currentManifest.properties.mediaSequence).to.eql(0);
            done();
        });
    });

    it('Should advance DVR window when total content duration exceeds DVR window size', function (done) {

        var mocks;
        var updateMocks = function (m) {
            mocks = m;
        };

        var m3u8Generator = createManifestGenerator(updateMocks, 30);

        var promise = m3u8Generator.init();
        promise.then(function () {
            var item1 = new PlaylistItem();
            item1.set('duration', 13.3);
            item1.set('uri', "uriName1");

            var item2 = new PlaylistItem();
            item2.set('duration', 12.3);
            item2.set('uri', "uriName2");

            var item3 = new PlaylistItem();
            item3.set('duration', 4);
            item3.set('uri', "uriName3");

            return m3u8Generator.update([item1, item2, item3]);

        }).done(function () {
            var expectedManifest = fs.readFileSync(__dirname + '/../resources/updatedManifest1.m3u8', 'utf8');
            var lastWriteArgs = mocks['q-io/fs'].write.lastCall.args;
            expect(lastWriteArgs[1]).to.eql(expectedManifest.replace(/[\r]/g, ''));
            done();
        });
    });

    it('should update chunk list correctly with new chunks', function (done) {
        var mocks;
        var updateMocks = function (m) {
            mocks = m;
        };
        var m3u8Generator = createManifestGenerator(updateMocks);

        var promise = m3u8Generator.init();
        var manifestBeforeUpdate;
        promise.then(function (currentManifest) {
            manifestBeforeUpdate = currentManifest.toString();
            var item1 = new PlaylistItem();
            item1.set('duration', 12.3);
            item1.set('uri', "uriName1");
            var item2 = new PlaylistItem();
            item2.set('duration', 23.4);
            item2.set('uri', "uriName2");
            return m3u8Generator.update([item1, item2]);
        }).done(function () {
            var lastWriteArgs = mocks['q-io/fs'].write.lastCall.args;
            expect(lastWriteArgs[0]).to.eql(path.join("c:\\somePath\\", "manifest.m3u8"));

            var expectedManifest = manifestBeforeUpdate +
                '#EXT-X-DISCONTINUITY' + '\n' +
                '#EXTINF:12.3000,' + '\n' +
                'uriName1' + '\n' +
                '#EXTINF:23.4000,' + '\n' +
                'uriName2' + '\n';

            expectedManifest = expectedManifest.replace('EXT-X-TARGETDURATION:13', 'EXT-X-TARGETDURATION:24');

            expect(lastWriteArgs[1]).to.eql(expectedManifest);
            done();
        });
    });

    it('should update chunk list correctly with new chunks for manifest with previous discontinuity', function (done) {
        var expectedManifest = fs.readFileSync(__dirname + '/../resources/manifestWithDiscontinuity.m3u8', 'utf8');
        var mocks;
        var updateMocks = function (m) {
            m['./promise-m3u8']['parseM3U8'] = sinon.stub().returns(m3u8Parser.parseM3U8(expectedManifest, {'verbatim': true}));
            mocks = m;
        };

        var m3u8Generator = createManifestGenerator(updateMocks);

        var promise = m3u8Generator.init();
        var manifestBeforeUpdate;
        promise.then(function (currentManifest) {
            manifestBeforeUpdate = currentManifest.toString();
            var item1 = new PlaylistItem();
            item1.set('duration', 12.3);
            item1.set('uri', "uriName1.ts");
            return m3u8Generator.update([item1]);
        }).done(function () {
            var lastWriteArgs = mocks['q-io/fs'].write.lastCall.args;
            var expectedManifest = manifestBeforeUpdate +
                '#EXT-X-DISCONTINUITY' + '\n' +
                '#EXTINF:12.3000,' + '\n' +
                'uriName1.ts' + '\n';
            expect(lastWriteArgs[1]).to.eql(expectedManifest);
            done();
        });
    });
});
