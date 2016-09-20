/**
 * Created by lilach.maliniak on 18/09/2016.
 * Contains major parts of EndListAppender.js,
 * Created by elad.benedict on 9/8/2015.
 */

var persistenceFormat = require('./../../common/PersistenceFormat');
var qio = require('q-io/fs');
//var sessionManager = require('./../SessionManager');
var m3u8Parser = require('./promise-m3u8');
var logger = require('../../common/logger').getLogger("CrossDCsStreamPersistence");
var config = require('./../../common/Configuration');
var ErrorUtils = require('./../utils/error-utils');
var _ = require('underscore');
var Q = require('q');
var glob = require('glob');
var path = require('path');
var backendClient = require('../BackendClientFactory.js').getBackendClient();
var PlaylistGenerator = require('./../playlistGenerator/PlaylistGenerator').PlaylistGenerator;
const _streamStoppedState = require('./../playlistGenerator/PlaylistGenerator').StreamStoppedState;

// todo:
// 1) update the sequence of calling BE to verify whether EntryServerNodes > 0
// 2) when no DC serves the stream do:
//   2.1) update stoppedState to ended. ---> using this.playlistGenerator.
//   2.2) save playlist. ---> using this.playlistGenerator
//   2.3) remove from list
// 3) add sequence to restore _entriesToProcess, when LiveController starts!!!

class CrossDCsStreamPersistence {

    constructor() {
        let endListPendingEntriesFileName = "endListPending.json";
        let persistentEntriesMinimalDataFileName = "persistentEntries.json"
        let localFolder = config.get('localFolderPath') || '.';
        this.endListPendingFilePath = path.join(localFolder, endListPendingEntriesFileName);
        this.persistentEntriesFullPath = path.join(localFolder, persistentEntriesMinimalDataFileName);
        this._entriesToProcess = {};
        this.checkStreamIntervalMSec = config.get('streamPersistenceTimerMSec');
        this._playlistsToPersist = {};
    }
}


//---------------------------------------------------------------
// Todo: Lilach: PLAT-5023
// 1) check if any DC provides the entryId:
//  1.1) in case no DC provides the entry: update the time tag +
//  1.2) otherwise,
//      1.2.1) start timer to check if entry is provided
//      1.2.2) rename playlist.json
//--------------------------------------------------------------
CrossDCsStreamPersistence.prototype.streamPersistenceCheck = function (entryId) {

    var deferred = Q.defer();

    backendClient.getLiveEntryServerNodes(entryId)
        .then((liveEntryServerNodes) => {
            if (liveEntryServerNodes.count > 0) {
                deferred.resolve(count);
            }
            return liveEntryServerNodes.count;
        })
        .then((count) => {
            // set playlist ended property and save it
            this._playlistsToPersist.updateStreamStoppedState(playlistGenerator.StreamStoppedState.ended);
            deferred.resolve(count);
        })
        .catch((err) => {
            deferred.reject(err);
        });

    return deferred.promise;

};

CrossDCsStreamPersistence.prototype.setStreamPersistenceTimer = function (entryId) {

    try {
        this._entriesToProcess[entryId] = setTimeout(() => {

            logger.debug(`checking if entry [${entryId}] stream ended`);

            this.streamPersistenceCheck(entryId)
                .then((providingDCs) => {
                    if (providingDCs === 0) {
                        return this.removeEntry(entryId);
                    } else {
                        logger.debug(`the entry [${entryId}] has ${providingDCs} providing data center(s)`);
                    }
                })
                .catch((err) => {
                    logger.error(`failed to check stream [${entryId}] persistence, error: [${ErrorUtils.error2string(err)}]`);
                    this.setStreamPersistenceTimer(entryId);
                });
        }, this.checkStreamIntervalMSec);
    } catch (ex) {
        logger.error(`error starting persistence timer for entry [${entryId}], error: [${ErrorUtils.error2string(err)}]`);
        return Q.reject(ex);
    }

    // todo: do not return result based on flushEntryList
    return this.flushEntryList(this._entriesToProcess);
}

CrossDCsStreamPersistence.prototype.addEntry = function addEntry(playlistGenerator) {
    var that = this;
    let entryId = playlistGenerator.entryId;

    return Q.fcall(function () {
        if (that._entriesToProcess[entryId]) {
            logger.info("[%s] timer is already pending, ignoring request", entryId);
            // todo: replace the playlist obj (consult with Guy)
            // return Q.resolve(); required ???
            return true;
        } else {
            // keep the playlistGenerator obj
            that._playlistsToPersist[entryId] = playlistGenerator;

            this.setStreamPersistenceTimer(entryId)
                .then(() => {
                    logger.debug(`successfully added persistence timer for entry [${entryId}]`);
                    return true;
                })
                .catch((err) => {
                    logger.error(`start persistence timer for entry [${entryId}], threw error: [${ErrorUtils.error2string(err)}]`);
                    return false;
                });
        }

    });
};

CrossDCsStreamPersistence.prototype.removeEntry = function (entryId) {
    var that = this;
    return Q.fcall(function () {
        var timeoutObj = that._entriesToProcess[entryId];
        if (timeoutObj) {
            logger.debug(`aborting entry [${entryId}] persist timer`);
            clearTimeout(timeoutObj);
            delete that._entriesToProcess[entryId];
            delete that._playlistsToPersist[entryId];
            return that.flushEntryList(that._entriesToProcess);
        }
    });
};

// initialized persistence list.
CrossDCsStreamPersistence.prototype.init = function () {

    let deferred = Q.defer();
    let entries;

    Q.fcall(qio.exists(this.endListPendingFilePath))
        .then((exists) => {
            if (exists) {
                return qio.read(this.endListPendingFilePath);
            } else {
                deferred.resolve();
            }
        })
        .then((entryList) => {
            entries = entryList;
            return qio.read(this.persistentEntriesFullPath);
        })
        .then((persistentList) => {
                _.each(JSON.parse(entries), function (e) {
                    let playlistGeneratorMinimal = persistentList[e];
                    playlistGeneratorMinimal["entryId"] = e;
                    this.addEntry(e, new PlaylistGenerator( new PlaylistGenerator(playlistGeneratorMinimal, false)));
                });
        })
        .catch((err) => {
            logger.error(`error restoring stopped entries list, error: [${ErrorUtils.error2string(err)}]`);
            deferred.reject(err);
        });

    return deferred.promise;
};

CrossDCsStreamPersistence.prototype.flushEntryList = function (list) {

    return Q.fcall(qio.write(this.endListPendingFilePath, JSON.stringify(_.keys(list))))
        .then(() => {
            return _.reduce(this._playlistsToPersist, function (memo, playlist) {
                return memo[playlist.entryId] = {playListLimits: playlist.playListLimits};
            }, {});
        })
        .then((minimalPlaylistData) => {
            // save minimal entries data required for recovery (after LiveController restart)
            let playlistsDataStr = JSON.stringify(minimalPlaylistData);
            logger.debug(`stopped entries persistence data: [${playlistsDataStr}]`);
            return qio.write(this.persistentEntriesFullPath, playlistsDataStr);
        })
        .catch((err) => {
            logger.error(`failed to save stopped entries persistence data, error: [${ErrorUtils.error2string(err)}]`);
        });

};


// todo: see init decision
CrossDCsStreamPersistence.prototype.printCrossDCsStreamPersistenceList = function () {
    logger.debug("Entries to process: %j", _.keys(this._entriesToProcess));
};


module.exports = CrossDCsStreamPersistence;