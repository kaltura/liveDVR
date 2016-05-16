/**
 * Created by elad.benedict on 9/8/2015.
 */

var persistenceFormat = require('./../../common/PersistenceFormat');
var qio = require('q-io/fs');
var sessionManager = require('./../SessionManager');
var m3u8Parser = require('./promise-m3u8');
var logger = require('../../common/logger').getLogger("EndListAppender"); 
var config = require('./../../common/Configuration');
var ErrorUtils = require('./../utils/error-utils');
var _ = require('underscore');
var Q = require('q');
var glob = require('glob');
var util = require('util');
var events = require('events');
var path = require('path');

var EndlistAppender = function EndListAppender(){

    var endListPendingEntriesFileName = "endListPending.json";
    var localFolder = config.get('localFolderPath') || '.';
    var endListPendingFilePath = path.join(localFolder, endListPendingEntriesFileName);

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
                        logger.debug("[%s] Adding ENDLIST to: %s", entryId, flavorManifestPath);
                        if (manifest.get('playlistType') === 'VOD') {
                            return;
                        }
                        manifest.set('playlistType', 'VOD');
                        return qio.write(flavorManifestPath, manifest.toString());
                    })
                    .catch(function (err) {
                        logger.error("[%s] Adding EXT-X-ENDLIST at location: %s failed; Error: %s", entryId, flavorManifestPath, ErrorUtils.error2string(err));
                    });
            });
            return Q.all(promises);
        }).then(function () {
            that.emit("entryProcessingCompleted", { entryId : entryId});
        }).catch(function (err) {
            logger.error("Error in appendEndlistIfMissing", ErrorUtils.error2string(err));
        });
    };

    var addEntry = function addEntry(entryId) {
        var that = this;
        return Q.fcall(function(){
            if (that._entriesToProcess[entryId]) {
                logger.info("[%s] Timer is already pending, ignoring request", entryId);
                return;
            }
            var timeoutObj = setTimeout(function () {
                logger.debug("[%s] Timer ended. Starting endlistAppender", entryId);
                appendEndlistIfMissing.call(that, entryId)
                    .then(function(){
                        return that.removeEntry(entryId);
                    }).catch(function(err){
                        logger.error("[%s] Error adding EXT-X-ENDLIST: %s", entryId, ErrorUtils.error2string(err));
                    });
                }, sessionManager.getSessionDuration());
            that._entriesToProcess[entryId] = timeoutObj;
            return flushEntryList(that._entriesToProcess);
        });
    };

    var removeEntry = function removeEntry(entryId) {
        var that = this;
        return Q.fcall(function(){
            var timeoutObj = that._entriesToProcess[entryId];
            if (timeoutObj) {
                logger.debug("[%s] Aborting entry timer for END-LIST", entryId);
                clearTimeout(timeoutObj);
                delete that._entriesToProcess[entryId];
                return flushEntryList(that._entriesToProcess);
            }
        });
    };

    var init = function(){
        var that = this;
        return qio.exists(endListPendingFilePath).then(function(exists){
           if (exists)
           {
               return qio.read(endListPendingFilePath).then(function(entryList){
                   _.each(JSON.parse(entryList), function(e){
                       that.addEntry(e);
                   });
               });
           }
        });
    };

    var flushEntryList = function(list){
        return qio.write(endListPendingFilePath, JSON.stringify(_.keys(list)));
    };

    var printEndlistAppenderList = function() {
        logger.debug("Entries to process: %j", _.keys(this._entriesToProcess));
    };

    this._entriesToProcess = {};
    this.init = init;
    this.addEntry = addEntry;
    this.removeEntry = removeEntry;
    this.printEndlistAppenderList = printEndlistAppenderList;

};

util.inherits(EndlistAppender, events.EventEmitter);

module.exports = EndlistAppender;