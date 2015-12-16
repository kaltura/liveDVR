/**
 * Created by AsherS on 8/20/15.
 */

var Q = require('q');
var _ = require('underscore');
var path = require('path');
var url = require('url');
var qfs = require("q-io/fs");
var logger = require('./logger/logger')(module);
var loggerDecorator = require('./utils/log-decorator');
var m3u8Handler = require('./promise-m3u8');
var twoPhasedChunklistManifestGenerator = require('./TwoPhasedChunklistManifestGenerator');
var util = require("util");
var events = require("events");
var config = require('./../common/Configuration');
var storageClient = require('./StorageClientFactory').getStorageClient();

var FlavorDownloader = (function () {

    function FlavorDownloader(m3u8Url, destPath, entryId, flavor, newPlaylistName, dvrWindow) {
        var that = this;
        events.EventEmitter.call(this);
        this.entryId = entryId;
        this.flavor = flavor;
        this.streamUrl = m3u8Url;
        this.destFolderPath = destPath;
        this.shouldRun = true;
        this.pollingInterval = config.get("pollingInterval");
        this.tmpM3u8Folder = path.join(destPath, 'tmpM3u8');

        var messageDecoration = function(msg) {
            return "entryId: " + that.entryId + " , flavor: " + that.flavor + " - " + msg;
        };
        this.logger = loggerDecorator(logger, messageDecoration);

        this.httpUtils = require('./utils/http-utils')(this.logger);
        this.m3u8generator = twoPhasedChunklistManifestGenerator(this.entryId, this.flavor, this.destFolderPath, newPlaylistName, dvrWindow, this.logger);
    }
    util.inherits(FlavorDownloader, events.EventEmitter);

    var formatLogMsg = function (that, msg) {
        return "entryId: " + that.entryId + " , flavor: " + that.flavor + " - " + msg;
    };

    var downloadIndefinitely = function (onIterationEndCallback) {
        var that = this;
        if (!that.shouldRun) {
            that.emit("downloader-end");
            return Q();
        }

        that.emit("iteration-start");
        return downloadPlaylist(that)
            .catch(function failure(err) {
                that.emit("iteration-error", err);
                that.logger.error(formatLogMsg(that, "Failed to download all chunks:\n" + err + "\n" + err.message + "\n" + err.stack));

                var errList = err;
                if (_.isArray(err)) {
                    errList = _.map(err, function (i) {
                        return i.reason + "\n" + i.stack + "\n";
                    });
                }
                that.logger.error(formatLogMsg(that, errList));
            })
            .finally(function () {
                if (that.shouldRun) {
                    setTimeout(function () {
                        that.logger.debug('scheduling downloadIndefinitely to be run in ' + that.pollingInterval);
                        downloadIndefinitely.call(that, onIterationEndCallback);
                    }, that.pollingInterval);
                }

                that.emit("iteration-end");

                if (!that.shouldRun) {
                    that.emit("downloader-end");
                }
            });
    };

    var downloadChunks = function (that, baseUrl, chunksToDownload) {
        return Q.allSettled(_.map(chunksToDownload, function (chunkName) {
            var chunkUrl = url.resolve(baseUrl + '/', chunkName);

            //return the promise of the downloaded chunk
            return that.httpUtils.downloadFile(chunkUrl, path.join(that.destFolderPath, chunkName))
                .then(function(){
                    return storageClient.markChunksAsDownloaded(that.entryId, that.flavor, [chunkName]);
                });
        })).then(function filterResolvedPromises(results) {
            return _.filter(results, function (p) {
                return (p.state !== 'fulfilled');
            });
        }).then(function checkRejectedPromises(filteredResults) {
            if (filteredResults.length > 0) {

                //group list of errors:
                var errorsList =  _.map(filteredResults, function (i) {
                    return i.reason + "\n";
                });

                return Q.reject(new Error(errorsList));
            }
            return Q.resolve();
        });
    };

    var downloadPlaylist = function (that) {

        var parsedUrl, baseUrl, playlistName, playlistDestPath, downloadedM3u8, chunksToDownload;

        var downloadFlavorManifest = function() {
            that.logger.debug(formatLogMsg(that, "Downloading from : " + that.streamUrl));
            parsedUrl = url.parse(that.streamUrl);
            baseUrl = parsedUrl.href.substring(0, parsedUrl.href.lastIndexOf('/'));
            playlistName = path.basename(parsedUrl.pathname);
            playlistDestPath = path.join(that.tmpM3u8Folder, playlistName);
            that.logger.debug(formatLogMsg(that, "Temp playlist folder located at: " + playlistDestPath));
            that.logger.debug(formatLogMsg(that, "Reading current M3U8 from " + playlistDestPath));
            return that.httpUtils.downloadFile(that.streamUrl, playlistDestPath)
        }

        var updateListOfNewChunksToProcess = function() {
            return storageClient.getEntry(that.entryId)
                .then(function (entryData) {
                    var downloadedChunks = entryData.downloadedChunks[that.flavor];
                    chunksToDownload = entryData.chunksToDownload[that.flavor];

                    var newChunks = _.chain(downloadedM3u8.items.PlaylistItem)
                        .filter(function (item) {
                            return !_.contains(downloadedChunks, item.get('uri')) && !_.contains(chunksToDownload, item.get('uri'));
                        }).value();

                    // update that these new chunks need to be downloaded
                    var newChunkNames = _.map(newChunks, function (c) {
                        return c.get('uri')
                    });
                    return storageClient.addToListOfChunksToDownload(that.entryId, that.flavor, newChunkNames).then(function(){
                        return newChunks;
                    });
                });
        }

        var processObsoleteChunks = function(results) {
            // Try to delete files that were removed from the manifest
            // The last promise is the one for the update manifest request
            var manifestUpdatePromiseResult = _.last(results);
            if (manifestUpdatePromiseResult.state === 'fulfilled')
            {
                // Delete the obsolete chunks from disk
                _.each(manifestUpdatePromiseResult.value.removedChunks, function(itemToDelete){
                    // Delete on a best effort basis
                    var pathToDelete = path.join(that.destFolderPath, itemToDelete.get('uri'));
                    qfs.remove(pathToDelete)
                        .then(function() {
                            that.logger.info('Successfully deleted chunk ' + itemToDelete.get('uri'));
                        })
                        .catch(function() {
                            that.logger.info('Error deleting a chunk which was removed from a manifest - ' + itemToDelete.get('uri'));
                        });
                });

                // Remove the obsolete chunks' reference from persistence
                var chunkNames = _.map(manifestUpdatePromiseResult.value.removedChunks, function(chunk){
                    return chunk.get('uri');
                })

                storageClient.markChunksAsObsolete(that.entryId, that.flavor, chunkNames)
                    .catch(function(err){
                        that.logger.info('Error marking chunks as obsolete : ' + err.message + ' ' + err.stack);
                    })
            }
        }

        var concludeOperation = function(results){
            var rejected = _.filter(results, function (p) {
                return (p.state !== 'fulfilled');
            });
            if (rejected.length > 0) {
                var errorsString = "";
                _.forEach(rejected, function(r){
                    errorsString += r.reason + "\n" + r.reason.stack + "\n";
                });
                throw new Error(errorsString);
            }
            return Q.resolve();
        }

        return Q.fcall(function(){
            return downloadFlavorManifest();
        }).then(function finishedDownload() {
            return m3u8Handler.parseM3U8(playlistDestPath).then(function(m3u) {
                that.logger.debug(formatLogMsg(that,"Received M3U8: \n" + m3u.toString()));
                downloadedM3u8 = m3u;
            });
        }).then(function() {
            return updateListOfNewChunksToProcess();
        }).then(function(newChunks){
            //generate updated m3u8
            var m3u8generatorPromise = that.m3u8generator.update(newChunks);

            // Download chunks - all the chunks that were pending download beforehand along with the new chunks
            var newChunkNames = _.map(newChunks, function(c) { return c.get('uri'); });
            var allDownloadPendingChunks = chunksToDownload.concat(newChunkNames);
            var downloadChunksPromise = downloadChunks(that, baseUrl, allDownloadPendingChunks);
            return Q.allSettled([downloadChunksPromise, m3u8generatorPromise]);
        }).then(function(results){
            processObsoleteChunks(results); // Trigger deletion on a best-effort basis
            return results;
        }).then(function(results) {
            return concludeOperation(results);
        });
    }

    FlavorDownloader.prototype.start = function (onIterationEndCallback) {
        var that = this;
        that.logger.info(formatLogMsg(that,"Starting flavor downloader - url: " + this.streamUrl + " destination folder: "+ this.destFolderPath));
        that.logger.debug(formatLogMsg(that,"Polling interval: " + this.pollingInterval));

        //create tmp destination folder for media-server m3u8 files
        return qfs.makeTree(this.tmpM3u8Folder)
            .then(function() {
                return that.m3u8generator.init();
            })
            .then(function(){
                return storageClient.addFlavorToEntry(that.entryId, that.flavor);
            })
            .then(function(){
                return downloadIndefinitely.call(that, onIterationEndCallback);
            })
            .catch(function(err){
                that.logger.error("Error occurred while starting flavor downloader for entry id: " + that.entryId + " flavor: " + that.flavor + "\n" + err + " stack: " + err.stack);
                err.flavor = that.flavor;
                throw err;
            });
    };

    FlavorDownloader.prototype.stop = function () {
        var that = this;
        var teardownInterval = config.get("flavorDownloaderTeardownInterval");
        that.logger.info('stop requested - allowing ' + teardownInterval + 'ms for orderly tear-down');
        return Q.delay(teardownInterval).then(function(){
            that.logger.info('stopping flavor downloader');
            var d = Q.defer();
            that.shouldRun = false;
            that.on('downloader-end', function(){
                that.logger.info(formatLogMsg(that,"Stopped"));
                d.resolve();
            });
            return d.promise;
        });
    };

    return FlavorDownloader;
})();

module.exports = FlavorDownloader;