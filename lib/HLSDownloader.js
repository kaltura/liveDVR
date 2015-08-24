/**
 * Created by AsherS on 8/20/15.
 */

/**
 * Created by AsherS on 8/11/15.
 */

var Q = require('q');
var _ = require('underscore');
var path = require('path');
var url = require('url');
var httpUtils = require('./utils/HTTPUtils');
var hlsUtils = require('./utils/HLSUtils');
var qfs = require("q-io/fs");
var logger = require('./logger/logger');

var HLSDownloader = (function () {

    function HLSDownloader(m3u8Url, destPath) {
        this.streamUrl = m3u8Url;
        this.destPath = destPath;
        this.shouldRun = true;
    }

    var downloadIndefinitely = function () {

        var that = this;
        downloadPlaylist(url, this.destPath)
            .then(function(targetDuration){
                console.log('results: ' + targetDuration);
            })
            .catch(function(err){
                console.log('error ' + err);
            })
            .done();

        setTimeout(function () {
            if (that.shouldRun) {
                downloadIndefinitely.call(that, that.url, dest);
            }
            else {
                logger.info('downloader has shut down');
            }
        }, 10000);  //todo, configuration?
    };

    //var downloadIndefinitely = function (url, dest, that) {
    //
    //    downloadPlaylist(url, dest)
    //        .then(function(targetDuration){
    //            console.log('results: ' + targetDuration);
    //        })
    //        .catch(function(err){
    //            console.log('error ' + err);
    //        })
    //        .done();
    //
    //    setTimeout(function () {
    //        console.log('-------------------');
    //        if (that.shouldRun) {
    //            downloadIndefinitely(url, dest, that);
    //        }
    //        else {
    //            console.log('downloader is shutting down');
    //        }
    //    }, 10000);  //todo, configuration?
    //};

    var downloadPlaylist = function (m3u8Url, dest) {

        var parsedUrl = url.parse(m3u8Url);
        var baseUrl = parsedUrl.href.substring(0, parsedUrl.href.lastIndexOf('/'));
        var playlistName = path.basename(parsedUrl.pathname);
        var playlistDest = path.join(dest, playlistName);

        var downloadedM3u8 = undefined; //TODO initialize
        var targetDuration = 0;

        return httpUtils.downloadFile(m3u8Url, playlistDest)

            .then(function finishedDownload() {
                return hlsUtils.readM3u8File(playlistDest);
            })
            .then(function(m3u) {
                targetDuration = m3u.get("targetDuration");
                downloadedM3u8 = m3u;
                return qfs.list(dest);
            })
            .then(function(files) {
                //get all files that are in playlist but not in dir
                //TODO - null pointer on playlistItem
                return _.chain(downloadedM3u8.items.PlaylistItem).map(function(i){
                    return i.get('uri');
                }).difference(files).map(function(chunk) {
                    var chunkUrl = url.resolve(baseUrl + '/', chunk);

                    //return the promise of the downloaded chunk
                    return httpUtils.downloadFile(chunkUrl, path.join(dest,chunk));
                }).value();
            })
            .then(function resolveAllDownloads(promises) {
                return Q.allSettled(promises);
            })
            .then(function(results) {
                return _.filter(results, function(p) {
                    return (p.state !== 'fulfilled');
                })
            })
            .then(function checkRejectedPromises(filteredResults) {
                console.log("Filtered results: " + filteredResults.length);
                return [filteredResults.length === 0, targetDuration];
            });
    };

    HLSDownloader.prototype.start = function () {

        logger.info("Starting downloader - url: ",this.streamUrl," destination folder: ", this.destPath);
        downloadIndefinitely.call(this);
    };

    HLSDownloader.prototype.stop = function () {
        this.shouldRun = false;
    };

    return HLSDownloader;
})();


var downloader = new HLSDownloader("http://kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish3/kLive/smil:1_oorxcge2_publish.smil/chunklist_b475136.m3u8", "/Users/AsherS/Downloads/DVR").start();
//var downloader = new HLSDownloader("http://kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish3/kLive/smil:1_oorxcge2_publish.smil/chunklist_b475136.m3u8", "/Users/AsherS/Downloads/DVR").
//
//    downloadLala('http:/kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish3/kLive/smil:1_oorxcge2_publish.smil/media-ue1pc2nd9_b475136_144007687.ts','/Users/AsherS/Downloads/DVR/media-ue1pc2nd9_b475136_144007687.ts');

//.then(function success(text){
//    console.log("success: " + text)
//},
//function error(err){
//    console.log(err);
//});


