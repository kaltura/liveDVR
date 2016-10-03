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
const endListPendingEntriesFileName = "persistenceList.json";
const persistenceListPath = config.get('persistenceListPath');
const kalturaTypes = require('./../kaltura-client-lib/KalturaTypes');
const presentationEndTimeRegex = /("presentationEndTime":\s*)(\d+)/;
const expireTimeRegex = /("expirationTime":\s*)(\d+)/;


function dateTimeStringFormatter(time) {
    return new Date(time).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s(\S+)\s.*/, '$2‌​-$1-$3 $4');
}

function playlistPath(entryId) {
    return path.join(persistenceFormat.getEntryBasePath(entryId), persistenceFormat.getMasterManifestName());
}

class CrossDCsStreamPersistence {

    constructor() {

        this.stoppedEntriesFileName = path.join(persistenceListPath, endListPendingEntriesFileName);
        this._persistenceCheckIntervalMillisec = config.get('persistenceCheckIntervalMillisec');
        this._entriesToProcess = {};
        this._lastProcessedTimestampe = Date.now();
    }

    streamPersistenceCheck(entryId, newEntry = false) {
        logger.debug(`[${entryId}] starting stream persistence check`);

        // todo: consult with Guy whether to filter received nodes objects according to status...
        //entryServerNodeFilter.statusEqual = KalturaLiveStatus.PLAYABLE or KalturaLiveStatus.BROADCASTING;
        return backendClient.getLiveEntryServerNodes(entryId)
            .then((serverObjs) => {
                return _.reduce(serverObjs, (memo, dc) => {
                    return (dc.status === kalturaTypes.KalturaEntryServerNodeStatus.PLAYABLE) || memo;
                }, false);
            })
            .then((isLive) => {
                return this.playlistUpdate(entryId, isLive, newEntry);
            })
            .catch((err) => {
                logger.error(`[${entryId}] persistence check failed. Error: [${ErrorUtils.error2string(err)}]`);
                return Q.reject(err);
            });

    }

    playlistUpdate(entryId, isLive, newEntry) {

        let now = Date.now();
        let presentationEndTime = now + 7200000;
        let path = playlistPath.call(this, entryId);
        let ended = !isLive;

        return qio.read(path)
            .then((content) => {
                let playlist = content;
                if (newEntry) {
                    logger.debug(`[${entryId}] STOPPED STREAMING expiration time set to [${dateTimeStringFormatter.call(this, now)}]`);
                    playlist = playlist.replace(expireTimeRegex, `$1${now}`);
                }
                if (isLive) {
                    logger.debug(`[${entryId}] is LIVE in other DC, presentation end time set to [${dateTimeStringFormatter.call(this, presentationEndTime)}]`);
                    playlist = playlist.replace(presentationEndTimeRegex, `$1${presentationEndTime}`);
                } else {
                    logger.debug(`[${entryId}] ENDED. Presentation end time set to [${dateTimeStringFormatter.call(this, now)}]`);
                    playlist = playlist.replace(presentationEndTimeRegex, `$1 ${now}`);
                }
                return playlist;
            })
            .then((playlist) => {
                return qio.write(path, playlist);
            })
            .then(() => {
                if (ended) {
                    return this.removeEntry(entryId, true);
                } else {
                    return Q.resolve(false);
                }
            })
            .catch((err) => {
                logger.error(`[${entryId}] persistence check failed. Error: [${ErrorUtils.error2string(err)}]`);
                return Q.reject(err);
            });

    }

    addEntry(entryId) {
        logger.debug(`[${entryId}] is being added to persistence list`);

        if (this._entriesToProcess[entryId]) {
            logger.debug(`[${entryId}] is already in stream persistence list, ignoring request`);
            return Q.resolve();
        } else {
            this._entriesToProcess[entryId] = entryId;
            logger.info(`[${entryId}] entry added to persistence list`);

            return this.streamPersistenceCheck(entryId, true)
                .then((ended) => {
                    logger.info(`[${entryId}] successfully added entry to stream persistence list (ended=${ended}), [playlistPath=${playlistPath.call(this, entryId)}]`);
                })
                .then(() => {
                    this.flushEntryList();
                })
                .catch((err) => {
                    logger.info(`[${entryId}] persistence check failed. Error: [${ErrorUtils.error2string(err)}]`);
                    return Q.resolve(false);
                });
        }

    }

    removeEntry(entryId) {
        logger.debug(`[${entryId}] removing entry from persistence list`);

        if (entryId in this._entriesToProcess) {
            delete this._entriesToProcess[entryId];
            this.flushEntryList();
            logger.info(`[${entryId}] entry was removed from persistence list`);
        }
    }

    // initialized persistence list (stopped entries).
    init() {
        logger.debug(`Restoring persistence list from ${this.stoppedEntriesFileName}`);

        return qio.makeDirectory(persistenceListPath)
            .catch((err) => {
                if (!(err.code === 'EEXIST')) {
                    logger.info(`Error restoring stopped entries from ${this.stoppedEntriesFileName}, [${ErrorUtils.error2string(err)}]`);
                }
                return err.exists;
            })
            .then((exists) => {
                if (exists) {
                    return qio.read(this.stoppedEntriesFileName);
                } else {
                    return '{}';
                }
            })
            .then((stoppedEntries) => {
                let pAll = _.map(JSON.parse(stoppedEntries), (entryId) => {
                    logger.debug(`[${entryId}] STOPPED ENTRY is being restored from ${persistenceListPath}`);
                    this.addEntry(entryId);
                });
                return Q.allSettled(pAll);
            })
            .catch((err) => {
                if (err.code != 'ENOENT') {
                    logger.info(`Error restoring stopped entries from ${persistenceListPath}, [${ErrorUtils.error2string(err)}]`);
                } else {
                    logger.info(`${this.stoppedEntriesFileName} not found, persistence list is empty.`);
                }
            });
    }

    flushEntryList() {
        let persistenceListStr = JSON.stringify(this._entriesToProcess);
        logger.debug(`Updating persistence list on disk, content: [${persistenceListStr}], save in: [${this.stoppedEntriesFileName}]`);

        return qio.write(this.stoppedEntriesFileName, persistenceListStr)
            .catch((err) => {
                if (err.code === 'ENOENT') {
                    return this.init();
                } else {
                    logger.error(`Failed to save stopped entries persistence data. Error: [${ErrorUtils.error2string(err)}]`);
                }
                return Q.resolve();
            });

    }

    processStoppedEntries() {

        let startTime = Date.now();

        if (startTime - this._lastProcessedTimestampe >= this._persistenceCheckIntervalMillisec) {
            logger.debug(`Starting to process persistence list`);

            this._lastProcessedTimestampe = startTime;

            let pAll = _.map(this._entriesToProcess, (entryId) => {
                return this.streamPersistenceCheck(entryId);
            });

            return Q.allSettled(pAll);

        } else {
            return Q.resolve();
        }
    }
}


module.exports = CrossDCsStreamPersistence;