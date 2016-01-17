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
var glob = require('glob');

var FlavorDownloader = (function () {

    var maxAllowedConsecutiveFailures = 2;
    var maxAmountOfDownloadPendingChunks = 20;
    var downloaderEnd = Q.defer();

    function FlavorDownloader(m3u8Url, destPath, entryId, flavor, newPlaylistName, manifestTimeWindow, manifestMaxChunkCount) {
        var that = this;
        events.EventEmitter.call(this);
        this.id = this.constructor.uniqueId;
        this.constructor.uniqueId = this.constructor.uniqueId + 1;
        this.entryId = entryId;
        this.flavor = flavor;
        this.streamUrl = m3u8Url;
        this.destFolderPath = destPath;
        this.shouldRun = true;
        this.runStatus = 'uninitialized';
        this.pollingInterval = config.get("pollingInterval");
        this.tmpM3u8Folder = path.join(destPath, 'tmpM3u8');
        this.downloadedChunks = {};
        this.chunksToDownload = {};
        this.failedAttempts = 0;

        var messageDecoration = function(msg) {
            return "[" + that.entryId + "][" + that.flavor + "][id:" + that.id + "] " + msg;
        };
        this.logger = loggerDecorator(logger, messageDecoration);

        this.httpUtils = require('./utils/http-utils')(this.logger);

        var downloadedChunksGetter = function getDownloadedChunks(){
            return that.downloadedChunks;
        };

        this.m3u8generator = twoPhasedChunklistManifestGenerator(downloadedChunksGetter, this.destFolderPath, newPlaylistName, manifestTimeWindow, manifestMaxChunkCount, this.logger);

        downloaderEnd.promise.then(function(){
            that.emit("downloader-end");
        })
    }
    util.inherits(FlavorDownloader, events.EventEmitter);

    var formatLogMsg = function (that, msg) {
        return "entryId: " + that.entryId + " , flavor: " + that.flavor + " - " + msg;
    };

    var downloadIndefinitely = function (onIterationEndCallback) {
        var that = this;
        that.logger.info("starting iteration");
        if (!that.shouldRun) {
            downloaderEnd.resolve();
            return Q();
        }

        that.emit("iteration-start");
        return downloadPlaylist(that)
            .then(function(){
                // Reset failed attempts count
                that.failedAttempts = 0;
            })
            .catch(function failure(err) {
                that.emit("iteration-error", err);
                that.logger.error("iteration error: " + err);

                that.failedAttempts = that.failedAttempts + 1;
                var shouldAbort = false;

                if (that.runStatus === 'uninitialized')
                {
                    that.logger.error("Flavor downloader failed to initialize");
                    shouldAbort = true;
                }

                if (that.failedAttempts === maxAllowedConsecutiveFailures) {
                    // Do not try to handle this flavor if maxAllowedConsecutiveFailures attempts were reached
                    that.logger.error("Flavor downloader failed " + maxAllowedConsecutiveFailures + " consecutive times - stopping it");
                    shouldAbort = true;
                }

                if (shouldAbort) {
                    that.stop().catch(function (err) {
                        that.logger.error("Failed to stop: " + err);
                    });

                    throw err;
                }
            })
            .then(function () {
                if (that.shouldRun) {
                    setTimeout(function () {
                        that.logger.debug('scheduling downloadIndefinitely to be run in ' + that.pollingInterval);
                        downloadIndefinitely.call(that, onIterationEndCallback);
                    }, that.pollingInterval);
                }
            }).finally(function(){
                that.emit("iteration-end");

                if (!that.shouldRun) {
                    downloaderEnd.resolve();
                }
            });
    };

    var downloadChunks = function (that, baseUrl, chunksToDownload) {
        return Q.allSettled(_.map(chunksToDownload, function (chunkName) {
            var chunkUrl = url.resolve(baseUrl + '/', chunkName);

            //return the promise of the downloaded chunk
            return that.httpUtils.downloadFile(chunkUrl, path.join(that.destFolderPath, chunkName))
                .then(function(){
                    delete that.chunksToDownload[chunkName];
                    that.downloadedChunks[chunkName] = true;
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

        var parsedUrl, baseUrl, playlistName;

        var downloadFlavorManifest = function () {
            that.logger.debug(formatLogMsg(that, "Downloading from : " + that.streamUrl));
            parsedUrl = url.parse(that.streamUrl);
            baseUrl = parsedUrl.href.substring(0, parsedUrl.href.lastIndexOf('/'));
            playlistName = path.basename(parsedUrl.pathname);
            var playlistDestPath = path.join(that.tmpM3u8Folder, playlistName);
            that.logger.debug(formatLogMsg(that, "Temp playlist folder located at: " + playlistDestPath));
            that.logger.debug(formatLogMsg(that, "Reading current M3U8 from " + playlistDestPath));
            return that.httpUtils.downloadFile(that.streamUrl, playlistDestPath).then(function () {
                return playlistDestPath;
            });
        };

        var updateListOfNewChunksToProcess = function (downloadedM3u8) {
            var newChunks = _.chain(downloadedM3u8.items.PlaylistItem)
                .filter(function (item) {
                    return !that.downloadedChunks[item.get('uri')] && !that.chunksToDownload[item.get('uri')];
                }).value();

            // update that these new chunks need to be downloaded
            _.each(newChunks, function (c) {
                that.logger.debug('Adding ' + c.get('uri') + ' to the list of chunks to download');
                that.chunksToDownload[c.get('uri')] = true;
            });

            if (Object.keys(that.chunksToDownload).length >= maxAmountOfDownloadPendingChunks)
            {
                // This shouldn't happen - stop this downloader
                that.logger.error("Chunk download list size is " + maxAmountOfDownloadPendingChunks + " - this shouldn't happen. Stopping the downloader for this flavor");
                that.stop().catch(function(err){
                    that.logger.error("Failed to stop: " + err);
                });
            }

            return newChunks;
        };

        var processObsoleteChunks = function (results) {
            // Try to delete files that were removed from the manifest
            // The last promise is the one for the update manifest request
            var manifestUpdatePromiseResult = _.last(results);
            if (manifestUpdatePromiseResult.state === 'fulfilled') {
                // Delete the obsolete chunks from disk
                _.each(manifestUpdatePromiseResult.value.removedChunks, function (itemToDelete) {
                    // Delete on a best effort basis
                    var pathToDelete = path.join(that.destFolderPath, itemToDelete.get('uri'));
                    qfs.remove(pathToDelete)
                        .then(function () {
                            that.logger.info('Successfully deleted chunk ' + itemToDelete.get('uri'));
                        })
                        .catch(function () {
                            that.logger.info('Error deleting a chunk which was removed from a manifest - ' + itemToDelete.get('uri'));
                        });
                });

                // Ensure that chunks removed from the intermediate manifest are not in the chunksToDownload list
                // (as they will never be processed)
                _.each(manifestUpdatePromiseResult.value.bumpedChunks, function (chunk) {
                    var chunkName = chunk.get('uri');
                    if (that.chunksToDownload[chunkName]) {
                        that.logger.error("Removing chunk " + chunkName + " from chunksToDownload - this shouldn't happen");
                        delete that.chunksToDownload[chunkName];
                    }
                });

                // Remove the obsolete chunks' reference from persistence
                _.each(manifestUpdatePromiseResult.value.removedChunks, function (chunk) {
                    that.logger.debug('Delete ' + chunk.get('uri') + ' from the list of chunks to download');
                    delete that.downloadedChunks[chunk.get('uri')];
                });
            }
        };

        var concludeOperation = function (results) {
            var rejected = _.filter(results, function (p) {
                return (p.state !== 'fulfilled');
            });
            if (rejected.length > 0) {
                var errorsString = "";
                _.forEach(rejected, function (r) {
                    errorsString += r.reason + "\n" + r.reason.stack + "\n";
                });
                throw new Error(errorsString);
            }
            return Q.resolve();
        };

        return Q.fcall(function () {
            return downloadFlavorManifest()
             .then(function finishedDownload(playlistDestPath) {
                return m3u8Handler.parseM3U8(playlistDestPath)
                    .then(function (m3u) {
                        that.logger.debug(formatLogMsg(that, "Received M3U8: \n" + m3u.toString()));
                        return m3u;
                    });
            }).then(function (m3u) {
                return updateListOfNewChunksToProcess(m3u);
            }).then(function (newChunks) {
                //generate updated m3u8
                var m3u8generatorPromise = that.m3u8generator.update(newChunks);

                // Download chunks - all the chunks that were pending download beforehand along with the new chunks
                var downloadChunksPromise = downloadChunks(that, baseUrl, Object.keys(that.chunksToDownload));
                return Q.allSettled([downloadChunksPromise, m3u8generatorPromise]);
            }).then(function (results) {
                processObsoleteChunks(results); // Trigger deletion on a best-effort basis
                return results;
            }).then(function (results) {
                return concludeOperation(results);
            });
        });
    };

    FlavorDownloader.prototype.start = function (onIterationEndCallback) {
        var that = this;
        that.logger.info("Flavor start requested");
        that.logger.info(formatLogMsg(that,"Starting flavor downloader - url: " + this.streamUrl + " destination folder: "+ this.destFolderPath));
        that.logger.debug(formatLogMsg(that,"Polling interval: " + this.pollingInterval));

        //create tmp destination folder for media-server m3u8 files
        return qfs.makeTree(this.tmpM3u8Folder)
            .then(function() {
                return that.m3u8generator.init();
            })
            .then(function(){
                var pGlob = Q.denodeify(glob);
                return pGlob(path.join(that.destFolderPath, '*.ts')).then(function(downloadedChunks){
                    _.each(downloadedChunks, function(c){
                        that.downloadedChunks[path.basename(c)] = true;
                    });
                });
            })
            .then(function(){
                return downloadIndefinitely.call(that, onIterationEndCallback);
            })
            .then(function(){
                FlavorDownloader.activeInstances[that.id] = that.entryId + "_" + that.flavor;
                that.runStatus = 'running';
            })
            .catch(function(err){
                that.logger.error("Error occurred while starting flavor downloader: " + err);
                err.flavor = that.flavor;
                throw err;
            });
    };

    FlavorDownloader.prototype.stop = function () {
        var that = this;
        if (that.stopPromise)
        {
            // Stop already requested
            that.logger.info('stop requested - ignoring request as this flavor downloader either already stopped or is currently stopping');
            return that.stopPromise;
        }

        var d = Q.defer();
        that.stopPromise = d.promise;
        that.stopPromise.then(function(){
            that.runStatus = 'stopped';
            that.emit("stopped", that.flavor);
        });

        var teardown = Q();
        if (that.runStatus === 'running')
        {
            var teardownInterval = config.get("flavorDownloaderTeardownInterval");
            that.logger.info('stop requested - allowing ' + teardownInterval + 'ms for orderly tear-down');
            teardown = Q.delay(teardownInterval).then(function(){
                that.logger.info('stopping flavor downloader after allowing orderly tear-down');
            });
        }

        return teardown.then(function(){
            that.logger.info('stopping flavor downloader');
            that.shouldRun = false;
            downloaderEnd.promise.then(function(){
                that.logger.info("Stopped");
                delete FlavorDownloader.activeInstances[that.id];
                d.resolve();
            });

            return d.promise;
        });
    };

    FlavorDownloader.activeInstances = {};
    FlavorDownloader.uniqueId = 0;
    return FlavorDownloader;
})();

module.exports = FlavorDownloader;