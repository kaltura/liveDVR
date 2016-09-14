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
var util = require("util");
var events = require("events");
var config = require('../../common/Configuration');
var glob = require('glob');
var httpUtils=require('../utils/http-utils');
var MP4ConversionError = require('../MP4WriteStream').ConversionError;
var ErrorUtils = require('./../utils/error-utils');
var fs = require('fs');
var persistenceFormat = require('./../../common/PersistenceFormat');
var fsUtils = require('./../utils/fs-utils');
var preserveOriginalHLS = config.get('preserveOriginalHLS').enable;

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

    function FlavorDownloader(flavorObj, entryObj, playlistGenerator) {
        var that = this;
        events.EventEmitter.call(this);
        this.id = this.constructor.uniqueId;
        this.constructor.uniqueId = this.constructor.uniqueId + 1;
        this.entryId = entryObj.entryId;
        this.flavor = flavorObj.name ;
        this.streamUrl = flavorObj.liveURL;
        this.destFolderPath = persistenceFormat.getFlavorFullPath(this.entryId, this.flavor);
        this.shouldRun = true;
        this.runStatus = 'uninitialized';
        this.lastFilePathHash = null;
        this.successPollingInterval = config.get('flavorSuccessPollingInterval');
        this.failPollingInterval = config.get('flavorFailPollingInterval');
        this.tmpM3u8Folder = path.join(this.destFolderPath, 'tmpM3u8');
        this.downloadedChunks = {};
        this.chunksToDownload = {};
        this.loggerInformation =  "[" + that.entryId + "][" + that.flavor + "][id:" + that.id + "] ";
        this.logger =  loggerModule.getLogger("FlavorDownloader",  this.loggerInformation);

        var lastM3U8Content = null;
        this._lastM3U8Time = 0;

        this.tsHttpUtils = httpUtils.HttpDownloader(this.loggerInformation);
        this.m3u8HttpUtils = httpUtils.HttpDownloader(this.loggerInformation, function(newM3u8Content) {
            var retValue=false;
            //optimization: if M3U8 has not updated the last 10 seconds then ignore
            if (lastM3U8Content &&
                new Date() - that._lastM3U8Time < 10000 &&
                isSameM3U8(lastM3U8Content, newM3u8Content)) {
                    retValue = true;
            }
            lastM3U8Content = newM3u8Content;
            return retValue;
        });

        this.playlistGenerator = playlistGenerator;

        downloaderEnd.promise.then(function() {
            that.emit("downloader-end");
        });
    }
    util.inherits(FlavorDownloader, events.EventEmitter);

    var downloadIndefinitely = function(onIterationEndCallback) {
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
            .catch(function(err) {
                that.emit("iteration-error", err);
                that.logger.error("iteration error: %j (%s)", err, err.stack ? err.stack : "");
                iterationFailed = true;
                if (that.runStatus === 'uninitialized') {
                    that.logger.error("Flavor downloader failed to initialize");
                }
            })
            .then(function() {
                if (that.shouldRun) {
                    var interval = iterationFailed ? that.failPollingInterval : that.successPollingInterval;
                    that.logger.debug("scheduling downloadIndefinitely to run in %s seconds", interval/1000);
                    setTimeout(function () {
                        downloadIndefinitely.call(that, onIterationEndCallback);
                    }, interval);
                }
            })
            .finally(function() {
                that.emit("iteration-end");
                if (!that.shouldRun) {
                    downloaderEnd.resolve();
                }
            });
    };

    var downloadChunks = function(baseUrl, chunksToDownload, downloadedM3u8) {
        var that = this;
        return Q.allSettled(_.map(chunksToDownload, function(chunkName) {
            var chunkUrl = url.resolve(baseUrl + '/', chunkName);
            return persistenceFormat.createHierarchyPath(that.destFolderPath, that.lastFilePathHash)
                .then(function({fileFullPath, hash}) {
                    that.lastFilePathHash = hash;
                    //return the promise of the downloaded chunk
                    return that.tsHttpUtils.downloadConvert(chunkUrl, path.join(fileFullPath, chunkName))
                        .then(function(mp4File) {
                            mp4File.flavor = that.flavor;
                            mp4File.chunkName = chunkName;
                            if(downloadedM3u8.properties.targetDuration) {
                                mp4File.targetDuration = downloadedM3u8.properties.targetDuration * 1000;
                                mp4File.windowSize = downloadedM3u8.items.PlaylistItem.length * mp4File.targetDuration * 2;
                            }
                            delete that.chunksToDownload[chunkName];
                            that.downloadedChunks[chunkName] = true;
                            //create link between original ts chunk name and mp4 file name
                            that.downloadedChunks[path.basename(mp4File.path)] = chunkName;
                            return mp4File;
                        })
                        .catch(function(err) {
                            // do not postpone download of the next chunks in line when chunk is corrupted
                            if(err instanceof MP4ConversionError){
                                that.logger.warn("failed to convert: error string: %s, chunk: %s", err,err.chunkName);
                                delete that.chunksToDownload[chunkName];
                                return Q.resolve(null);
                            }
                        });
                });
        }))
        .then(function(results) {
            // Filter the promise array and keep only the ones that were NOT resolved
            var filteredResults = _.filter(results, function(p) { return (p.state !== 'fulfilled') });
            if (filteredResults.length > 0) {
                //group list of errors:
                var errorsList = _.map(filteredResults,function(i) {
                    return i.reason + "\n";
                });
                return Q.reject(new Error(errorsList));
            }
            return Q.resolve(_.map(results,function(p){
                return p.value;
            }));
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
            return that.m3u8HttpUtils.downloadFile(that.streamUrl, playlistDestPath).then(function(content) {
                that._lastM3U8Time = new Date();
                return { path: playlistDestPath, content: content };
            });
        };
        var updateListOfNewChunksToProcess = function(downloadedM3u8) {
            var newChunks = _.chain(downloadedM3u8.items.PlaylistItem)
                .map(function(item){
                    return item.get('uri');
                })
                .filter(function(newChunk) {
                    return !that.downloadedChunks[newChunk] && !that.chunksToDownload[newChunk];
                })
                .value();

            // update that these new chunks need to be downloaded
            _.each(newChunks, function (newChunk) {
                that.logger.debug("Adding %s to the list of chunks to download", newChunk);
                that.chunksToDownload[newChunk] = true;
            });

            if (Object.keys(that.chunksToDownload).length >= maxAmountOfDownloadPendingChunks) {
                // This shouldn't happen - stop this downloader
                that.logger.error("Chunk download list size is %s - this shouldn't happen. Stopping the downloader for this flavor", maxAmountOfDownloadPendingChunks);
                that.stop()
                    .catch(function(err){
                        that.logger.error("Failed to stop: %s", err);
                    });
            }

            return downloadedM3u8;
        };
        var processObsoleteChunks = function(results) {
            // Try to delete files that were removed from the manifest
            // The last promise is the one for the update manifest request
            var manifestUpdatePromiseResult = _.last(results);
            if (manifestUpdatePromiseResult.state === 'fulfilled') {


                // Remove the obsolete chunks' reference from persistence
                // Ensure that chunks removed from the intermediate manifest are not in the chunksToDownload list
                // (as they will never be processed)
                _.each(manifestUpdatePromiseResult.value.removedChunks, function (chunkName) {

                    var realChunkName = that.downloadedChunks[chunkName];

                    if(typeof realChunkName === 'string'){
                        // delete link to original chunkName
                        delete that.downloadedChunks[chunkName];
                        chunkName = realChunkName;
                    }

                    if (that.chunksToDownload[chunkName]) {
                        that.logger.error("Removing chunk " + chunkName + " from chunksToDownload - this shouldn't happen");
                        delete that.chunksToDownload[chunkName];
                    }

                    that.logger.debug("Delete %s from the list of downloaded chunks", chunkName);
                    delete that.downloadedChunks[chunkName];

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
                .then(function(result) {
                    return m3u8Handler.parseM3U8(result.content,{ verbatim: true})

                        .then(function(m3u) {
                            that.logger.debug("Received M3U8: \n%s", result.content);
                            //that.logger.debug("Parsed M3U8: %j", m3u);

                            if (preserveOriginalHLS) {
                                fs.rename(result.path, util.format("%s/chunklist_%d.m3u8", that.destFolderPath, m3u.properties.mediaSequence));
                            }
                            return m3u;
                        })
                        .then(function(m3u) {
                            return updateListOfNewChunksToProcess(m3u);
                        })
                        .then(function(m3u) {
                            // Download chunks - all the chunks that were pending download beforehand along with the new chunks
                            return downloadChunks.call(that, baseUrl, Object.keys(that.chunksToDownload),m3u);
                        })
                        .then(function(mp4Files){
                            // generate updated playlist
                            var validMp4files = _.compact(mp4Files);
                            var playlistGeneratorPromises = that.playlistGenerator.update(validMp4files);
                            return { newMp4Files : validMp4files, playlistGeneratorPromises : playlistGeneratorPromises };
                        })
                        .then(function(results) {
                            // notify of ready files
                            if (results.newMp4Files.length > 0) {
                                that.logger.info("Finished downloading new files, raising 'newStreamFiles' event");
                                var duration = _.reduce(results.newMp4Files, function(memo, mp4) {
                                    return memo + mp4.video ? mp4.video.duration : mp4.audio.duration;
                                }, 0);
                                // Raise event and send the new files' duration in Seconds
                                that.emit('newStreamFiles', that, duration / 1000);
                            }
                            return Q.allSettled(results.playlistGeneratorPromises);
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
        that.logger.debug("Starting flavor downloader - destination folder: %s", this.destFolderPath);
        that.logger.debug("Polling interval: %s seconds", this.successPollingInterval/1000);

        //create tmp destination folder for media-server m3u8 files
        return qfs.makeTree(this.tmpM3u8Folder)
            .then(function(){
                var pGlob = Q.denodeify(glob);
                return pGlob(path.join(that.destFolderPath, '*.mp4'))
                    .then(function(downloadedChunks) {
                        var checkCrashedFiles = [];
                        _.each(downloadedChunks, function (c) {
                            var fileName = path.basename(c);
                            var tsFileName = persistenceFormat.getTSChunknameFromMP4FileName(fileName);
                            if (that.playlistGenerator.checkFileExists(fileName)) {
                                that.logger.trace("Adding %s to downloadedChunks", fileName);
                                that.downloadedChunks[tsFileName] = true;
                                that.downloadedChunks[fileName] = tsFileName;
                            } else {
                                // test against 0 length file - guard against endless looping caused
                                // by crashing while attempting to convert chunk
                                checkCrashedFiles.push(qfs.stat(c).then(function (stats) {
                                    if (!stats.size) {
                                        that.logger.warn("Zero size file! Adding %s to chunksToDownload", fileName);
                                        that.chunksToDownload[tsFileName] = true;
                                    }
                                }));
                            }
                        });
                        if (checkCrashedFiles.length) {
                            return Q.allSettled(checkCrashedFiles);
                        }
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
        return downloaderEnd.promise.then(function () {
            that.logger.info("FlavorDownloader Stopped");
            delete FlavorDownloader.activeInstances[that.id];
            that.runStatus = 'stopped';
            that.emit('stopped', that.flavor);

        });
    };

    FlavorDownloader.prototype.reset = function() {
        this.downloadedChunks = {};
        this.chunksToDownload = {};
    };

    FlavorDownloader.activeInstances = {};
    FlavorDownloader.uniqueId = 0;

    return FlavorDownloader;
})();

module.exports = FlavorDownloader;