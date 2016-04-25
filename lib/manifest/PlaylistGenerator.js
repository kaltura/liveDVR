/**
 * Created by AsherS on 8/24/15.
 */

var _ = require('underscore');
var persistenceFormat = require('./../../common/PersistenceFormat');
var config = require('./../../common/Configuration');
var fsUtils = require('./../utils/fs-utils');
var path = require('path');
var qio = require('q-io/fs');
var m3u8Parser = require('./promise-m3u8');
var loggerModule = require('../../common/logger');

function PlaylistGenerator(entryObject, isNewSession) {
    this.entryId = entryObject.entryId;
    this.isNewSession = isNewSession;
    this.streamInfo = entryObject.getStreamInfo();
    this.flavorsObjArray = null;
    this.lastPlaylistUpdate = null;
    this.logger = loggerModule.getLogger("PlaylistGenerator", "[" + this.entryId + "] ");;
}

function checkTranscodingProfileChange() {
    var that = this;
    var entryPath = persistenceFormat.getEntryFullPath(that.entryId);
    var reg = new RegExp("(?:" + that.entryId + "\\/)([0-9]*)\\b", "i");
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
            var playingFlavorsString = _.map(that.flavorsObjArray, function(f) {
                return f.name;
            }).sort().join();
            if (result.sort().join() !== playingFlavorsString) {
                that.logger.info("Transcoding profile changed, cleaning entry folder");
                return fsUtils.cleanFolder(entryPath);
            }
        })
        .catch(function(error) {
            that.logger.error("Error cleaning folder because of transcoding profile change: %s", error);
        });
}

function savePlaylist() {
    var that = this;
    var playlist = new m3u8Parser.M3U.create();
    playlist.set("version", 3);

    _.each(that.flavorsObjArray, function(flavor) {
        playlist.addStreamItem({
            bandwidth: flavor.bandwidth,
            resolution: flavor.resolution ? flavor.resolution.join("x") : "",
            uri: flavor.name + '/chunklist.m3u8'
        });
    });
    // Get the destination to save the manifest
    var destPath = path.join(config.get('rootFolderPath'), that.entryId, persistenceFormat.getMasterManifestName());
    var playerMasterManifest = playlist.toString();
    that.logger.info("Entry received master manifest info: %j", that.flavorsObjArray);
    return fsUtils.writeFileAtomically(destPath, playerMasterManifest)
        .then(function() {
            that.lastPlaylistUpdate = new Date();
            that.logger.debug("Playlist written to disk");
            return that.flavorsObjArray;
        });
}

PlaylistGenerator.prototype.updatePlaylist = function() {
    var that = this;
    var currTime = new Date();
    // Update the entry's playlist every minute
    if ((currTime - that.lastPlaylistUpdate) > config.get('playlistUpdateInterval')) {
        that.logger.info("Updating playlist");
        return savePlaylist.call(this)
            .catch(function(error) {
                that.logger.error("Unable to update playlist: %s", error);
            });
    }
};

PlaylistGenerator.prototype.createPlaylist = function() {
    var that = this;
    that.logger.info("Retrieving master manifest for entry");
    return that.streamInfo.getAllFlavors()
        .then(function(flavors) {
            that.flavorsObjArray = flavors;
            return (!that.isNewSession) ? checkTranscodingProfileChange.call(that) : flavors;
        })
        .then(function() {
            return savePlaylist.call(that);
        });
};

module.exports = PlaylistGenerator;