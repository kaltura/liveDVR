/**
 * Created by AsherS on 8/24/15.
 */

var masterM3u8Generator = require('MasterManifestGenerator');

var EntryDownloader = (function () {

    function EntryDownloader(entryId) {
        this.entryId = entryId;
    }


    EntryDownloader.prototype.start = function () {

        //get master m3u8


        //TODO, elad's code

    };

    EntryDownloader.prototype.stop = function () {

    };

    return EntryDownloader;
})();


//var downloader = new FlavorDownloader("http://kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish3/kLive/smil:1_oorxcge2_publish.smil/chunklist_b475136.m3u8", "/Users/AsherS/Downloads/DVR").start();



