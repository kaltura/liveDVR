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
var persistenceFormat = require('./../../common/PersistenceFormat');
var diagnosticsAlerts = require('../Diagnostics/DiagnosticsAlerts');
var RecordingManager = require('./../recording/RecordingManager');
var kalturaTypes = require('./../kaltura-client-lib/KalturaTypes');
var fs = require('fs');
var preserveOriginalHLS = config.get('preserveOriginalHLS').enable;
const flavorMinPollingInterval = 200;
const flavorMaxPollingInterval = 5000;

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

function processObsoleteChunks(removedChunks) {
    // Try to delete files that were removed from the manifest
    // The last promise is the one for the update manifest request
    _.each(removedChunks, chunkName => {

        if(this.downloadedChunks[chunkName]) {
            delete this.downloadedChunks[chunkName];
            if (this.chunksToDownload[chunkName]) {
                this.logger.error("Removing chunk " + chunkName + " from chunksToDownload - BUG FOUND!!!");
                delete this.chunksToDownload[chunkName];
            }
            this.logger.debug("Delete %s from the list of downloaded chunks", chunkName);
        }
    },this);
};

var FlavorDownloader = (function() {
    var maxAmountOfDownloadPendingChunks = 20;
    var downloaderEnd = Q.defer();

    function FlavorDownloader(flavorObj, entryObj, playlistGenerator, recordingEnable) {
        var that = this;
        events.EventEmitter.call(this);
        this.id = this.constructor.uniqueId;
        this.constructor.uniqueId = this.constructor.uniqueId + 1;
        this.entryId = entryObj.entryId;
        this.recordingEnable = recordingEnable;
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

        initPollingIntervals.call(this, entryObj);

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
        this.mediaInfo = {};

        this.playlistGenerator.flvOn(this.flavor,'playlist-clips-removed',processObsoleteChunks.bind(this));
        this.encoderInformation = null;

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

    function processConversionError (err,chunkName,preventDownloadTimout) {
        var that = this;

        try {
            // remove item from chunksToDownload list
            delete that.chunksToDownload[chunkName]
            // set it up temporarily in downloadedChunks
            that.downloadedChunks[chunkName] = true

            that.logger.info("wait %d msec before removing chunk %s from downloadedChunks list", preventDownloadTimout, chunkName );
            Q.delay(preventDownloadTimout).then(()=> {
                that.logger.info("removing chunk %s from downloadedChunks list", chunkName );
                delete that.downloadedChunks[chunkName]
            });

            // do not postpone download of the next chunks in line when chunk is corrupted
            if (err instanceof MP4ConversionError) {
                that.logger.error("Error in MP4 conversion: %s, chunkName: %s", ErrorUtils.error2string(err), err.chunkName);
                let alertObj = new diagnosticsAlerts.TsConversionFailureAlert(that.flavor, err.message, err.chunkName);
                that.emit('diagnosticsAlert', alertObj);
            }
            else {
                that.logger.error("Error in MP4 conversion: %s", ErrorUtils.error2string(err));
            }
        } catch (err) {
            that.logger.error("exception while processing Error in MP4 conversion: %s", ErrorUtils.error2string(err));
        }
    }

    function downloadChunks(baseUrl, chunks, m3u8) {
        var that = this;
        let getBitrate = function(file) {
            if (file.video && file.video.duration > 0)
                return Math.round(file.metaData.fileSize_kbits / (file.video.duration / 1000));
            else if (file.audio && file.audio.duration > 0)
                return Math.round(file.metaData.fileSize_kbits / (file.audio.duration / 1000));
            else
                return 0;
        };

        return Q.allSettled(_.map(chunks, function(chunkName) {
            var chunkUrl = url.resolve(baseUrl + '/', that.chunksToDownload[chunkName]);

            return persistenceFormat.createHierarchyPath(that.destFolderPath, "flavor", that.lastFilePathHash)
                .then(function({fullPath, hash}) {
                    that.lastFilePathHash = hash;
                    //return the promise of the downloaded chunk
                    return that.tsHttpUtils.downloadConvert(chunkUrl, path.join(fullPath, chunkName))
                        .then(function(mp4File) {
                            mp4File.flavor = that.flavor;
                            mp4File.chunkName = persistenceFormat.getRelativePathFromFull(mp4File.path);
                            if(m3u8.properties.targetDuration) {
                                mp4File.targetDuration = m3u8.properties.targetDuration * 1000;
                                mp4File.windowSize = m3u8.items.PlaylistItem.length * mp4File.targetDuration * 2;
                            }
                            delete that.chunksToDownload[chunkName];
                            that.downloadedChunks[chunkName] = true;
                            //create link between original ts chunk name and mp4 file name
                            that.downloadedChunks[path.basename(mp4File.path)] = chunkName;
                            if(mp4File.metaData) {
                                mp4File.metaData.bitrate_kbps = getBitrate(mp4File);
                                diagnosticsPushData.call(that, mp4File);
                            }
                            mp4File.url=baseUrl;
                            return mp4File;
                        });
                })
                .catch(function(err) {
                    // guess timeout during which chunk is accessible
                    let period = Math.max(60000,m3u8.properties.targetDuration * 1000 * m3u8.items.PlaylistItem.length)
                    processConversionError.call(that,err,chunkName,period)
                    return Q.resolve(null);
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
    }

    function checkM3U8(m3u8) {
        let that = this;

        _.each(m3u8.items.PlaylistItem, (chunk) => {
            let minChunkDurationInSec = config.get('diagnostics').minChunkDurationInSec;
            let maxChunkDurationInSec = config.get('diagnostics').maxChunkDurationInSec;
            if (chunk.get('duration') < minChunkDurationInSec || chunk.get('duration') > maxChunkDurationInSec) {
                that.logger.warn("Invalid manifest! Chunk [%s] has a duration of [%s sec]", chunk.get('uri'), chunk.get('duration'));
                let alertObj = new diagnosticsAlerts.InvalidM3u8Alert(that.flavor, chunk.get('uri'), chunk.get('duration'));
                that.emit('diagnosticsAlert', alertObj);
            }
        })
    }

    function downloadPlaylist() {
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
                .map((item)=>{
                    var uri = item.get('uri');
                    return {
                        uri: uri,
                        cmpURI: persistenceFormat.compressChunkName(uri)
                    };
                })
                .filter((chunk) => {
                    return !that.downloadedChunks[chunk.cmpURI] && !that.chunksToDownload[chunk.cmpURI];
                })
                .value();

            // update that these new chunks need to be downloaded
            _.each(newChunks, function (newChunk) {
                that.logger.debug("Adding %j to the list of chunks to download", newChunk);
                that.chunksToDownload[newChunk.cmpURI] = newChunk.uri;
            });

            if (Object.keys(that.chunksToDownload).length >= maxAmountOfDownloadPendingChunks) {
                // This shouldn't happen - stop this downloader
                // TODO: Come up with a recovery procedure to restart FlavorDownloader -> Gad
                that.logger.error("Chunk download list size is %s - this shouldn't happen. Stopping the downloader for this flavor", maxAmountOfDownloadPendingChunks);
            }

            return downloadedM3u8;
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
                            //checkM3U8.call(that, m3u);

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
                            return downloadChunks.call(that, baseUrl, _.keys(that.chunksToDownload), m3u);
                        })
                        .then(function(mp4Files){
                            // generate updated playlist
                            var validMp4files = _.compact(mp4Files);
                            var playlistGeneratorPromises = that.playlistGenerator.update(validMp4files);
                            // filter valid mp4 files
                            validMp4files = _.filter(validMp4files, f => !f.error )
                            return { newMp4Files : validMp4files, playlistGeneratorPromises : playlistGeneratorPromises };
                        })
                        .then(function(results) {
                            // notify of ready files
                            if (results.newMp4Files.length > 0) {
                                that.logger.info("Finished downloading new files, raising 'newStreamFiles' event");
                                var duration = _.reduce(results.newMp4Files, function(memo, mp4) {
                                    return (mp4.video) ? memo + mp4.video.duration : memo + mp4.audio.duration;
                                }, 0);
                                // Raise event and send the new files' duration in Seconds
                                that.emit('newStreamFiles', that, duration / 1000);
                                if (that.recordingEnable){ //if recording is enable, and flavor is source, send event
                                    try{
                                        RecordingManager.addNewChunks(results.newMp4Files, that.entryId, that.flavor);
                                    } catch (err) {
                                        that.logger.error("Error while trying to run RecordingManager.addNewChunks %s", ErrorUtils.error2string(err))
                                    }

                                }
                            }
                            return Q.allSettled(results.playlistGeneratorPromises);
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
    }

    function diagnosticsPushData(mp4Data) {
        this.mediaInfo.resolution = mp4Data.metaData.resolution;
        this.mediaInfo.bitrate_kbps = mp4Data.metaData.bitrate_kbps;
        this.mediaInfo.framesPerSecond = mp4Data.metaData.framerate;
        this.mediaInfo.lastChunkName = mp4Data.chunkName;
        this.mediaInfo.keyFramesDistance = mp4Data.metaData.keyFrameDistance;
        this.mediaInfo.drift = this.playlistGenerator.driftInfo[this.flavor];
    }

    function getEncoderVideoBitrate() {
        return this.encoderInformation.Encoder.videoBitrate ? this.encoderInformation.Encoder.videoBitrate : 0;
    }

    function getEncoderAudioBitrate() {
        return this.encoderInformation.Encoder.audioBitrate ? this.encoderInformation.Encoder.audioBitrate : 0;
    }

    FlavorDownloader.prototype.getEncoderFrameRate = function() {
        if (this.encoderInformation && this.encoderInformation.Encoder) {
            if (_.isNumber(this.encoderInformation.Encoder.frameRate)) {
                return this.encoderInformation.Encoder.frameRate;
            }
        }
        return this.mediaInfo.framesPerSecond;
    };

    FlavorDownloader.prototype.getTotalBitrate = function() {
        let totalBitrate = 0;
        if (this.encoderInformation && this.encoderInformation.Encoder) {
            totalBitrate += getEncoderVideoBitrate.call(this);
            totalBitrate += getEncoderAudioBitrate.call(this);
        }
        return totalBitrate ? totalBitrate : this.mediaInfo.bitrate_kbps;
    };

    FlavorDownloader.prototype.setEncodedBitrate = function(encoderInformation) {
        this.encoderInformation = encoderInformation;
        let encoderBitrate = { videoBitrate : 0, audioBitrate : 0 };
        // video and audio bitrate should be in bps
        if (this.encoderInformation && this.encoderInformation.Encoder) {
                encoderBitrate.videoBitrate = getEncoderVideoBitrate.call(this) * 1000;
                encoderBitrate.audioBitrate = getEncoderAudioBitrate.call(this) * 1000;
        }
        this.playlistGenerator.setEncoderBitrate(this.flavor, encoderBitrate);
    };

    FlavorDownloader.prototype.start = function(onIterationEndCallback) {
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
                            if (that.playlistGenerator.checkFileExists(fileName)) {
                                that.logger.trace("Adding %s to downloadedChunks", fileName);
                                that.downloadedChunks[fileName] = true;
                            } else {
                                // test against 0 length file - guard against endless looping caused
                                // by crashing while attempting to convert chunk
                                checkCrashedFiles.push(qfs.stat(c).then(function (stats) {
                                    if (!stats.size) {
                                        that.logger.warn("Zero size file! Adding %s to chunksToDownload", fileName);
                                        that.downloadedChunks[fileName] = true;
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

    FlavorDownloader.prototype.toJSON = function () {

        return {
            'name': this.flavor,
            'runStatus': this.runStatus,
            'lastM3U8Time': this._lastM3U8Time,
            'mediaInfo': this.mediaInfo,
            'wowzaUrl': this.streamUrl
        };
    };

    function initPollingIntervals (entryObj) {
        if (_.isNumber(entryObj.segmentDurationMilliseconds)) {
            this.successPollingInterval = Math.floor(entryObj.segmentDurationMilliseconds/5);
            this.failPollingInterval = Math.floor(entryObj.segmentDurationMilliseconds/2);
        }

        this.successPollingInterval = Math.max(flavorMinPollingInterval, Math.min(flavorMaxPollingInterval, this.successPollingInterval));
        this.failPollingInterval = Math.max(flavorMinPollingInterval, Math.min(flavorMaxPollingInterval, this.failPollingInterval));

        this.logger.debug("[segmentDuration: %d] flavor download interval milliseconds:[success: %d] [failure: %d]", entryObj.segmentDurationMilliseconds, this.successPollingInterval, this.failPollingInterval);

    };

    FlavorDownloader.activeInstances = {};
    FlavorDownloader.uniqueId = 0;

    return FlavorDownloader;
})();

module.exports = FlavorDownloader;