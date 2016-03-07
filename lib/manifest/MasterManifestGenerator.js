/**
 * Created by AsherS on 8/24/15.
 */

var _ = require('underscore');
var logger = require('./../logger/logger')(module);
var persistenceFormat = require('./../../common/PersistenceFormat');
var config = require('./../../common/Configuration');
var fsUtils = require('./../utils/fs-utils');
var path = require('path');
var Q = require('q');
var qio = require('q-io/fs');
var m3u8Parser = require('./promise-m3u8');

var EntryDownloader = (function() {

    function EntryDownloader(entryObject, isNewSession) {
        this.entryId = entryObject.entryId;
        this.isNewSession = isNewSession;
        this.streamInfo = entryObject.getStreamInfo();
    }

    function checkTranscodingProfileChange(entryId, flavorsObjArray) {
        var entryPath = persistenceFormat.getEntryFullPath(entryId);
        var reg = new RegExp("(?:" + entryId + "\\/)([0-9]*)\\b", "i");
        return qio.listDirectoryTree(entryPath)
            .then(function(result) {
                return _.chain(result)
                    .filter(function(d) {
                        return d.match(reg) !== null;
                    })
                    .map(function(d) {
                        return d.match(reg)[1];
                    })
                    .uniq(function(f) {
                        return f;
                    })
                    .value();
            })
            .then(function(result) {
                var playingFlavorsString = _.map(flavorsObjArray, function(f) {
                    return f.name;
                }).sort().join();
                if (result.sort().join() !== playingFlavorsString) {
                    logger.info("Transcoding profile changed, cleaning entry " + entryId + "folder");
                    return fsUtils.cleanFolder(entryPath);
                }
            })
            .then(function() {
                return flavorsObjArray;
            })
            .catch(function(error) {
                logger.error("Error cleaning folder because of transcoding profile change: " + error);
            });
    };

    function savePlaylist(flavorsObjArray, entryId) {
        var playlist = new m3u8Parser.M3U.create();
        playlist.set("version", 3);

        _.each(flavorsObjArray, function(flavor) {
            playlist.addStreamItem({
                bandwidth: flavor.bandwidth,
                resolution: flavor.resolution.join("x"),
                uri: flavor.name+'/chunklist.m3u8'
            });
        });
        // Get the destination to save the manifest
        var destPath = path.join(config.get('rootFolderPath'), entryId, persistenceFormat.getMasterManifestName());
        var playerMasterManifest = playlist.toString();
        logger.info("Entry: " + entryId + "received master manifest:\n" + playerMasterManifest);
        return fsUtils.writeFileAtomically(destPath, playerMasterManifest)
            .then(function() {
                return flavorsObjArray;
            });
    };

    EntryDownloader.prototype.createManifest = function() {
        var that = this;
        logger.info("Starting entry downloader for entryId: " + that.entryId + "\n");
        return that.streamInfo.getAllFlavors()
            .then(function(flavors) {
                return (!that.isNewSession) ? checkTranscodingProfileChange(that.entryId, flavors) : flavors;
            })
            .then(function(flavors) {
                return savePlaylist(flavors, that.entryId);
            })
    };

    return EntryDownloader;
})();

module.exports = EntryDownloader;