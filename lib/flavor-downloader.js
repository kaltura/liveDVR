/**
 * Created by AsherS on 8/20/15.
 */

var Q = require('q');
var _ = require('underscore');
var path = require('path');
var url = require('url');
var httpUtils = require('./utils/HTTPUtils');
var hlsUtils = require('./utils/HLSUtils');
var qfs = require("q-io/fs");
var logger = require('./logger/logger');

var FlavorDownloader = (function () {

    function HLSDownloader(m3u8Url, destPath) {
        this.streamUrl = m3u8Url;
        this.destFolderPath = destPath;
        this.shouldRun = true;
    }

    var downloadIndefinitely = function () {

        var that = this;
        downloadPlaylist(that.streamUrl, that.destFolderPath)

            .then(function(){
                console.log('result: ' + result);
            })

            .catch(function(err){
                console.log('error ' + err);
            })

            .done();

        setTimeout(function () {
            if (that.shouldRun) {
                downloadIndefinitely.call(that);
            }
            else {
                logger.info('downloader has shut down');
            }
        }, 10000);  //todo, use configuration file
    };

    var downloadPlaylist = function (m3u8Url, dest) {

        var parsedUrl = url.parse(m3u8Url);
        var baseUrl = parsedUrl.href.substring(0, parsedUrl.href.lastIndexOf('/'));
        var playlistName = path.basename(parsedUrl.pathname);
        var playlistDestPath = path.join(dest, playlistName);

        var downloadedM3u8 = undefined;

        return httpUtils.downloadFile(m3u8Url, playlistDestPath)    //TODO replace to Elad's function

            .then(function finishedDownload() {
                return hlsUtils.readM3u8File(playlistDestPath); //TODO replace to Elad's m3u8 function - promise-m3u8
            })

            .then(function listFilesInDest(m3u) {
                logger.debug("Received M3U8: " + m3u);
                downloadedM3u8 = m3u;
                return qfs.list(dest);
            })

            .then(function downloadMissingChunks(files) {
                //get all files that are in playlist but not in dir
                return _.chain(downloadedM3u8.items.PlaylistItem)

                    .map(function(i){
                        return i.get('uri');
                    })
                    .difference(files)  //TODO, send these chunks to m3u8 generator
                    .map(function(chunk) {
                        var chunkUrl = url.resolve(baseUrl + '/', chunk);

                        //return the promise of the downloaded chunk
                        return httpUtils.downloadFile(chunkUrl, path.join(dest,chunk)); //TODO, elad's function
                    })
                    .value();
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
                    logger.error("failed to download all chunks");
                    return Q.reject(filteredResults)
                }
                return filteredResults; //todo, OR RETURN NOTHING?
            });
    };

    HLSDownloader.prototype.start = function () {

        logger.info("Starting downloader - url: " + this.streamUrl + " destination folder: "+ this.destFolderPath);
        downloadIndefinitely.call(this);

    };

    HLSDownloader.prototype.stop = function () {
        this.shouldRun = false;
    };

    return HLSDownloader;
})();


//var downloader = new FlavorDownloader("http://kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish3/kLive/smil:1_oorxcge2_publish.smil/chunklist_b475136.m3u8", "/Users/AsherS/Downloads/DVR").start();


