/**
 * Created by elad.benedict on 10/25/2015.
 */

var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var Q = require('Q');
var _ = require('underscore');
var M3U = require('m3u8').M3U;

describe('Two phased chunklist manifest generator spec', function() {

    var intermediateChunklistManifestGenerator;
    var externallyVisibleManifestGenerator;
    var externalManifest;
    var intermediateManifest;

    var createTwoPhasedChunklistManifestGenerator = function (customizeMocks, customizeDownloadedFilesGetter) {

        var logger = {
            debug : sinon.stub(),
            info : sinon.stub(),
            error : sinon.stub()
        };

        intermediateManifest = new M3U();
        intermediateChunklistManifestGenerator = {
            init : sinon.stub().returns(Q()),
            update : function(items) {
                intermediateManifest.items.PlaylistItem = intermediateManifest.items.PlaylistItem.concat(items);
                return Q({removedChunks : []});
            },
            getCurrentManifest : sinon.stub().returns(intermediateManifest)
        };
        sinon.spy(intermediateChunklistManifestGenerator, 'update');

        externalManifest = new M3U();
        externallyVisibleManifestGenerator = {
            init : sinon.stub().returns(Q()),
            update : function(items) {
                externalManifest.items.PlaylistItem = externalManifest.items.PlaylistItem.concat(items);
                return Q({removedChunks : []});
            },
            getCurrentManifest : sinon.stub().returns(externalManifest)
        };
        sinon.spy(externallyVisibleManifestGenerator, 'update');

        var chunklistManifestGeneratorStub = sinon.stub();
        chunklistManifestGeneratorStub.onCall(0).returns(intermediateChunklistManifestGenerator);
        chunklistManifestGeneratorStub.onCall(1).returns(externallyVisibleManifestGenerator);

        var mocks = {
            './ChunklistManifestGenerator' : chunklistManifestGeneratorStub,
            './utils/log-decorator' : function(logger) {
                return logger;
            },
            './PtsAlligner' : sinon.stub().returns({
                process : sinon.stub().returns(Q()),
                initialize : sinon.stub().returns(Q())
            })
        };

        if (customizeMocks) {
            customizeMocks(mocks);
        }

        var manifestGeneratorCreator = proxyquire('../../lib/TwoPhasedChunklistManifestGenerator.js', mocks);
        var getter = customizeDownloadedFilesGetter ? customizeDownloadedFilesGetter : sinon.stub().returns([]);
        return manifestGeneratorCreator(getter, 'outputFolderPath', 'filename', 7200, 1000, logger);
    };

    var createArrayOfPlaylistItems = function(name) {
        var item1 = new PlaylistItem();
        item1.set('duration', 13.3);
        item1.set('uri', name + "1");

        var item2 = new PlaylistItem();
        item2.set('duration', 12.3);
        item2.set('uri', name + "2");

        var item3 = new PlaylistItem();
        item3.set('duration', 4);
        item3.set('uri', name + "3");

        return [item1, item2, item3];
    };

    it('should successfully init when underlying manifest generators init correctly', function (done) {
        var manifestGenerator = createTwoPhasedChunklistManifestGenerator();
        manifestGenerator.init().then(function(){
            done();
        }, function(err){
            done(err);
        });
    });

    it('should not init successfully when one of the underlying manifest generators does not init correctly', function (done) {
        var updateMocks = function(mocks) {
            mocks['./ChunklistManifestGenerator'] = sinon.stub().returns({
                init : sinon.stub().returns(Q.reject(new Error())),
            });
        };
        var manifestGenerator = createTwoPhasedChunklistManifestGenerator(updateMocks);
        manifestGenerator.init().then(function(){
            done(new Error("should have failed"));
        }, function(){
            done();
        });
    });

    it('should update correctly', function (done) {

        var newItems = createArrayOfPlaylistItems("new");
        var previousItems = createArrayOfPlaylistItems("previous");
        var downloadedItemsList = _.first(previousItems, previousItems.length-1);

        //var downloadedFilesGetterStub = sinon.stub().returns(['unrelatedFile1', 'unrelatedFile2'].concat(downloadedItemsNames));
        var downloadedFilesResult = {'unrelatedFile1' : true, 'unrelatedFile2' : true};
        _.each(downloadedItemsList, function(i){
            downloadedFilesResult[i.get('uri')] = true;
        });
        var downloadedFilesGetterStub = sinon.stub().returns(downloadedFilesResult);

        var manifestGenerator = createTwoPhasedChunklistManifestGenerator(null, downloadedFilesGetterStub);

        intermediateManifest.items.PlaylistItem = previousItems;

        //var externalManifestLengthBeforeUpdate = externallyVisibleManifestGenerator.getCurrentManifest().PlaylistItem.length;
        manifestGenerator.init().then(function(){
            return manifestGenerator.update(newItems);
        }).then(function(){
            expect(intermediateChunklistManifestGenerator.update.getCall(0).args[0]).to.eql(newItems);
            expect(externallyVisibleManifestGenerator.update.getCall(0).args[0]).to.eql(downloadedItemsList);
            done();
        }).catch(function(err){
            done(err);
        });
    });
});

