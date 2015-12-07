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
        this.m3u8generator = twoPhasedChunklistManifestGenerator(this.destFolderPath, newPlaylistName, dvrWindow, this.logger);
    }
    util.inherits(FlavorDownloader, events.EventEmitter);

    var formatLogMsg = function (that, msg) {
        return "entryId: " + that.entryId + " , flavor: " + that.flavor + " - " + msg;
    };

    var downloadIndefinitely = function (onIterationEndCallback) {
        var that = this;
        if (!that.shouldRun){
            that.emit("downloader-end");
            return;
        }
        that.emit("iteration-start");
        downloadPlaylist(that)

            .fail(function failure(err) {
                that.emit("iteration-error", err);
                that.logger.error(formatLogMsg(that, "Failed to download all chunks:\n" + err + "\n" + err.stack));

                var errList = err;
                if (_.isArray(err)) {
                    errList = _.map(err, function (i) {
                        return i.reason + "\n" + i.stack + "\n";
                    });
                }
                that.logger.error(formatLogMsg(that,errList));
            })
            .finally(function(){
                if (that.shouldRun){
                    setTimeout(function () {
                            downloadIndefinitely.call(that, onIterationEndCallback);
                    }, that.pollingInterval);
                }

                that.emit("iteration-end");

                if (!that.shouldRun)
                {
                    that.emit("downloader-end");
                }
            });
    };

    var downloadChunks = function (that, baseUrl, chunksToDownload) {
        return Q.allSettled(_.map(chunksToDownload, function (chunk) {
            var chunkName = chunk.get('uri');
            var chunkUrl = url.resolve(baseUrl + '/', chunkName);

            //return the promise of the downloaded chunk
            return  that.httpUtils.downloadFile(chunkUrl, path.join(that.destFolderPath, chunkName));

        }))
            .then(function filterResolvedPromises(results) {
                return _.filter(results, function (p) {
                    return (p.state !== 'fulfilled');
                });
            })
            .then(function checkRejectedPromises(filteredResults) {
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
        that.logger.debug(formatLogMsg(that, "Downloading from : " + that.streamUrl));
        var parsedUrl = url.parse(that.streamUrl);
        var baseUrl = parsedUrl.href.substring(0, parsedUrl.href.lastIndexOf('/'));
        var playlistName = path.basename(parsedUrl.pathname);
        var playlistDestPath = path.join(that.tmpM3u8Folder, playlistName);
        that.logger.debug(formatLogMsg(that, "Temp playlist folder located at: " + playlistDestPath));

        var downloadedM3u8;

        return that.httpUtils.downloadFile(that.streamUrl, playlistDestPath)

            .then(function finishedDownload() {
                that.logger.debug(formatLogMsg(that, "Reading current M3U8 from " + playlistDestPath));
                return m3u8Handler.parseM3U8(playlistDestPath);
            })

            .then(function listFilesInDest(m3u) {
                that.logger.debug(formatLogMsg(that,"Received M3U8: \n" + m3u.toString()));
                downloadedM3u8 = m3u;
                return qfs.list(that.destFolderPath);
            })

            .then(function downloadMissingChunks(files) {
                //get all files that are in playlist but not in dir
                var chunksToDownload =  _.chain(downloadedM3u8.items.PlaylistItem)
                    .filter(function(item) {
                        return !_.contains(files, item.get('uri'));
                    }).value();

                //generate updated m3u8
                var m3u8generatorPromise = that.m3u8generator.update(chunksToDownload);

                //download chunks
                var downloadChunksPromise = downloadChunks(that, baseUrl, chunksToDownload);

                return Q.allSettled([downloadChunksPromise, m3u8generatorPromise]);
            })
            .then(function(results){ // Try to delete files that were removed from the manifest
                // The last promise is the one for the update manifest request
                var manifestUpdatePromiseResult = _.last(results);
                if (manifestUpdatePromiseResult.state === 'fulfilled')
                {
                    _.each(manifestUpdatePromiseResult.value.removedChunks, function(itemToDelete){
                        // Delete on a best effort basis
                        var pathToDelete = path.join(that.destFolderPath, itemToDelete.get('uri'));
                        qfs.remove(pathToDelete)
                            .then(function() {
                                logger.info('Successfully deleted chunk ' + itemToDelete.get('uri'));
                            })
                            .catch(function() {
                            logger.error('Error deleting a chunk which was removed from a manifest - ' + itemToDelete.get('uri'));
                        });
                    });
                }
                return results;
            })
            .then(function(results) {
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
            });
    };

    FlavorDownloader.prototype.start = function (onIterationEndCallback) {

        var that = this;

        that.logger.info(formatLogMsg(that,"Starting downloader - url: " + this.streamUrl + " destination folder: "+ this.destFolderPath));
        that.logger.info(formatLogMsg(that,"Polling interval: " + this.pollingInterval));

        //create tmp destination folder for media-server m3u8 files
        return qfs.makeTree(this.tmpM3u8Folder)
            .then(function() {
                return that.m3u8generator.init();
            })
            .then(function(){
                downloadIndefinitely.call(that,onIterationEndCallback);
            })
            .catch(function(err){
                that.logger.error("Error occurred while starting flavor downloader for entry id: " + that.entryId + " flavor: " + that.flavor + "\n" + err + " stack: " + err.stack);
                err.flavor = that.flavor;
                throw err;
            });
    };

    FlavorDownloader.prototype.stop = function () {
        var that = this;
        that.logger.info('stopping flavor downloader for entry id: ' + this.entryId + " flavor: " + this.flavor);
        var d = Q.defer();
        this.shouldRun = false;
        this.on('downloader-end', function(){
            that.logger.info(formatLogMsg(that,"Stopped"));
            d.resolve();
        });
        return d.promise;
    };

    return FlavorDownloader;
})();

module.exports = FlavorDownloader;