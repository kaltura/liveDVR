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
var downloadUtils = require('./DownloadUtils');
var fileUtils = require('./FileUtils');
var hlsUtils = require('./HLSUtils');

module.exports = (function () {

    function HLSDownloader(m3u8Url, destPath) {
        this.streamUrl = m3u8Url;
        this.destPath = destPath;
    }

    var downloadIndefinitely = function (url, dest) {
        downloadPlaylist(url, dest)
            .then(function(targetDuration){
                console.log('results: ' + targetDuration);
            })
            .catch(function(err){
                console.log('error ' + err);
            })
            .done();

        setTimeout(function () {
            console.log('-------------------');
            downloadIndefinitely(url, dest);
        }, 10000);  //todo, configuration?
    };

    var downloadPlaylist = function (m3u8Url, dest) {

        var parsedUrl = url.parse(m3u8Url);
        var baseUrl = parsedUrl.href.substring(0, parsedUrl.href.lastIndexOf('/'));
        var playlistName = path.basename(parsedUrl.pathname);
        var playlistDest = path.join(dest, playlistName);

        var downloadedM3u8; //TODO initialize
        var targetDuration = 0;

        return downloadUtils.downloadFile(m3u8Url, playlistDest)

            .then(function finishedDownload() {
                return hlsUtils.readM3u8File(playlistDest);
            })
            .then(function(m3u) {
                targetDuration = m3u.get("targetDuration");
                downloadedM3u8 = m3u;
                return fileUtils.listDirFiles(dest);
            })
            .then(function(files) {
                //get all files that are in playlist but not in dir
                //TODO - null pointer on playlistItem
                return _.chain(downloadedM3u8.items.PlaylistItem).map(function(i){
                    return i.get('uri');
                }).difference(files).map(function(chunk) {
                    var chunkUrl = url.resolve(baseUrl + '/', chunk);

                    //return the promise of the downloaded chunk
                    return downloadUtils.downloadFile(chunkUrl, path.join(dest,chunk));
                }).value();
            })
            .then(function resolveAllDownloads(promises) {
                return Q.allSettled(promises);
            })
            .then(function(results) {
                return _.filter(results, function(p) {
                    return (p.state !== 'fulfilled');
                });
            })
            .then(function checkRejectedPromises(filteredResults) {
                console.log("Filtered results: " + filteredResults.length);
                return [filteredResults.length === 0, targetDuration];
            });
    };

    HLSDownloader.prototype.start = function () {

        console.log("URL: " + this.streamUrl);
        console.log("DEST: " + this.destPath);
        downloadIndefinitely(this.streamUrl, this.destPath);
    };

    //HLSDownloader.prototype.stop = function () {
    //
    //};

    return HLSDownloader;
})();


//var downloader = new HLSDownloader("http://kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish3/kLive/smil:1_oorxcge2_publish.smil/chunklist_b475136.m3u8", "/Users/AsherS/Downloads/DVR").start();
//var downloader = new HLSDownloader("http://kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish3/kLive/smil:1_oorxcge2_publish.smil/chunklist_b475136.m3u8", "/Users/AsherS/Downloads/DVR").
//
//    downloadLala('http:/kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish3/kLive/smil:1_oorxcge2_publish.smil/media-ue1pc2nd9_b475136_144007687.ts','/Users/AsherS/Downloads/DVR/media-ue1pc2nd9_b475136_144007687.ts');

//.then(function success(text){
//    console.log("success: " + text)
//},
//function error(err){
//    console.log(err);
//});


