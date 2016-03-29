/**
 * Created by AsherS on 8/24/15.
 */

var _ = require('underscore');
var logger = require('./logger/logger')(module);
var flavorDownloader = require('./FlavorDownloader');
var persistenceFormat = require('./../common/PersistenceFormat');
var config = require('./../common/Configuration');
var ErrorUtils = require('./utils/error-utils');
var fsUtils = require('./utils/fs-utils');
var path = require('path');
var Q = require('q');
var qio = require('q-io/fs');
var util = require('util');
var events = require("events");
var m3u8Parser = require('./manifest/promise-m3u8');

var EntryDownloader = (function () {

    function EntryDownloader(entryObject, isNewSession) {
        events.EventEmitter.call(this);
        this.entryId = entryObject.entryId;
        this.manifestTimeWindow = entryObject.dvrWindow;
        this.manifestMaxChunkCount = entryObject.maxChunkCount;
        this.flavorsDownloaders = [];
        this.isNewSession = isNewSession;
        this.streamInfo = entryObject.getStreamInfo();
        this.flavorsObjArray = null;
        this.lastPlaylistUpdate = null;
    }
    util.inherits(EntryDownloader, events.EventEmitter);

    var onFlavorDownloaderStopped = function(flavor){
        var that = this;
        logger.info("Flavor " + flavor + " stopped - checking if any flavor is still active for entry " + that.entryId);
        if (_.every(that.flavorsDownloaders, function(f){ return f.runStatus === 'stopped'; }))
        {
            logger.info("No remaining active flavor downloaders for entry " + that.entryId + " - shutting down entry downloader");
            that.emit('stopped', that.entryId);
        }
    };

    var checkTranscodingProfileChange = function() {
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
                    logger.info("Transcoding profile changed, cleaning entry " + that.entryId + "folder");
                    return fsUtils.cleanFolder(entryPath);
                }
            })
            .catch(function(error) {
                logger.error("Error cleaning folder because of transcoding profile change: " + error);
            });
    };

    var savePlaylist = function() {
        var that = this;
        var playlist = new m3u8Parser.M3U.create();
        playlist.set("version",3);

        _.each(that.flavorsObjArray, function(flavor) {
            playlist.addStreamItem({
                bandwidth: flavor.bandwidth,
                resolution: flavor.resolution.join("x"),
                uri: flavor.name+'/chunklist.m3u8'
            });
        });
        // Get the destination to save the manifest
        var destPath = path.join(config.get('rootFolderPath'), that.entryId, persistenceFormat.getMasterManifestName());
        var playerMasterManifest = playlist.toString();
        logger.info("Entry: %s received master manifest: %j", that.entryId, that.flavorsObjArray);
        return fsUtils.writeFileAtomically(destPath, playerMasterManifest)
            .then(function() {
                that.lastPlaylistUpdate = new Date();
            });
    };

    EntryDownloader.prototype.updatePlaylist = function() {
        var currTime = new Date();
        // Update the entry's playlist every minute
        if ((currTime - this.lastPlaylistUpdate) > config.get('playlistUpdateInterval')) {
            logger.info("Entry [%s] - Updating playlist", this.entryId);
            return savePlaylist.call(this)
                .catch(function(error) {
                    logger.error("Unable to update playlist: %s", error);
                });
        }
    };

    EntryDownloader.prototype.start = function () {
        var that = this;
        logger.info("Entry start requested for entry " + that.entryId);
        logger.info("Starting entry downloader for entryId: " + that.entryId);
        return that.streamInfo.getAllFlavors()
            .then(function(flavors) {
                that.flavorsObjArray = flavors;
                return (!that.isNewSession) ? checkTranscodingProfileChange.call(that) : flavors;
            })
            .then(function() {
                return savePlaylist.call(that);
            })
            .then(function() {
                that.flavorsDownloaders = _.chain(that.flavorsObjArray)
                    .uniq(function(flavor) {
                        // Iterate through the flavors array and erase duplicate flavors if they exists
                        return flavor.name;
                    })
                    .map(function (flavor) {
                        var playlistName = persistenceFormat.getManifestName();
                        var destPath = persistenceFormat.getFlavorFullPath(that.entryId, flavor.name);
                        logger.info("EntryId: " + that.entryId + " - creating flavor downloader: " + flavor.name);
                        return new flavorDownloader(flavor.liveURL, destPath, that.entryId, flavor.name, playlistName, that.manifestTimeWindow, that.manifestMaxChunkCount);
                    }).value();

                //start the download
                var promises = _.map(that.flavorsDownloaders, function (f) {
                    logger.info("EntryId: " + that.entryId + " - starting flavor downloader: " + f.flavor);
                    f.on('stopped', onFlavorDownloaderStopped.bind(that));
                    return f.start();
                });

                return Q.allSettled(promises);

            })
            .then(function(results) {
                var errs = ErrorUtils.aggregateErrors(results);

                if (errs.numErrors === results.length) {
                    // Fail if no flavor downloader could be started
                    throw new Error("Failed to start entry downloader for entry: " + that.entryId + ". All flavor downloaders failed");
                }

                if (errs.numErrors > 0) {
                    // Report an error (but proceed) if only some flavor downloaders could not be started
                    logger.error('Failed to start flavor downloaders for some of the flavors:\n',errs.err);
                }
            });
    };

    EntryDownloader.prototype.stop = function () {
        var that = this;
        if (that.stopPromise)
        {
            logger.info("Entry stop already requested for entry " + this.entryId + " ignoring request");
            return that.stopPromise;
        }

        logger.info('stopping entry downloader for entry id: ' + this.entryId);
        var stopPromises =_.map(this.flavorsDownloaders, function (downloader) {
            return downloader.stop();
        });

        that.stopPromise = Q.all(stopPromises).then(function(){
            logger.info('successfully stopped entry downloader for entry id: ' + that.entryId);
        }, function(err){
            logger.error('failed stopping flavor downloader for entry id: ' + that.entryId + ' and flavor ' + downloader.flavor + "\n" + err + "\n" + err.stack);
            throw err;
        });

        return that.stopPromise;
    };

    return EntryDownloader;
})();

module.exports = EntryDownloader;