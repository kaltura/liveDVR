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
var path = require('path');
var backendClient = require('../BackendClientFactory.js').getBackendClient();

var EndlistAppender = function EndListAppender(){

    var endListPendingEntriesFileName = "endListPending.json";
    var localFolder = config.get('localFolderPath') || '.';
    var endListPendingFilePath = path.join(localFolder, endListPendingEntriesFileName);

    var appendEndlistIfMissing = function appendEndlistIfMissing(entryId) {
        var that = this;

        return backendClient.getLiveEntryServerNodes(entryId)
            .then( function(liveEntryServerNodes) {
                if (liveEntryServerNodes.count > 0) {
                    var err = String.format("[%s], the live stream has at least one providing data center", entryId);
                    return Q.reject(err);
                }
            })
            .catch( function () {
                var err = String.format("[%s] failed to retrieve server nodes", entryId);
                return Q.reject(err);
            })
            .then ( function () {
                    var entryFolder = persistenceFormat.getEntryFullPath(entryId);
                    var getManifestFiles = Q.denodeify(glob);
                    return getManifestFiles("**/*.m3u8", {cwd: entryFolder, realpath: true});
            })
            .then ( function (flavorManifestPaths) {
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
            })
            .catch( function (err) {
                logger.error("[%s] error adding EXT-X-ENDLIST, %s", entryId, ErrorUtils.error2string(err));
                Q.reject(err);
            });

    };

    var setTimerToCheckIfStreamEnded  = function setTimerToCheckIfStreamEnded(entryId) {
        var that = this;

        var timeoutObj = setTimeout( function () {
            logger.debug("[%s] Timer ended. Checking if should add EXT-X-ENDLIST", entryId);
            appendEndlistIfMissing.call(that, entryId)
                .then(function() {
                    return removeEntry.call(that, entryId);
                }).catch(function(err) {
                    logger.error("[%s] Error adding EXT-X-ENDLIST: %s", entryId, ErrorUtils.error2string(err));
                    setTimerToCheckIfStreamEnded.call(that, entryId);
                });
        }, sessionManager.getSessionDuration());

        that._entriesToProcess[entryId] = timeoutObj;
        return flushEntryList(that._entriesToProcess);
    }

    var addEntry = function addEntry(entryId) {
        var that = this;
        return Q.fcall(function(){
            if (that._entriesToProcess[entryId]) {
                logger.info("[%s] Timer is already pending, ignoring request", entryId);
                return Q.resolve();
            }
            return setTimerToCheckIfStreamEnded.call(that, entryId);
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

module.exports = EndlistAppender;