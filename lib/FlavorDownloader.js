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
var chunkInfoUtils = require('./utils/chunkInfo');
var nginxLiveCtor = require('./nginxLive');

var FlavorDownloader = (function () {

    var maxInitializationAttempts = 5;

    function FlavorDownloader(m3u8Url, destPath, entryId, flavor, newPlaylistName, manifestTimeWindow, manifestMaxChunkCount) {
        var that = this;
        events.EventEmitter.call(this);
        this.entryId = entryId;
        this.flavor = flavor;
        this.streamUrl = m3u8Url;
        this.destFolderPath = destPath;
        this.shouldRun = true;
        this.isEnabled = true;
        this.pollingInterval = config.get("pollingInterval");
        this.tmpM3u8Folder = path.join(destPath, 'tmpM3u8');
        this.downloadedChunks = {};
        this.chunksToDownload = {};
        this.failedAttempts = 0;
        this.nginxLive = nginxLiveCtor();

        var messageDecoration = function(msg) {
            return "[" + that.entryId + "][" + that.flavor + "] " + msg;
        };
        this.logger = loggerDecorator(logger, messageDecoration);

        this.httpUtils = require('./utils/http-utils')(this.logger);

        var downloadedChunksGetter = function getDownloadedChunks(){
            return that.downloadedChunks;
        };

        this.m3u8generator = twoPhasedChunklistManifestGenerator(downloadedChunksGetter, this.destFolderPath, newPlaylistName, manifestTimeWindow, manifestMaxChunkCount, this.logger);
    }
    util.inherits(FlavorDownloader, events.EventEmitter);

    var formatLogMsg = function (that, msg) {
        return "entryId: " + that.entryId + " , flavor: " + that.flavor + " - " + msg;
    };

    var downloadIndefinitely = function (onIterationEndCallback) {
        var that = this;
        that.logger.info("starting iteration");
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
                throw err;
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

    var updateDownloadedChunkInfo = function(chunkDestPath){
        var that = this;
        var chunkName = path.basename(chunkDestPath);
        return chunkInfoUtils.extractChunkAudioVideoDuration(chunkDestPath)
            .then(function(chunkData){
                delete that.chunksToDownload[chunkName];
                that.downloadedChunks[chunkName] = {
                    audioLength : chunkData.audioLength,
                    videoLength : chunkData.videoLength,
                    audioStreamStartTime : chunkData.audioStreamStartTime,
                    videoStreamStartTime : chunkData.videoStreamStartTime,
                    videoStartPtsInMillis : chunkData.videoStartPtsInMillis,
                    audioStartPtsInMillis : chunkData.audioStartPtsInMillis,
                    downloadTime : (new Date()).getTime()
                };
            });
    }

    var downloadChunks = function (that, baseUrl, chunksToDownload) {
        return Q.allSettled(_.map(chunksToDownload, function (chunkName) {
            var chunkUrl = url.resolve(baseUrl + '/', chunkName);

            //return the promise of the downloaded chunk
            var chunkDestPath = path.join(that.destFolderPath, chunkName);
            return that.httpUtils.downloadFile(chunkUrl, chunkDestPath)
                .then(function(){
                    return updateDownloadedChunkInfo.call(that, chunkDestPath);
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
                logger.debug('Adding ' + c.get('uri') + ' to the list of chunks to download');
                that.chunksToDownload[c.get('uri')] = true;
            });

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
                        logger.error("Removing chunk " + chunkName + " from chunksToDownload - this shouldn't happen");
                        delete that.chunksToDownload[chunkName];
                    }
                });

                // Remove the obsolete chunks' reference from persistence
                _.each(manifestUpdatePromiseResult.value.removedChunks, function (chunk) {
                    logger.debug('Delete ' + chunk.get('uri') + ' from the list of chunks to download');
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
            return downloadFlavorManifest().catch(function (err) {
                that.failedAttempts = that.failedAttempts + 1;
                if (that.failedAttempts === maxInitializationAttempts) {
                    // Do not try to handle this flavor if maxInitializationAttempts attempts were reached
                    that.logger.error("Failed to download flavor manifest " + maxInitializationAttempts + " times - stopping the flavor downloader for it");
                    that.stop();
                }
                throw err;
            }).then(function finishedDownload(playlistDestPath) {
                return m3u8Handler.parseM3U8(playlistDestPath)
                    .then(function (m3u) {
                        that.logger.debug(formatLogMsg(that, "Received M3U8: \n" + m3u.toString()));
                        return m3u;
                    });
            }).then(function (m3u) {
                return updateListOfNewChunksToProcess(m3u);
            }).then(function (newChunks) {
                //generate updated m3u8
                var resultPromises = [];
                var m3u8generatorPromise = that.m3u8generator.update(newChunks);

                // Download chunks - all the chunks that were pending download beforehand along with the new chunks
                resultPromises.push(downloadChunks(that, baseUrl, Object.keys(that.chunksToDownload)));
                resultPromises.push(m3u8generatorPromise);
                return Q.allSettled(resultPromises);
            }).then(function(results){
                var manifestUpdatePromiseResult = _.last(results);
                if (manifestUpdatePromiseResult.state === 'fulfilled') {
                    var currentManifest = that.m3u8generator.getCurrentManifest();
                    if (currentManifest.items.PlaylistItem.length > 0) {
                        var removedChunksDuration = _.reduce(manifestUpdatePromiseResult.value.removedChunks, function(memo, c){ return memo + c.get('duration'); }, 0);
                        that.nginxLive.offset = that.nginxLive.offset + removedChunksDuration;
                        var nginxInput = that.nginxLive.generateInput(that.downloadedChunks, that.destFolderPath, currentManifest);
                        that.nginxInput_audio = nginxInput.audio;
                        that.nginxInput_video = nginxInput.video;
                        qfs.write(path.join(that.destFolderPath, that.flavor + "_audio.json"), JSON.stringify(nginxInput.audio)).done();
                        qfs.write(path.join(that.destFolderPath, that.flavor + "_video.json"), JSON.stringify(nginxInput.video)).done();
                    }
                }
                return results;

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
                    var updateInfoPromises = _.map(downloadedChunks, function(c){
                        return updateDownloadedChunkInfo.call(that, c);
                    })
                    return Q.all(updateInfoPromises);
                });
            })
            .then(function(){
                FlavorDownloader.activeInstances = FlavorDownloader.activeInstances + 1;
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
        that.logger.info("Flavor stop requested");
        if (!that.isEnabled)
        {
            // Already not running - nothing to stop
            that.logger.info('stop requested - ignoring request as this flavor downloader either already stopped or is currently stopping');
            return that.stopPromise;
        }

        that.isEnabled = false;
        var teardownInterval = config.get("flavorDownloaderTeardownInterval");
        that.logger.info('stop requested - allowing ' + teardownInterval + 'ms for orderly tear-down');
        var d = Q.defer();
        that.stopPromise = d.promise;
        return Q.delay(teardownInterval).then(function(){
            that.logger.info('stopping flavor downloader after allowing orderly tear-down');
            that.shouldRun = false;
            that.on('downloader-end', function(){
                that.logger.info(formatLogMsg(that,"Stopped"));
                FlavorDownloader.activeInstances = FlavorDownloader.activeInstances - 1;
                d.resolve();
            });
            return d.promise;
        });
    };

    FlavorDownloader.activeInstances = 0;
    return FlavorDownloader;
})();

module.exports = FlavorDownloader;