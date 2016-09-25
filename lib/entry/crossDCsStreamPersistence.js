/**
 * Created by lilach.maliniak on 18/09/2016.
 */
var persistenceFormat = require('./../../common/PersistenceFormat');
var qio = require('q-io/fs');
//var sessionManager = require('./../SessionManager');
var logger = require('../../common/logger').getLogger("CrossDCsStreamPersistence");
var config = require('./../../common/Configuration');
var ErrorUtils = require('./../utils/error-utils');
var _ = require('underscore');
var Q = require('q');
var glob = require('glob');
var path = require('path');
var backendClient = require('../BackendClientFactory.js').getBackendClient();
var PlaylistGenerator = require('./../playlistGenerator/PlaylistGenerator');
const endListPendingEntriesFileName = "endListPending.json";
const stoppedEntriesPath = config.get('stoppedEntriesPath');

// todo:
// 1) update the sequence of calling BE to verify whether EntryServerNodes > 0
// 2) when no DC serves the stream do:
//   2.1) update stoppedState to ended. ---> using this.playlistGenerator.
//   2.2) save playlist. ---> using this.playlistGenerator
//   2.3) remove from list
// 3) add sequence to restore _entriesToProcess, when LiveController starts!!!

class CrossDCsStreamPersistence {

    constructor() {
 
        this.stoppedEntriesFileName = path.join(stoppedEntriesPath, endListPendingEntriesFileName)
        this.checkStreamIntervalMSec = config.get('streamPersistenceTimerMSec');
        this._entriesToProcess = {};
        this._entriesData = {};
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
                this._entriesData[entryId].timestamp = Date.now;
                this._entriesData[entryId].playlist.persistStopped();
            } else {
                this._entriesData[entryId].playlist.end();
                delete this._entriesData[entryId].playlist;
                delete this._entriesToProcess[entryId];
            }
            deferred.resolve(count);
        })
        .catch((err) => {
            logger.error(`failed to get entry server nodes for stopped entry [${entryId}], error: [${ErrorUtils.error2string(err)}]`);
            deferred.reject(err);
        });

    return deferred.promise;

};

CrossDCsStreamPersistence.prototype.addEntry = function addEntry(playlistGenerator) {
    var that = this;
    let entryId = playlistGenerator.entryId;

    return Q.fcall(function () {
        if (that._entriesToProcess[entryId]) {
            logger.info("[%s] entry is already in stream persistence list, ignoring request", entryId);
            // todo: replace the playlist obj (consult with Guy)
            // return Q.resolve(); required ???
            return true;
        } else {
            // keep the playlistGenerator obj
            this._entriesData[entryId] = { playlist: playlistGenerator, timestamp: new Date() };
            this._entriesToProcess[entryId] = entryId;
            return this.flushEntryList(this._entriesToProcess);
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
            delete that._entriesData[entryId];
            return that.flushEntryList(that._entriesToProcess);
        }
    });
};

// initialized persistence list.
CrossDCsStreamPersistence.prototype.init = function () {

    let deferred = Q.defer();
    let entries;

   qio.exists(stoppedEntriesPath)
        .then((exists) => {
            if (exists) {
                return qio.read(this.stoppedEntriesFileName);
            } else {
                qio.makeDirectory(stoppedEntriesPath)
                    .then(() => {
                        return this.backwardCompatibleInit();
                    });
            }
        })
        .then((stoppedEntries) => {
               if (stoppedEntries) {
                   _.each(JSON.parse(stoppedEntries), (entryId) => {
                       this.addEntry(new PlaylistGenerator({entryId: entryId}, false));
                       this._entriesData[entryId].playlist.restoreStopped();
                   });
               }
            deferred.resolve();
        })
        .catch((err) => {
            logger.error(`error restoring stopped entries list, error: [${ErrorUtils.error2string(err)}]`);
            deferred.reject(err);
        });

    return deferred.promise;
};

CrossDCsStreamPersistence.prototype.flushEntryList = function (stoppedEntriesList) {

    let stoppedEntriesStr = JSON.stringify(_.keys(stoppedEntriesList));

    return qio.write(this.stoppedEntriesFileName, stoppedEntriesStr)
        .then(() => {
          logger.debug(`Stopped entries: ${stoppedEntriesStr}`);
        })
        .catch((err) => {
            logger.error(`failed to save stopped entries persistence data, error: [${ErrorUtils.error2string(err)}]`);
        });
};

CrossDCsStreamPersistence.prototype.processStoppedEntries = function() {
    let now = Date.now;
    _.each(this._entriesToProcess, (entryId) => {
        if (now - this._entriesData[entryId].timestamp >= this.checkStreamIntervalMSec) {
            this.streamPersistenceCheck(entryId);
        }
    });

    return this.flushEntryList(this._entriesToProcess);

};

CrossDCsStreamPersistence.prototype.backwardCompatibleInit = function() {

    let localFolder = config.get('localFolderPath') || '.';
    let endListPendingFilePath = path.join(localFolder, endListPendingEntriesFileName);
    var deferred = Q.defer();

    qio.read(endListPendingFilePath)
        .then((stoppedEntries) => {
            deferred.resolve(stoppedEntries);
        })
        .then(() => {
           // remove file  
        })
        .catch((err) => {
            if (err.code != 'ENOENT') {
                logger.error(`failed reading pending end stream entries from [${endListPendingFilePath}], error: [${ErrorUtils.error2string(err)}]`);
                deferred.reject(err);
            } else {
                deferred.resolve({});
            }
        });

    return deferred.promise;

}

module.exports = CrossDCsStreamPersistence;