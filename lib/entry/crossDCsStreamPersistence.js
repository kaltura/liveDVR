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
const kalturaTypes = require('./../kaltura-client-lib/KalturaTypes');

// todo:
// consult with Guy whether to keep playlist and just update on disk or read/write...
// I think its better to keep cache of playlist and just write to disk each update.

class CrossDCsStreamPersistence {

    constructor() {

        this._endTimeRegex = /(presentationEndTime":\s*)(\d+)/;
        this._expireTimeRegex = /(expirationTime:"\s*)(\d+)/;
        this.stoppedEntriesFileName = path.join(stoppedEntriesPath, endListPendingEntriesFileName);
        // note: default value of streamPersistenceTimer must be less than lowest play window size.
        // assuming min play window size is 30 secs, the default persistenceCheckIntervalMillisec
        // is 20 secs. In addition there is a time budget used as margin to make sure that even
        // in very loaded system race condition chances will be very low.
        this._persistenceCheckIntervalMillisec = config.get('persistenceCheckIntervalMillisec');
        this._entriesToProcess = {};
        this._playlistsData = {};
        this._lastProcessedTimestampe = Date.now();
        // _timeBudget purpose is to avoid race between packager and liveController, in case
        // presentationEndTime value becomes past time before it is update by persistence loop.
        this._timeBudget = 5000; // arbitrary time budget
    }

    streamPersistenceCheck(entryId, newEntry = false, restored = false) {

        let entryIsLive = false;
        let ended = false;
        let now = Date.now();
        let presentationTime = now + 7200000;

        logger.debug(`====> [streamPersistenceCheck] starting stream persistence check`);
        // todo: consult with Guy whether to filter received nodes objects according to status...
        //entryServerNodeFilter.statusEqual = KalturaLiveStatus.PLAYABLE or KalturaLiveStatus.BROADCASTING;
        return backendClient.getLiveEntryServerNodes(entryId)
            .then((serverObjs) => {
                return _.reduce(serverObjs, (memo, dc) => {
                    return (dc.status === kalturaTypes.KalturaEntryServerNodeStatus.PLAYABLE) || memo;
                }, false);
            })
            .then((isLive) => {
                entryIsLive = isLive;
                return qio.read(this._playlistsData[entryId].path);
            })
            .then((content) => {
                let playlist = content;
                if (entryIsLive) {
                    logger.debug(`====> [streamPersistenceCheck] [${entryId}] is still alive stream persists by other DC`);
                    playlist = content.replace(this._endTimeRegex, `$1${presentationTime}`);
                    if (newEntry && !restored) {
                        playlist = playlist.replace(this._expireTimeRegex, `$1${now}`);
                    }
                    this._playlistsData[entryId].presentationTime = presentationTime;
                } else {
                    ended = true;
                    logger.debug(`====> [streamPersistenceCheck] [${entryId}] ended`);
                    playlist = playlist.replace(this._endTimeRegex, `$1 ${now}`);
                }
                return playlist;
            })
            .then((playlist) => {
                return qio.write(this._playlistsData[entryId].path, playlist);
            })
            .then(() => {
                if (ended) {
                    return this.removeEntry(entryId, true);
                }
            })
            .catch((err) => {
                logger.error(`persistence check failed for [${entryId}]. error: [${ErrorUtils.error2string(err)}]`);
                return Q.reject(err);
            });
    }

    addEntry(entryId, restored = false) {

        logger.debug(`====> [addEntry] adding [${entryId}] to persistence list`);
        if (this._entriesToProcess[entryId]) {
            logger.debug("====> [addEntry][%s] entry is already in stream persistence list, ignoring request", entryId);
        } else {
            this._entriesToProcess[entryId] = entryId;
            this._playlistsData[entryId] = {
                path: path.join(persistenceFormat.getEntryBasePath(entryId), persistenceFormat.getMasterManifestName()),
                presentationTime: Date.now()
            };
            this.streamPersistenceCheck(entryId, true, restored);
            logger.info(`====> [addEntry][${entryId}] was added to stream persistence list, [playlistPath=${this._playlistsData[entryId]}]`);

            /*         // todo: rethink flash operation location and timing...
             return this.flushEntryList(this._entriesToProcess)
             .catch((err)=> {
             logger.error(`error restoring stopped entries list, error: [${ErrorUtils.error2string(err)}]`);
             return Q.resolve(true);
             });*/
        }
        // return Q.resolve(true);
    }

    removeEntry(entryId) {

        logger.debug(`====> [removeEntry] removing [${entryId}] from persistence list`);
        if (this._entriesToProcess.hasOwnProperty(entryId)) {
            delete this._entriesToProcess[entryId];
            delete this._playlistsData[entryId];

            /*        // todo: rethink flash operation location and timing...
             return this.flushEntryList(this._entriesToProcess)
             .catch((err) => {
             logger.error(`failed to get entry server nodes for stopped entry [${entryId}], error: [${ErrorUtils.error2string(err)}]`);
             return Q.resolve(true);
             });*/
            if (Object.keys(this._entriesToProcess).length === 0) {
                return this.flushEntryList(this._entriesToProcess);
            }
        }
        return Q.resolve(true);
    }

    // initialized persistence list (stopped entries).
    init() {
        logger.debug(`====> [init] restoring persistence list from ${stoppedEntriesPath}`);
        return qio.exists(stoppedEntriesPath)
            .then((exists) => {
                if (exists) {
                    return qio.read(this.stoppedEntriesFileName);
                } else {
                    return Q.reject(false);
                }
            })
            .then((stoppedEntries) => {
                let pAll = _.map(JSON.parse(stoppedEntries), (entryId) => {
                    this.addEntry(entryId, true);
                });
                return Q.allSettled(pAll);
            })
            .catch((err) => {
                if (_.isObject(err)) {
                    if (err.code != 'ENOENT') {
                        logger.info(`====> [init] error restoring stopped entries list, error: [${ErrorUtils.error2string(err)}]`);
                        return Q.reject(err);
                    } else {
                        logger.warn(`${this.stoppedEntriesFileName} was not found`);
                        return Q.resolve();
                    }
                } else {
                    return qio.makeDirectory(stoppedEntriesPath)
                        .catch((err) => {
                            logger.error(`====> [init] error restoring stopped entries list, error: [${ErrorUtils.error2string(err)}]`);
                            return Q.reject(err);
                        });

                }
            });

    }

    flushEntryList() {

        logger.debug(`====> [flushEntryList] updating persistence list on disk`);

        if (Object.keys(this._entriesToProcess).length > 0) {
            let entries2persistStr = JSON.stringify(_.keys(this._entriesToProcess));

            return qio.write(this.stoppedEntriesFileName, entries2persistStr)
                .then(() => {
                    logger.debug(`====> [flushEntryList] Stopped entries: ${entries2persistStr}`);
                })
                .catch((err) => {
                    logger.error(`====> [flushEntryList] failed to save stopped entries persistence data, error: [${ErrorUtils.error2string(err)}]`);
                    return Q.resolve();
                });

        } else {
            return qio.remove(this.stoppedEntriesFileName)
                .then(() => {
                    logger.debug(`====> [flushEntryList] successfully removed ${this.stoppedEntriesFileName}. Reason: no stopped entries.`);
                })
                .catch((err) => {
                    if (err.code != 'ENOENT') {
                        logger.info(`====> [flushEntryList] error restoring stopped entries list, error: [${ErrorUtils.error2string(err)}]`);
                        return Q.reject(err);
                    } else {
                        logger.info(`====> [flushEntryList] ${this.stoppedEntriesFileName} doesn't exist.`);
                        return Q.resolve();
                    }
                });
        }
    }

    // note: stopped entry processing timing is based on presentationEndTime value
    processStoppedEntries() {
        let startTime = Date.now();
        if (Object.keys(this._entriesToProcess).length === 0) {
            return Q.resolve();
        }

        if (startTime - this._lastProcessedTimestampe >= this._persistenceCheckIntervalMillisec) {
            logger.debug(`====> [processStoppedEntries] starting to process persistence list`);

            this._lastProcessedTimestampe = startTime;

            let pAll = _.map(this._entriesToProcess, (entryId) => {

                // here it is taken care, to check if there is enough time until next iteration or stream state must be checked
                // and if live, presentationEndTime updated, to avoid race conditions that can cause packager to end stream immaturely
                let time2EndStreamMillisec = this._playlistsData[entryId].presentationTime - startTime;

                if (time2EndStreamMillisec - this._timeBudget <= this._persistenceCheckIntervalMillisec) {

                    return this.streamPersistenceCheck(entryId);
                }
                return Q.resolve();
            });

            Q.allSettled(pAll)
                .then(() => {
                    return this.flushEntryList(this._entriesToProcess);
                })
                .done(() => {
                    logger.debug(`====> [processStoppedEntries] persistence list processing ended [took ${Date.now() - startTime} seconds]`);
                    return Q.resolve();
                });

        } else {
            return Q.resolve();
        }

    }
}


module.exports = CrossDCsStreamPersistence;