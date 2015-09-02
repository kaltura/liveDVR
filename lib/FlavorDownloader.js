/**
 * Created by AsherS on 8/20/15.
 */

var Q = require('q');
var _ = require('underscore');
var path = require('path');
var url = require('url');
var qfs = require("q-io/fs");
var logger = require('./logger/logger');
var m3u8Handler = require('./promise-m3u8');
var chunklistM3u8Generator = require('./ChunklistManifestGenerator');
var util = require("util");
var events = require("events");
var config = require('./Configuration');
var httpUtils = require('./utils/http-utils');

var FlavorDownloader = (function () {
    function FlavorDownloader(m3u8Url, destPath, entryId, flavor, newPlaylistName) {
        events.EventEmitter.call(this);
        this.time = new Date().getTime();
        this.entryId = entryId;
        this.flavor = flavor;
        this.streamUrl = m3u8Url;
        this.destFolderPath = destPath;
        this.shouldRun = true;
        this.pollingInterval = config.get("pollingInterval");
        this.tmpM3u8Folder = path.join(destPath, 'tmpM3u8');
        this.m3u8generator = chunklistM3u8Generator(this.destFolderPath, newPlaylistName, config.get("dvrWindow"));
    }
    util.inherits(FlavorDownloader, events.EventEmitter);

    var formatLogMsg = function (that, msg) {
        return "entryId: " + that.entryId + " , flavor: " + that.flavor + " - " + msg;
    };

    var downloadIndefinitely = function (onIterationEndCallback) {
        var that = this;
        if (!that.shouldRun){
            return;
        }
        that.emit("iteration-start");
        downloadPlaylist(that)

            .fail(function failure(err) {
                that.emit("iteration-error", err);
                logger.error(formatLogMsg(that, "Failed to download all chunks:\n" + err + "\n" + err.stack));

                var errList = err;
                if (_.isArray(err)) {
                    errList = _.map(err, function (i) {
                        return i.reason + "\n" + i.stack + "\n";
                    });
                }
                logger.error(formatLogMsg(that,errList));
            })
            .finally(function(){
                if (that.shouldRun){
                    setTimeout(function () {
                            downloadIndefinitely.call(that, onIterationEndCallback);
                    }, that.pollingInterval)
                }
                else
                {
                    logger.info(formatLogMsg(that,"CCCCCCCCCCCCCCCCCCCC Stopped"));
                    that.emit("downloader-end");
                }
                that.emit("iteration-end");
            });
    };

    var downloadChunks = function (that, baseUrl, chunksToDownload) {
        return Q.allSettled(_.map(chunksToDownload, function (chunk) {
            var chunkName = chunk.get('uri');
            var chunkUrl = url.resolve(baseUrl + '/', chunkName);

            //return the promise of the downloaded chunk
            return httpUtils.downloadFile(chunkUrl, path.join(that.destFolderPath, chunkName));

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
        logger.debug(formatLogMsg(that, "Downloading from : " + that.streamUrl));
        var parsedUrl = url.parse(that.streamUrl);
        var baseUrl = parsedUrl.href.substring(0, parsedUrl.href.lastIndexOf('/'));
        var playlistName = path.basename(parsedUrl.pathname);
        var playlistDestPath = path.join(that.tmpM3u8Folder, playlistName);
        logger.debug(formatLogMsg(that, "Temp playlist folder located at: " + playlistDestPath));

        var downloadedM3u8;

        logger.debug(formatLogMsg(that, "Flavor downloader " + that.time + " Downloading playlist content to : " + playlistDestPath));
        return httpUtils.downloadFile(that.streamUrl, playlistDestPath)

            .then(function finishedDownload() {
                logger.debug(formatLogMsg(that, "Reading current M3U8 from " + playlistDestPath));
                return m3u8Handler.parseM3U8(playlistDestPath);
            })

            .then(function listFilesInDest(m3u) {
                logger.debug(formatLogMsg(that,"Received M3U8: \n" + m3u.toString()));
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

        logger.info(formatLogMsg(that,"Starting downloader - url: " + this.streamUrl + " destination folder: "+ this.destFolderPath));
        logger.info(formatLogMsg(that,"Polling interval: " + this.pollingInterval));

        //create tmp destination folder for media-server m3u8 files
        return qfs.makeTree(this.tmpM3u8Folder)
            .then(function() {
                return that.m3u8generator.init();
            })
            .then(function(){
                downloadIndefinitely.call(that,onIterationEndCallback);
            })
            .catch(function(err){
                logger.error("Error occurred while starting flavor downloader for entry id: " + that.entryId + " flavor: " + that.flavor + "\n" + err);
                err.flavor = flavor;
                throw err;
            });
    };

    FlavorDownloader.prototype.stop = function () {
        var that = this;
        logger.info('stopping flavor downloader for entry id: ' + this.entryId + " flavor: " + this.flavor);
        var d = Q.defer();
        this.shouldRun = false;
        this.on('downloader-end', function(){
            logger.info(formatLogMsg(that,"Stopped"));
            d.resolve();
        })
        return d.promise;
    };

    return FlavorDownloader;
})();

module.exports = FlavorDownloader;
