/**
 * Created by elad.benedict on 9/8/2015.
 */

var persistenceFormat = require('./PersistenceFormat');
var qio = require('q-io/fs');
var sessionManager = require('./SessionManager');
var m3u8Parser = require('./promise-m3u8');
var logger = require('./logger/logger');
var _ = require('underscore');
var Q = require('q');
var glob = require('glob');
var util = require('util');
var events = require('events');

var EndlistAppender = function EndListAppender(){

    var init = function init() {
        var that = this;
        return persistenceFormat.getAllStoredEntries().then(function (allEntries) {
            _.each(allEntries, function (entryId) {
                // Verify all previous entries were added the end list tag, where appropriate
                that.addEntry(entryId);
            });
        });
    };

    var appendEndlistIfMissing = function appendEndlistIfMissing(entryId) {
        var that = this;
        return Q.fcall(function () {
            var entryFolder = persistenceFormat.getEntryFullPath(entryId);
            var getManifestFiles = Q.denodeify(glob);
            return getManifestFiles("**/*.m3u8", {cwd: entryFolder, realpath: true});
        }).then(function (flavorManifestPaths) {
            var promises = _.map(flavorManifestPaths, function (flavorManifestPath) {
                return m3u8Parser.parseM3U8(flavorManifestPath)
                    .then(function (manifest) {
                        if (manifest.get('playlistType') === 'VOD') {
                            return;
                        }
                        manifest.set('playlistType', 'VOD');
                        return qio.write(flavorManifestPath, manifest.toString());
                    })
                    .catch(function (err) {
                        logger.error("Error adding EXT-X-ENDLIST to flavor manifest located at " + flavorManifestPath, err);
                    });
            });
            return Q.all(promises);
        }).then(function () {
            that.emit("entryProcessingCompleted", { entryId : entryId});
        }).catch(function (err) {
            logger.error("Error in appendEndlistIfMissing", err);
        });
    };

    var addEntry = function addEntry(entryId) {
        var that = this;
        if (that._entriesToProcess[entryId]) {
            logger.info("Already has a timer pending for entry " + entryId + ". ignoring request");
            return;
        }
        var timeoutObj = setTimeout(function () {
            appendEndlistIfMissing.call(that, entryId);
        }, sessionManager.getSessionDuration());
        that._entriesToProcess[entryId] = timeoutObj;
    };

    var removeEntry = function removeEntry(entryId) {
        var that = this;
        var timeoutObj = that._entriesToProcess[entryId];
        if (timeoutObj) {
            clearTimeout(timeoutObj);
            delete that._entriesToProcess[entryId];
        }
    };

    this._entriesToProcess = {};
    this.init = init;
    this.addEntry = addEntry;
    this.removeEntry = removeEntry;

};

util.inherits(EndlistAppender, events.EventEmitter);

module.exports = EndlistAppender;