/**
 * Created by AsherS on 8/20/15.
 */

var Q = require('q');
var _ = require('underscore');
var path = require('path');
var url = require('url');
var qfs = require("q-io/fs");
var logger = require('../logger/logger')(module);
var loggerDecorator = require('../utils/log-decorator');
var m3u8Handler = require('../manifest/promise-m3u8');
var twoPhasedChunklistManifestGenerator = require('../manifest/TwoPhasedChunklistManifestGenerator');
var util = require("util");
var events = require("events");
var config = require('../../common/Configuration');
var glob = require('glob');
var httpUtils=require('../utils/http-utils');

function isSameM3U8(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    //100 bytes are enough to verify it changed
    for (var i = a.length-1 ; i>=Math.max(a.length-100,0); i--) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}

var FlavorDownloader = (function() {
    var maxAllowedConsecutiveFailures = 2;
    var maxAmountOfDownloadPendingChunks = 20;
    var downloaderEnd = Q.defer();

    function FlavorDownloader(flavorObj, entryObj, destPath, newPlaylistName) {
        var that = this;
        events.EventEmitter.call(this);
        this.id = this.constructor.uniqueId;
        this.constructor.uniqueId = this.constructor.uniqueId + 1;
        this.entryId = entryObj.entryId;
        this.flavor = flavorObj.name ;
        this.streamUrl = flavorObj.liveURL;
        this.destFolderPath = destPath;
        this.shouldRun = true;
        this.runStatus = 'uninitialized';       //TODO: need to check all runStatus, also shouldRun -> Ron
        this.pollingInterval = config.get("pollingInterval");
        this.tmpM3u8Folder = path.join(destPath, 'tmpM3u8');
        this.downloadedChunks = {};
        this.chunksToDownload = {};
        this.failedAttempts = 0;
        // TODO: Do we need the 'id' print in addition to the flavor # for each downloader? -> Gad
        this.logger = loggerDecorator(logger, "[" + that.entryId + "][" + that.flavor + "][id:" + that.id + "] ");

        var lastM3U8Content = null;
        this._lastM3U8Time = 0;

        this.tsHttpUtils = httpUtils.HttpDownloader(this.logger);
        this.m3u8HttpUtils = httpUtils.HttpDownloader(this.logger, function(newM3u8Content) {
            var retValue=false;
            //optimization: if M3U8 has not updated the last 10 seconds then ignore
            if (lastM3U8Content &&
                new Date() - that._lastM3U8Time < 10000 &&
                isSameM3U8(lastM3U8Content, newM3u8Content)) {
                    that.logger.debug("Received same M3U8");
                    retValue = true;
            }
            lastM3U8Content = newM3u8Content;
            return retValue;
        });

        var downloadedChunksGetter = function getDownloadedChunks() { return that.downloadedChunks; };

        this.m3u8generator = twoPhasedChunklistManifestGenerator(downloadedChunksGetter, this.destFolderPath, newPlaylistName, entryObj.dvrWindow, entryObj.maxChunkCount, this.logger);

        downloaderEnd.promise.then(function() {
            that.emit("downloader-end");
        });
    }
    util.inherits(FlavorDownloader, events.EventEmitter);

    var downloadIndefinitely = function(onIterationEndCallback) {
        var that = this;
        if (!that.shouldRun) {
            downloaderEnd.resolve();
            return Q();
        }
        that.logger.debug("starting iteration");
        that.emit("iteration-start");
        return downloadPlaylist.call(that)
            .then(function() {
                // Reset failed attempts count
                that.failedAttempts = 0;
            })
            .catch(function failure(err) {
                that.emit("iteration-error", err);
                that.logger.error("iteration error: %s", err.message);

                that.failedAttempts++;
                var shouldAbort = false;

                if (that.runStatus === 'uninitialized') {
                    that.logger.error("Flavor downloader failed to initialize");
                    shouldAbort = true;
                }

                if (that.failedAttempts === maxAllowedConsecutiveFailures) {
                    // Do not try to handle this flavor if maxAllowedConsecutiveFailures attempts were reached
                    that.logger.error("Flavor downloader failed %s consecutive times - stopping it", maxAllowedConsecutiveFailures);
                    shouldAbort = true;
                }

                if (shouldAbort) {
                    that.runStatus = 'Aborting'; // Fail fast - no need to allow teardown interval
                    that.stop().catch(function (err) {
                        that.logger.error("Failed to stop: %s", err);
                    }).then(function(){
                        that.m3u8generator.remove()
                            .catch(function (err) {
                                that.logger.error("Failed to remove manifest: %s", err);
                            })
                    });

                    throw err;
                }
            })
            .then(function() {
                if (that.shouldRun) {
                    that.logger.debug("scheduling downloadIndefinitely to run in %s seconds", that.pollingInterval/1000);
                    setTimeout(function () {
                        downloadIndefinitely.call(that, onIterationEndCallback);
                    }, that.pollingInterval);
                }
            })
            .finally(function() {
                that.emit("iteration-end");
                if (!that.shouldRun) {
                    downloaderEnd.resolve();
                }
            });
    };

    var downloadChunks = function(baseUrl, chunksToDownload) {
        var that = this;
        return Q.allSettled(_.map(chunksToDownload, function(chunkName) {
                var chunkUrl = url.resolve(baseUrl + '/', chunkName);

                //return the promise of the downloaded chunk
                return that.tsHttpUtils.downloadFile(chunkUrl, path.join(that.destFolderPath, chunkName))
                    .then(function() {
                            delete that.chunksToDownload[chunkName];
                            that.downloadedChunks[chunkName] = true;
                        });
                }))
            .then(function(results) {
                // Filter the promise array and keep only the ones that were NOT resolved
                return _.filter(results, function(p) { return (p.state !== 'fulfilled') });
            })
            .then(function(filteredResults) {
                // Check the rejected promises
                if (filteredResults.length > 0) {
                    //group list of errors:
                    var errorsList = _.map(filteredResults, function(i) {
                        return i.reason + "\n";
                    });
                    return Q.reject(new Error(errorsList));
                }
                return Q.resolve();
        });
    };

    var downloadPlaylist = function() {
        var that = this;
        var parsedUrl, baseUrl, playlistName;
        var downloadFlavorManifest = function() {
            that.logger.debug( "Downloading from : %s" , that.streamUrl);
            parsedUrl = url.parse(that.streamUrl);
            baseUrl = parsedUrl.href.substring(0, parsedUrl.href.lastIndexOf('/'));
            playlistName = path.basename(parsedUrl.pathname);
            var playlistDestPath = path.join(that.tmpM3u8Folder, playlistName);
            that.logger.debug( "Temp playlist folder located at: %s" , playlistDestPath);
            that.logger.debug( "Reading current M3U8 from %s" , playlistDestPath);
            return that.m3u8HttpUtils.downloadFile(that.streamUrl, playlistDestPath).then(function() {
                that._lastM3U8Time = new Date();
                return playlistDestPath;
            });
        };
        var updateListOfNewChunksToProcess = function(downloadedM3u8) {
            var newChunks = _.chain(downloadedM3u8.items.PlaylistItem)
                .filter(function(item) {
                    return !that.downloadedChunks[item.get('uri')] && !that.chunksToDownload[item.get('uri')];
                }).value();

            // update that these new chunks need to be downloaded
            _.each(newChunks, function (c) {
                that.logger.debug("Adding %s to the list of chunks to download", c.get('uri'));
                that.chunksToDownload[c.get('uri')] = true;
            });

            if (Object.keys(that.chunksToDownload).length >= maxAmountOfDownloadPendingChunks) {
                // This shouldn't happen - stop this downloader
                that.logger.error("Chunk download list size is %s - this shouldn't happen. Stopping the downloader for this flavor", maxAmountOfDownloadPendingChunks);
                that.stop()
                    .catch(function(err){
                        that.logger.error("Failed to stop: %s", err);
                });
            }

            return newChunks;
        };
        var processObsoleteChunks = function(results) {
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
        var concludeOperation = function(results) {
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

        return Q.fcall(function() {
            return downloadFlavorManifest()
                // Finished downloading manifest
                .then(function(playlistDestPath) {
                    return m3u8Handler.parseM3U8(playlistDestPath)
                        .then(function(m3u) {
                            that.logger.debug("Received M3U8: \n%s", m3u);
                            return m3u;
                        })
                        .then(function(m3u) {
                            return updateListOfNewChunksToProcess(m3u);
                        })
                        .then(function(newChunks) {
                            //generate updated m3u8
                            var m3u8generatorPromise = that.m3u8generator.update(newChunks);
                            // Download chunks - all the chunks that were pending download beforehand along with the new chunks
                            var downloadChunksPromise = downloadChunks.call(that, baseUrl, Object.keys(that.chunksToDownload));
                            return Q.allSettled([downloadChunksPromise, m3u8generatorPromise]);
                        })
                        .then(function(results) {
                            var tmp = that.m3u8generator.getCurrentManifest();
                            if (tmp.items.PlaylistItem.length > 0) {
                                that.logger.info("Finished downloading new chunks, raising 'newTsFiles' event");
                                that.emit('newTsFiles', tmp.items.PlaylistItem.length);
                            }
                            return results;
                        })
                        .then(function(results) {
                            processObsoleteChunks(results); // Trigger deletion on a best-effort basis
                            return results;
                        })
                        .then(function(results) {
                            return concludeOperation(results);
                        });
                }, function(err) {
                    if (err == httpUtils.HttpDownloadNotChanged) {
                        return Q.resolve();
                    } else {
                        return Q.reject(err);
                    }
                });
        });
    };

    FlavorDownloader.prototype.start = function (onIterationEndCallback) {
        var that = this;
        that.logger.info("Flavor start requested");
        that.logger.info("Starting flavor downloader - url: %s destination folder: %s" , this.streamUrl , this.destFolderPath);
        that.logger.debug("Polling interval: %s " , this.pollingInterval);

        //create tmp destination folder for media-server m3u8 files
        return qfs.makeTree(this.tmpM3u8Folder)
            .then(function() {
                return that.m3u8generator.init();
            })
            .then(function(){
                var pGlob = Q.denodeify(glob);
                return pGlob(path.join(that.destFolderPath, '*.ts'))
                    .then(function(downloadedChunks) {
                        _.each(downloadedChunks, function(c) {
                            that.downloadedChunks[path.basename(c)] = true;
                        });
                });
            })
            .then(function() {
                return downloadIndefinitely.call(that, onIterationEndCallback);
            })
            .then(function() {
                FlavorDownloader.activeInstances[that.id] = that.entryId + "_" + that.flavor;
                that.runStatus = 'running';
            })
            .catch(function(err){
                that.logger.error("Error occurred while starting flavor downloader: " + err);
                err.flavor = that.flavor;
                throw err;
            });
    };

    FlavorDownloader.prototype.stop = function() {
        var that = this;
        that.logger.debug("Stopping flavor downloader");
        that.shouldRun = false;
        return downloaderEnd.promise.then(function () {
            that.logger.info("FlavorDownloader Stopped");
            delete FlavorDownloader.activeInstances[that.id];
            that.runStatus = 'stopped';
            that.emit('stopped', that.flavor);

        });
    }

    FlavorDownloader.activeInstances = {};
    FlavorDownloader.uniqueId = 0;

    return FlavorDownloader;
})();

module.exports = FlavorDownloader;