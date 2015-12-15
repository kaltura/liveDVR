/**
 * Created by elad.benedict on 12/15/2015.
 */

var tmp = require('tmp');
var proxyquire = require('proxyquire');
var config = require('../../common/Configuration')
var chai = require('chai');
var expect = chai.expect;
var _ = require('underscore');

describe.only('DB component tests', function(){

    var storageClient;
    var cleanupCallbackFunc;

    beforeEach(function(done){
        tmp.dir(function tempFileCreated(err, path, cleanupCallback) {
            if (err) {
                done(err);
            }
            config.set('nedbFilesFolderPath', path);
            cleanupCallbackFunc = cleanupCallback

            delete require.cache[require.resolve('../../lib/StorageClientFactory.js')]
            delete require.cache[require.resolve('../../lib/persistence/nedbStorageClient')]
            var dbStorageClientFactory = require('../../lib/StorageClientFactory.js');
            storageClient = dbStorageClientFactory.getStorageClient();
            done();
        },{
            unsafeCleanup: true
        });
    })

    afterEach(function(){
        cleanupCallbackFunc();
    })

    it('should add an entry correctly', function(done){
        storageClient.addEntry('1', []).then(function(){
            done()
        }).done(null, done);
    });

    it('should fail when fetching a missing entry', function(done){
        storageClient.getEntry('1').then(function(){
            done('Should fail on missing entry')
        }).done(null, function(){
            done();
        });
    });

    it("should successfully update an entry's session", function(done){
        storageClient.addEntry('1', []).then(function(){
            return storageClient.getEntry('1', []).then(function(e) {
                var sessionUpdatedAt = e.lastUpdatedAt;
                return storageClient.refreshEntrySession('1').then(function () {
                    return storageClient.getEntry('1', []).then(function(updatedEntry) {
                        expect(updatedEntry.lastUpdatedAt).to.be.at.least(sessionUpdatedAt);
                        done();
                    });
                });
            });
        }).done(null, done);
    });

    it("should successfully add chunks to the list of chunks to download", function(done){
        storageClient.addEntry('1', []).then(function(){
            return storageClient.addToListOfChunksToDownload('1', ['chunk1', 'chunk2']).then(function() {
                return storageClient.addToListOfChunksToDownload('1', ['chunk3', 'chunk4']).then(function() {
                    return storageClient.getEntry('1').then(function (entry) {
                        expect(entry.chunksToDownload).to.eql(['chunk1', 'chunk2', 'chunk3', 'chunk4']);
                        done();
                    })
                });
            });
        }).done(null, done);
    });

    it("should successfully mark chunks as downloaded", function(done){
        storageClient.addEntry('1', []).then(function(){
            return storageClient.addToListOfChunksToDownload('1', ['chunk1', 'chunk2']).then(function() {
                return storageClient.markChunksAsDownloaded('1', ['chunk1']).then(function() {
                    return storageClient.getEntry('1').then(function (entry) {
                        expect(entry.chunksToDownload).to.eql(['chunk2']);
                        expect(entry.downloadedChunks).to.eql(['chunk1']);
                        done();
                    })
                });
            });
        }).done(null, done);
    });

    it('should fail when deleting a missing entry', function(done){
        storageClient.removeEntry('1').then(function(){
            done('Should fail on missing entry')
        }).done(null, function(){
            done();
        });
    });

    it('should successfully delete an existing entry', function(done){
        storageClient.addEntry('1', []).then(function(){
            return storageClient.removeEntry('1').then(function() {
                return storageClient.getEntry('1').then(function () {
                    done('Entry should not exist');
                });
            });
        }).done(null,function(){
            done();
        });
    });

    it('should fail when adding an existing entry', function(done){
        storageClient.addEntry('1', []).then(function(){
            return storageClient.addEntry('1', []).then(function() {
                done('Should fail on adding existing entry')
            });
        }).done(null, function(){
            done();
        });
    });

    it('should fetch an added entry correctly', function(done) {
        storageClient.addEntry('1', ['2', '3']).then(function () {
            storageClient.getEntry('1').then(function (doc) {
                expect(_.omit(doc, 'lastUpdatedAt')).to.eql({
                    _id : '1',
                    id : '1',
                    flavors: ['2', '3']
                });
                done();
            }).done(null, done);
        });
    });
})
