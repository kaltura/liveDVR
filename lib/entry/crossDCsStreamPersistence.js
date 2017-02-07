/**
 * Created by lilach.maliniak on 18/09/2016.
 */
var persistenceFormat = require('./../../common/PersistenceFormat');
var qio = require('q-io/fs');
var logger = require('../../common/logger').getLogger("CrossDCsStreamPersistence");
var config = require('./../../common/Configuration');
var ErrorUtils = require('./../utils/error-utils');
var _ = require('underscore');
var Q = require('q');
var path = require('path');
var backendClient = require('../BackendClientFactory.js').getBackendClient();
var PlaylistGenerator = require('./../playlistGenerator/PlaylistGenerator');
const persistenceCheckIntervalMillisec = 1000 * config.get('persistenceCheckIntervalSec');
const presentationEndTimeRegex = /("presentationEndTime":\s*)(\d+)/;
const util = require('util');
const fsUtils = require('./../utils/fs-utils');


function playlistPath(entryId) {
    return path.join(persistenceFormat.getEntryBasePath(entryId), persistenceFormat.getMasterManifestName());
}

class CrossDCsStreamPersistence {

    constructor(prefix) {
        this._entriesToProcess = {};
        this._lastProcessedTimestamp = 0;
        this._persistenceFileName = util.format(config.get('persistenceFileName'), prefix);
    }

    streamPersistenceCheck(entryId) {
        logger.debug(`[${entryId}] starting stream persistence check`);

        return backendClient.isEntryLive(entryId)
            .then((isLive) => {
                return this.playlistUpdate(entryId, isLive);
            })
            .catch((err) => {
                logger.error(`[${entryId}] persistence check failed. Removing entry from persistence list. Error: [${ErrorUtils.error2string(err)}]`);
                return this.removeEntry(entryId);
            });

    }

    playlistUpdate(entryId, isLive) {

        let now = Date.now();
        let path = playlistPath.call(this, entryId);

        return qio.read(path)
            .then((content) => {
                let playlist = content;

                if (!isLive) {
                    logger.debug(`[${entryId}] ENDED`);
                    playlist = playlist.replace(presentationEndTimeRegex, `$1 ${now}`);
                    return qio.write(path, playlist)
                        .then(() => {
                            return this.removeEntry(entryId);
                        });
                } else {
                    logger.debug(`[${entryId}] is live in other DC. Keeping in persistence list.`);
                }
            })
            .catch((err) => {
                logger.error(`[${entryId}] persistence check failed.  Error: [${ErrorUtils.error2string(err)}]`);
                if (err.code !== 'ENOENT') {
                    return Q.reject(err);
                } else {
                    logger.debug(`[${entryId}] is live in other DC is ${isLive}. Removing entry, playlist not updated. Couldn't find playlist path ${path}.`);
                    return this.removeEntry(entryId);
                }
            });

    }

    addEntry(entryId) {
        try {

            if (this._entriesToProcess[entryId]) {
                logger.debug(`[${entryId}] is already in stream persistence list, ignoring request`);
                return Q.resolve();
            } else {
                this._entriesToProcess[entryId] = entryId;
                // to avoid race condition between 2 DCs that stop streaming
                // wait 5 seconds before ready for checking entry server nodes (providing DCs)
                setTimeout(() => {
                    this._lastProcessedTimestamp = 0;
                }, 5000);
                logger.info(`[${entryId}] entry added to persistence list`);

                return this.flushEntryList()
                    .then(() => {
                        logger.info(`[${entryId}] entry saved in persistence list file [${this._persistenceFileName}]`);
                    })
                    .catch((err) => {
                        logger.info(`[${entryId}] entry successfully added to persistence list, but failed to to update [${this._persistenceFileName}]. Error: [${ErrorUtils.error2string(err)}]`);
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
                        logger.info(`[${entryId}] entry successfully removed from persistent list, but failed to update ${this._persistenceFileName}. Error: [${ErrorUtils.error2string(err)}]`);
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
        logger.debug(`Restoring persistence list from ${this._persistenceFileName}`);

        return qio.makeDirectory(this._persistenceFileName.substr(0, this._persistenceFileName.lastIndexOf('/')))
            .catch((err) => {
                if (!(err.code === 'EEXIST')) {
                    logger.info(`Error restoring stopped entries from ${this._persistenceFileName}, [${ErrorUtils.error2string(err)}]`);
                }
                return err.exists;
            })
            .then((exists) => {
                if (exists) {
                    return qio.read(this._persistenceFileName);
                } else {
                    return '{}';
                }
            })
            .then((stoppedEntries) => {
                let pAll = _.map(JSON.parse(stoppedEntries), (entryId) => {
                    logger.debug(`[${entryId}] STOPPED ENTRY is being restored from ${this._persistenceFileName}`);
                    this.addEntry(entryId);
                });
                return Q.allSettled(pAll);
            })
            .catch((err) => {
                if (err.code != 'ENOENT') {
                    logger.info(`failed to restore live entries persistence list from ${this._persistenceFileName}. Error ${ErrorUtils.error2string(err)}`);
                    return qio.remove(this._persistenceFileName);
                } else {
                    logger.info(`${this._persistenceFileName} not found, persistence list is empty.`);
                    return this.flushEntryList();
                }
                return Q.resolve();
            });

    }

    flushEntryList() {
        let persistenceListStr = JSON.stringify(this._entriesToProcess);

        return fsUtils.writeFileAtomically(this._persistenceFileName, persistenceListStr)
            .then(() => {
                logger.debug(`Persistence list file updated. Content: [${persistenceListStr}], save in: [${this._persistenceFileName}]`);
            })
            .catch((err) => {
                logger.error(`Failed to save stopped entries persistence data. Error: [${ErrorUtils.error2string(err)}]`);
                return Q.resolve();
            });

    }

    processStoppedEntries() {

        let startTime = Date.now();

        if (startTime - this._lastProcessedTimestamp >= persistenceCheckIntervalMillisec) {
            logger.debug(`Starting to process persistence list`);

            this._lastProcessedTimestamp = startTime;

            let pAll = _.map(this._entriesToProcess, (entryId) => {
                return this.streamPersistenceCheck(entryId);
            });

            logger.debug(`Finished processing persistence list`);
            return Q.allSettled(pAll);

        } else {
            return Q.resolve();
        }
    }

    toJSON() {
        return Object.keys(this._entriesToProcess);
    }

}


module.exports = CrossDCsStreamPersistence;