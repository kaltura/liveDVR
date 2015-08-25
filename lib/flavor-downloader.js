/**
 * Created by AsherS on 8/20/15.
 */

var Q = require('q');
var _ = require('underscore');
var path = require('path');
var url = require('url');
var httpUtils = require('./utils/HTTPUtils');
var qfs = require("q-io/fs");
var logger = require('./logger/logger');
var config = require('./Configuration');
var m3u8Handler = require('./promise-m3u8');
var chunklistM3u8Generator = require('./ChunklistManifestGenerator');

var FlavorDownloader = (function () {

    function HLSDownloader(m3u8Url, destPath) {
        this.streamUrl = m3u8Url;
        this.destFolderPath = destPath;
        this.shouldRun = true;
        this.pollingInterval = config.get("pollingInterval");
        this.tmpM3u8Folder = path.join(destPath, 'tmpM3u8');
        this.playlistName = path.basename(url.parse(m3u8Url).pathname);
        this.m3u8generator = chunklistM3u8Generator(this.destFolderPath, this.playlistName, config.get("dvrWindow"));
    }

    var downloadIndefinitely = function () {

        var that = this;
        downloadPlaylist(that.streamUrl, that.destFolderPath, that.tmpM3u8Folder, that.m3u8generator)

            .then(function success() {
                //do nothing
            }, function failure(listOfErrors) {
                logger.error("Failed to download all chunks:\n");
                var errList = _.map(listOfErrors, function (i) {
                    return i.reason + "\n";
                })
                logger.error(errList);
            })

            .catch(function (err) {
                logger.error('Error occurred in download iteration: ' + err);
            });

        setTimeout(function () {
            if (that.shouldRun) {
                downloadIndefinitely.call(that);
            }
            else {
                logger.info('downloader has shut down');
            }
        }, that.pollingInterval);
    };

    var downloadPlaylist = function (m3u8Url, filesDestFolder, tmpM3u8Folder, m3u8generator) {

        var parsedUrl = url.parse(m3u8Url);
        var baseUrl = parsedUrl.href.substring(0, parsedUrl.href.lastIndexOf('/'));
        var playlistName = path.basename(parsedUrl.pathname);
        var playlistDestPath = path.join(tmpM3u8Folder, playlistName);

        var downloadedM3u8 = undefined;

        return httpUtils.downloadFile(m3u8Url, playlistDestPath)

            .then(function finishedDownload() {
                return m3u8Handler.parseM3U8(playlistDestPath);
            })

            .then(function listFilesInDest(m3u) {
                logger.debug("Received M3U8: " + m3u);
                downloadedM3u8 = m3u;
                return qfs.list(filesDestFolder);
            })

            .then(function downloadMissingChunks(files) {
                //get all files that are in playlist but not in dir
                var chunksToDownload =  _.chain(downloadedM3u8.items.PlaylistItem)

                    .filter(function(item) {
                        return !_.contains(files, item.get('uri'));
                    }).value();

                //generate updated m3u8
                m3u8generator.update(chunksToDownload);

                //download chunks
                return _.map(chunksToDownload, function (chunk) {
                    var chunkName = chunk.get('uri');
                    var chunkUrl = url.resolve(baseUrl + '/', chunkName);

                    //return the promise of the downloaded chunk
                    return httpUtils.downloadFile(chunkUrl, path.join(filesDestFolder, chunkName));
                });
            })

            .then(function resolveAllDownloads(promises) {
                return Q.allSettled(promises);
            })

            .then(function filterResolvedPromises(results) {
                return _.filter(results, function(p) {
                    return (p.state !== 'fulfilled');
                })
            })

            .then(function checkRejectedPromises(filteredResults) {
                if (filteredResults.length > 0) {
                    return Q.reject(filteredResults)
                }
                return Q.resolve();
            });
    };

    HLSDownloader.prototype.start = function () {

        logger.info("Starting downloader - url: " + this.streamUrl + " destination folder: "+ this.destFolderPath);
        logger.info("Polling interval: " + this.pollingInterval);

        //create tmp destination folder for meida-server m3u8 files

        var that = this;
        qfs.makeTree(this.tmpM3u8Folder)
            .then(function() {
                return that.m3u8generator.init();
            })
            .then(function(){
                downloadIndefinitely.call(that);
            });
    };

    HLSDownloader.prototype.stop = function () {
        this.shouldRun = false;
    };

    return HLSDownloader;
})();




