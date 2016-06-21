/**
 * Created by AsherS on 8/20/15.
 */

var Q = require('q');
var _ = require('underscore');
var path = require('path');
var url = require('url');
var qfs = require("q-io/fs");
var loggerModule = require('../../common/logger');
var m3u8Handler = require('../manifest/promise-m3u8');
var twoPhasedChunklistManifestGenerator = require('../manifest/TwoPhasedChunklistManifestGenerator');
var util = require("util");
var events = require("events");
var config = require('../../common/Configuration');
var glob = require('glob');
var httpUtils=require('../utils/http-utils');
var ErrorUtils = require('./../utils/error-utils');
var fsUtils = require('./../utils/fs-utils');

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
    var maxAmountOfDownloadPendingChunks = 20;
    var downloaderEnd = Q.defer();

    function FlavorDownloader(flavorObj, entryObj, destPath, newPlaylistName) {
        var that = this;
        events.EventEmitter.call(this);
        this.id = this.constructor.uniqueId;
        this.constructor.uniqueId = this.constructor.uniqueId + 1;
        this.entryId = entryObj.entryId;
        this.flavor = flavorObj.name;
        this.streamUrl = flavorObj.liveURL;
        this.destFolderPath = destPath;
        this.newPlaylistName = newPlaylistName;
        this.shouldRun = true;
        this.runStatus = 'uninitialized';
        this.successPollingInterval = config.get('flavorSuccessPollingInterval');
        this.failPollingInterval = config.get('flavorFailPollingInterval');
        this.tmpM3u8Folder = path.join(destPath, 'tmpM3u8');
        this.downloadedChunks = {};
        this.chunksToDownload = {};
        this.loggerInformation = "[" + that.entryId + "][" + that.flavor + "][id:" + that.id + "] ";
        this.logger = loggerModule.getLogger("FlavorDownloader", this.loggerInformation);

        var lastM3U8Content = null;
        this._lastM3U8Time = 0;

        this.tsHttpUtils = httpUtils.HttpDownloader(this.logger);
        this.m3u8HttpUtils = httpUtils.HttpDownloader(this.logger, function (newM3u8Content) {
            var retValue = false;
            //optimization: if M3U8 has not updated the last 10 seconds then ignore
            if (lastM3U8Content &&
                new Date() - that._lastM3U8Time < 10000 &&
                isSameM3U8(lastM3U8Content, newM3u8Content)) {
                retValue = true;
            }
            lastM3U8Content = newM3u8Content;
            return retValue;
        });

        var downloadedChunksGetter = function getDownloadedChunks() { return that.downloadedChunks; };

        this.m3u8generator = twoPhasedChunklistManifestGenerator(downloadedChunksGetter, this.destFolderPath, newPlaylistName, entryObj, this.loggerInformation);

        downloaderEnd.promise.then(function() {
            that.emit("downloader-end");
        });
    }
    util.inherits(FlavorDownloader, events.EventEmitter);

    var downloadIndefinitely;
    downloadIndefinitely = function (onIterationEndCallback) {
        var that = this;
        var iterationFailed = false;
        if (!that.shouldRun) {
            that.logger.debug("Flavor downloader stopped, exiting downloadIndefinitely method");
            downloaderEnd.resolve();
            return Q();
        }
        that.logger.debug("starting iteration");
        that.emit("iteration-start");
        return downloadPlaylist.call(that)
            .catch(function failure(err) {
                that.emit("iteration-error", err);
                that.logger.error("iteration error: %j (%s)", err, err.stack ? err.stack : "");
                iterationFailed = true;
                if (that.runStatus === 'uninitialized') {
                    that.logger.error("Flavor downloader failed to initialize");
                }
            })
            .then(function () {
                if (that.shouldRun) {
                    var interval = iterationFailed ? that.failPollingInterval : that.successPollingInterval;
                    that.logger.debug("scheduling downloadIndefinitely to run in %s seconds", interval / 1000);
                    setTimeout(function () {
                        downloadIndefinitely.call(that, onIterationEndCallback);
                    }, interval);
                }
            })
            .finally(function () {
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
            parsedUrl = url.parse(that.streamUrl);
            baseUrl = parsedUrl.href.substring(0, parsedUrl.href.lastIndexOf('/'));
            playlistName = path.basename(parsedUrl.pathname);
            var playlistDestPath = path.join(that.tmpM3u8Folder, playlistName);
            return that.m3u8HttpUtils.downloadFile(that.streamUrl, playlistDestPath)
                .then(function(content) {
                    that._lastM3U8Time = new Date();
                    return { path: playlistDestPath, content: content };
                });
        };
        var updateListOfNewChunksToProcess = function(downloadedM3u8) {
            var newChunks = _.chain(downloadedM3u8.items.PlaylistItem)
                .filter(function(item) {
                    return !that.downloadedChunks[item.get('uri')] && !that.chunksToDownload[item.get('uri')];
                }).value();

            // update that these new chunks need to be downloaded
            _.each(newChunks, function (c) {
                that.logger.debug("Adding %s (duration = %s) to the list of chunks to download", c.get('uri'), c.get('duration'));
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
                // Delete the obsolete chunks from disk
                _.each(results.removedChunks, function (itemToDelete) {
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
                _.each(results.bumpedChunks, function (chunk) {
                    var chunkName = chunk.get('uri');
                    if (that.chunksToDownload[chunkName]) {
                        that.logger.error("Removing chunk " + chunkName + " from chunksToDownload - this shouldn't happen");
                        delete that.chunksToDownload[chunkName];
                    }
                });

                // Remove the obsolete chunks' reference from persistence
                _.each(results.removedChunks, function (chunk) {
                    that.logger.debug('Delete ' + chunk.get('uri') + ' from the list of chunks to download');
                    delete that.downloadedChunks[chunk.get('uri')];
                });
            
        };
        var concludeOperation = function(err) {
            var errorsString  = ErrorUtils.error2string(err);
                throw new Error(errorsString);
        };

        return Q.fcall(function() {
            var downloadChunksPromise;
            return downloadFlavorManifest()
            // Finished downloading manifest
                .then(function(result) {
                    return m3u8Handler.parseM3U8(result.content,{ verbatim: true})

                        .then(function(m3u) {
                            that.logger.debug("Received M3U8: \n%s", result.content);
                            //that.logger.debug("Parsed M3U8: %j", m3u);
                            return m3u;
                        })
                        .then(function(m3u) {
                            return updateListOfNewChunksToProcess(m3u);
                        })
                        .then(function(newChunks) {
                            var deferred = Q.defer();

                            downloadChunksPromise = downloadChunks.call(that, baseUrl, Object.keys(that.chunksToDownload)).finally(function()
                            {
                                that.m3u8generator.update(newChunks).then(function(result)
                                {
                                    deferred.resolve(result);
                                },function(err)
                                {
                                    deferred.reject(err);
                                })
                            });

                            return deferred.promise;
                        })
                        .then(function(results) {
                            var newItemsCount= results.newItemsCount;
                            if (newItemsCount > 0) {
                                that.emit('newTsFiles', that, newItemsCount);
                            }
                            return results;
                        })
                        .then(function(results) {
                            processObsoleteChunks(results); // Trigger deletion on a best-effort basis
                            return results;
                        })
                        .then(function () {
                            if (downloadChunksPromise.isRejected()){
                                throw new Error(downloadChunksPromise.inspect().reason)
                            }
                        })
                        .catch(function(err) {
                            return concludeOperation(err);
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
        that.logger.debug("Starting flavor downloader - destination folder: %s", this.destFolderPath);
        that.logger.debug("Polling interval: %s seconds", this.successPollingInterval/1000);

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
                that.logger.error("Error occurred while starting flavor downloader: %s", ErrorUtils.error2string(err));
                err.flavor = that.flavor;
                throw err;
            });
    };

    FlavorDownloader.prototype.stop = function() {
        var that = this;
        that.logger.debug("Stopping flavor downloader");
        that.shouldRun = false;
        var fullPath = this.destFolderPath + '/' + this.newPlaylistName;
        var fileModifiedTime = new Date();
        fileModifiedTime.setTime(Date.now() - 7200000);

        return downloaderEnd.promise
            .then(function() {
                that.logger.info("FlavorDownloader Stopped");
                delete FlavorDownloader.activeInstances[that.id];

                // invalidate chunklist by changing the file's modified time to 2 hour back
                that.logger.debug('changing %s modified time to %s', fullPath, fileModifiedTime.toDateString());
                fsUtils.updateFileModifiedTime(fullPath, fileModifiedTime);

                that.runStatus = 'stopped';
                that.emit('stopped', that.flavor);

            });
    };

    FlavorDownloader.activeInstances = {};
    FlavorDownloader.uniqueId = 0;

    return FlavorDownloader;
})();

module.exports = FlavorDownloader;