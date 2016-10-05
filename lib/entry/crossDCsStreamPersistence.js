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

// todo: add sorted list according to time left for removal of presentationEndTime and expirationTime properties
// Add processEndedEntries or use processStoppedEntries to handle the removal of above for DVR support.
// Should the future time set to presentationEndTime be derived from real liveWindowDuration value?
// todo: remove the presentationEndTime and expirationTime from playlist.json in PlaylistGenerat

function playlistPath(entryId) {
    return path.join(persistenceFormat.getEntryBasePath(entryId), persistenceFormat.getMasterManifestName());
}

class CrossDCsStreamPersistence {

    constructor() {

        this.stoppedEntriesFileName = path.join(persistenceListPath, endListPendingEntriesFileName);
        this._persistenceCheckIntervalMillisec = 1000 * config.get('persistenceCheckIntervalSec');
        this._entriesToProcess = {};
        this._lastProcessedTimestampe = Date.now();
    }

    streamPersistenceCheck(entryId) {
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
                return this.playlistUpdate(entryId, isLive);
            })
            .catch((err) => {
                logger.error(`[${entryId}] persistence check failed. Error: [${ErrorUtils.error2string(err)}]`);
                return Q.reject(err);
            });

    }

    playlistUpdate(entryId, isLive) {
        
        let now = Date.now();
        let path = playlistPath.call(this, entryId);
        let ended = !isLive;

        return qio.read(path)
            .then((content) => {
                let playlist = content;

                if (ended) {
                    logger.debug(`[${entryId}] ENDED`);
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
        try {

            if (this._entriesToProcess[entryId]) {
                logger.debug(`[${entryId}] is already in stream persistence list, ignoring request`);
                return Q.resolve();
            } else {
                this._entriesToProcess[entryId] = entryId;
                logger.info(`[${entryId}] entry added to persistence list`);

                return this.flushEntryList()
                    .then(() => {
                        logger.info(`[${entryId}] entry saved in persistence list file [${this.stoppedEntriesFileName}]`);
                        return Q.resolve();
                    })
                    .catch((err) => {
                        logger.info(`[${entryId}] entry successfully added to persistence list, but failed to to update [${this.stoppedEntriesFileName}]. Error: [${ErrorUtils.error2string(err)}]`);
                        return Q.resolve();
                    });
            }
        } catch (err) {
            logger.info(`[${entryId}] add to persist list threw unhandled error: [${ErrorUtils.error2string(err)}]`);
            return Q.resolve();
        }

    }

    removeEntry(entryId) {
        try {
            logger.debug(`[${entryId}] removing entry from persistence list`);

            if (entryId in this._entriesToProcess) {
                delete this._entriesToProcess[entryId];

                return this.flushEntryList()
                    .then(() => {
                        logger.info(`[${entryId}] entry removed from persistence list`);
                        return Q.resolve();
                    })
                    .catch((err) => {
                        logger.info(`[${entryId}] entry successfully removed from persistent list, but failed to update ${this.stoppedEntriesFileName}. Error: [${ErrorUtils.error2string(err)}]`);
                        return Q.resolve();
                    });
            } else {
                logger.info(`[${entryId}] entry is not in persistence list`);
                return Q.resolve();
            }
        } catch (err) {
            logger.info(`[${entryId}] remove from persist list threw unhandled error: [${ErrorUtils.error2string(err)}]`);
            return Q.resolve();
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
                    logger.debug(`[${entryId}] STOPPED ENTRY is being restored from ${this.stoppedEntriesFileName}`);
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
                // Do not fail any entry processing flow even if failed to save the persistent list
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