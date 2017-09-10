/**
 * Created by ron.yadgar on 17/07/2016.
 */
const Q = require('q');
const util = require('util');
const events = require("events");
const config = require('../../common/Configuration');
const qio = require('q-io/fs');
const path = require('path');
const _ = require('underscore');
const glob = require('glob');
const ErrorUtils = require('../utils/error-utils');
const PlaylistGenerator = require('../playlistGenerator/PlaylistGenerator');
const persistenceFormat = require('../../common/PersistenceFormat.js');
const RecordingEntrySession = require('./RecordingEntrySession.js')
const logger = require('../../common/logger').getLogger("RecordingManager");
const mathUtils = require('./../utils/math-utils');
const configRecording = config.get("recording");
const kalturaTypes = require('../kaltura-client-lib/KalturaTypes');
const unknownEntry = "UNKNOWN";
const backendClient = require('../BackendClientFactory.js').getBackendClient();
const recordingTimeIntervalMsec = configRecording.recordingTimeIntervalInSec * 1000;

class RecordingManager {
//todo what to do if we stop stream and start, but other machine has start to get it
//todo move all path join baseName etc to persistent format
// should also recording for primary ?
//change then style, and fix indentation
// todo Assumptions:
    /*
     1. No change configuration!
     2. recording window in not more that entry session window -  check it
     3. All chunks are comming at the same time
     recordingRootPath -
     recordingEntryPath
     recordingSessionPath
     recordingSessionSourcePath
     */
    constructor() {

        this.completedRecordingFolderPath = configRecording.completedRecordingFolderPath;
        //veryfiy that recordingMaxDurationInHours is no longer that
        this.recordingMaxDurationInMs = config.get("recording").recordingMaxDurationInHours * 60 * 60 * 1000;
        this.recordingMinDurationInMS = config.get("recording").recordingMinDurationInSeconds * 1000;
        this.recordingList = {};

        logger.info("Initializing recording manager");

        this.setHandleEntriesTimer = (timeoutMsec)=> {
            setTimeout(()=> {
                this.handleRecordingEntries()
            },timeoutMsec);
        }

        this.setHandleEntriesTimer(recordingTimeIntervalMsec);
    }

    getRecordingEntrySession(entryObj, entryServerNodeId, mp4FilesQueue) {
        logger.debug(`step:(3)=>[getRecordedEntrySession]`);
        let header = `[${entryObj.entryId}-${entryObj.recordedEntryId}]`;
        logger.debug(`${header}`);
        let entryId = entryObj.entryId;
        if (mp4FilesQueue != null && mp4FilesQueue.length > 0) {
            logger.debug(`${header}[getRecordedEntrySession] getRecordingEntrySession called with mp4 files [${JSON.stringify(mp4FilesQueue)}]`);
        }
        if (!entryObj.recordedEntryId) {
            entryObj.recordedEntryId = unknownEntry;
            logger.warn(`${header}[getRecordedEntrySession] Entry has no recordedEntryId`);
        }
        if (!this.recordingList[entryId]) {
            logger.info(`[${entryObj.entryId}-${entryObj.recordedEntryId}][getRecordedEntrySession] Create new recording session`);
            let recordingEntrySession = new RecordingEntrySession(entryObj, entryServerNodeId, mp4FilesQueue);
            this.recordingList[entryId] = recordingEntrySession;
            return Q.resolve({session:recordingEntrySession, sessionStarted:false});
        }
        else if (this.recordingList[entryId].entryObject.recordedEntryId != entryObj.recordedEntryId) {
            let msg = `[${entryId}-${this.recordingList[entryId].entryObject.recordedEntryId}][getRecordedEntrySession] unexpected state: session already exist for same liveEntry!!! [NEW ${entryObj.recordedEntryId}]`
            logger.error(msg);
            return Q.reject(msg);
        }
        else {
            logger.info(`[${entryObj.entryId}-${entryObj.recordedEntryId}][getRecordedEntrySession] Found a previous recording session, update time stamp`);
            this.recordingList[entryId].lastUpdateTime = new Date();
            return Q.resolve({session:this.recordingList[entryId], sessionStarted:true});
        }
    }

    startRecording(entryObj, entryServerNodeId, stopAlreadyStartedSession = false) {
        let header = `[${entryObj.entryId}-${entryObj.recordedEntryId}]`;
        logger.debug(`${header}[step:(1)]==>[startRecording] get recordedEntryId`);

        return backendClient.createRecordedEntry(entryObj)
            .then((recordedEntryId)=> {
                header = `[${entryObj.entryId}-${entryObj.recordedEntryId}]`;
                let startRecordingTime = new Date();
                logger.debug(`[${entryObj.entryId}-${recordedEntryId}] Start recording`);
                return this.stopSessionIfNeeded(entryObj, stopAlreadyStartedSession)
                    .then((mp4FilesQueue)=> {
                        return this.getRecordingEntrySession(entryObj, entryServerNodeId, mp4FilesQueue)
                    })
                    .then((sessionObj)=> {
                        return this.handleFlavorsMismatch(entryObj, sessionObj)
                            .then((sessionObj) => {
                                if (!sessionObj.sessionStarted) {
                                    return sessionObj.session.startRecording()
                                        .then(()=> {
                                            // Once start process is complete, release lock on files queue
                                            sessionObj.session.mp4FilesQueueLock = false;
                                            let startRecordingTimeDuration = new Date() - startRecordingTime;
                                            logger.info(`${header}[startRecording] Start recording completed, time : ${startRecordingTimeDuration} ms`);
                                        })
                                } else {
                                    logger.info(`${header}[startRecording] session running already, no reason to start it again.`);
                                }
                            });
                    });
            }).catch((err)=> {
                logger.error(`${header}[startRecording] Error while trying to start recording : ${ErrorUtils.error2string(err)}, delete object`);
                delete this.recordingList[entryObj.entryId];
                return Q.reject()
            })
    }

    stopLive(entryId) {
        let recordingEntrySession = this.recordingList[entryId];
        logger.debug(`[${entryId}][step:(11)]==>[stopLive] live stream stopped. Recording duration will be updated`);
        if (recordingEntrySession == null) {
            logger.warn(`[${entryId}][stopLive] can't update Server recording, entry does not exist in recording list`);
            return Q.resolve();
        }
        let header = `[${entryId}]-[${recordingEntrySession.entryObject.recordedEntryId}]`;
        let knownRecordedEntryPromise = Q.defer();
        if (this.isRecordedEntryUnknown(recordingEntrySession.entryObject.recordedEntryId)) {
            knownRecordedEntryPromise = this.replaceUnknownRecordedEntry(recordingEntrySession)
                .catch((err)=> {
                    logger.error(`${header}[stopLive] failed to replace recorded entry (content root dir not updated). Error: ${ErrorUtils.error2string(err)}`);
                })
                .then(()=> {
                    return Q.resolve();
                });
        }
            
        else {
            knownRecordedEntryPromise = Q.resolve();
        }
        
        return knownRecordedEntryPromise.then(()=> {
            return recordingEntrySession.updateEntryDuration(true)
                .catch((err)=> {
                    logger.error(`[${entryId}-${recordingEntrySession.entryObject.recordedEntryId}] [stopLive] failed to update duration. Error: ${ErrorUtils.error2string(err)}`);
                    return Q.resolve();
                });
        })
    }

    splitRecording(entryId, reason) {
        let recordingSession = this.recordingList[entryId];
        let recordingEntryId2Replace = recordingSession.entryObject.recordedEntryId;
        let header = `[${entryId}]-[${recordingEntryId2Replace}]`;
        logger.debug(`${header}[step:(6)]==>[splitRecording]`);
        if (!recordingSession.mp4FilesQueueLock) {
            let newRecordingEntryId = '*** EMPTY ***'
            recordingSession.mp4FilesQueueLock = true;
            let stopAlreadyStartedSession = true;
            logger.info(`[${entryId}-${recordingEntryId2Replace}][splitRecording] Recording entry ${recordingEntryId2Replace} has passed the limit of recording duration - ${this.recordingMaxDurationInMs / 1000} seconds. Split session`);
            return recordingSession.splitRecordedEntry(recordingSession.entryObject, reason)
                .then(()=> {
                    newRecordingEntryId = recordingSession.entryObject.recordedEntryId;
                    // Pass startRecording the queue of previous session in case there are files waiting to be written
                    return this.startRecording(recordingSession.entryObject, recordingSession.entryServerNodeId, stopAlreadyStartedSession);
                })
                .then(()=> {
                    logger.info(`[${entryId}-${newRecordingEntryId}][splitRecording] Split process completed successfully. [${recordingEntryId2Replace}] replaced by [${newRecordingEntryId}] - NEW RECORDED ENTRY ID!!!`);
                })
                .catch((err)=> {
                    logger.error(`[${entryId}-${newRecordingEntryId}][splitRecording] Error splitting recording for entry. Error: ${ErrorUtils.error2string(err)}`);
                });
        }
    }

    isRecordedEntryUnknown(recordedEntryId) {
        return recordedEntryId === unknownEntry
    }

    addNewChunks(Mp4Files, entryId, flavorId) {
        let recordingEntrySession = this.recordingList[entryId];
        let chunksNameChained = _.reduce(Mp4Files, function (str, obj) {
            return str + obj.chunkName + " ";
        }, "");

        if (!recordingEntrySession) {
            logger.info(`[${entryId}] Receiving new chunks: ${chunksNameChained}, but entry doesn't exist. Cannot add new chunks. Check for errors in log. call developer.`);
            return
        }

        let recordedEntryId = recordingEntrySession.entryObject.recordedEntryId;

        logger.info(`[${entryId}-${recordedEntryId}] Receiving new chunks: ${chunksNameChained}`);

        if (recordingEntrySession.splitRecordingRequired) {
            let stopAlreadyStartedSession = true;
            this.startRecording(recordingEntrySession.replacementEntryObj, recordingEntrySession.entryServerNodeId, stopAlreadyStartedSession);
            // get new recorded entry session after split recording due to receiving new recorded entry Id (the other DC generated a new recordedEntryId)
            recordingEntrySession = this.recordingList[entryId];
        }
        else if (recordingEntrySession.maxDurationReached()) {
            let durationMSec =  recordingEntrySession.getDurationMSec();
            logger.info(`[${entryId}-${recordedEntryId}] recording reached max duration [${mathUtils.durationToString(durationMSec, 2, mathUtils.HOUR_IN_MSEC)}] hrs`);
            this.splitRecording(entryId, 'recording  reached max duration');
            // get new recorded entry session after split recording session due to reaching max duration
            recordingEntrySession = this.recordingList[entryId];
        }
        // update lastUpdateTime
        recordingEntrySession.lastUpdateTime = new Date();

        let Mp4FilesClone = _.clone(Mp4Files);
        recordingEntrySession.updateRecordingFiles(Mp4FilesClone, flavorId);
    }

    handleRecordingEntries() {
        let startTime = new Date();
        // Function is not used anywhere in the project!

        function isRecordingFinish(recordingSession, now) {
            if (now - recordingSession.lastUpdateTime > recordingSession.recordingSessionDuration) {
                logger.info(`[${recordingSession.recordingSessionId}][handleRecordingEntries] recording  didn't get new chunks for [${recordingSession.recordingSessionDuration}] msec - stop recording`);
                return true
            }
            if (recordingSession.playlistGenerator.MaxClipCountReached()) {
                logger.warn(`[${recordingSession.recordingSessionId}][handleRecordingEntries] recording has passed max allowed number of clips - stop recording`);
                return true
            }
            return false
        }

        try {
            logger.debug("Check for end recording session");
            _.each(this.recordingList, (element, entryId)=> {
                let now = new Date();
                logger.debug(`[${element.recordingSessionId}][handleRecordingEntries] now:[${now}], duration: [${element.getDurationMSec() / 1000}], element: [${JSON.stringify(element)}]`);

                if (this.isRecordedEntryUnknown(element.entryObject.recordedEntryId)) {
                    this.replaceUnknownRecordedEntry(element)
                }
                if (isRecordingFinish(element, now)) {
                    logger.debug(`[${element.recordingSessionId}][step:(12)]==>[handleRecordingEntries]`);
                    this.stopRecording(entryId, element);
                }
            });
            logger.info("[handleRecordingEntries] Available recording entries: %j", _.keys(this.recordingList));
        } catch (err) {
            logger.error("[handleRecordingEntries] Error while trying to run handleRecordingEntries: %s ", ErrorUtils.error2string(err))
        } finally {
            let finishTime = new Date();
            let nextTimeout = recordingTimeIntervalMsec - (finishTime - startTime);
            nextTimeout = Math.max(0, nextTimeout);
            this.setHandleEntriesTimer(nextTimeout);
        }
        
    }

    // todo: check if this is still relevant???? and whether it is still correct to call getEntryInfo to get recordedEntryId
    // todo: especially as the first thing in call to startRecording() getRecordedEntry() is called
    replaceUnknownRecordedEntry(recordingEntrySession) {
        let header = `[${recordingEntrySession.entryObject.entryId}]-[${recordingEntrySession.entryObject.recordedEntryId}]`;
        logger.debug(`${header}[step:(7)]==>[replaceUnknownRecordedEntry]`)
        if (recordingEntrySession.mp4FilesQueueLock === true) {
            return Q.reject(`${header}[replaceUnknownRecordedEntry] Replacement of UNKNOWN entry is already running`);
        }
        //lock the ability to change playlistJson, in order to avoid race-condition
        recordingEntrySession.mp4FilesQueueLock = true;
        logger.debug(`${header}[replaceUnknownRecordedEntry][1 of 4] Calling get entry`);
        let entryId = recordingEntrySession.entryId;
        let oldRecordingSessionPath = recordingEntrySession.recordingSessionPath;

        return backendClient.getEntryInfo(entryId)
            .then((entryObj) => {
                if (entryObj.recordedEntryId) {
                    let recordedEntryId = entryObj.recordedEntryId;
                    let newRecordingDirectory = persistenceFormat.getRecordingSessionPath(entryId, recordingEntrySession.recordStatus, recordedEntryId);
                    return qio.isDirectory(newRecordingDirectory)
                        .then(result => {
                            // If path already exists finish method and wait for next iteration to see if a new recordedEntryID has been generated
                            if (result) {
                                logger.info(`${header}[replaceUnknownRecordedEntry]  Directory: ${newRecordingDirectory} already exists. Waiting for a new recordedEntryId`);
                                return Q.reject(`${header}[replaceUnknownRecordedEntry] Path to recordedEntryId [${recordedEntryId}] already exists`);
                            }
                            else {
                                logger.debug(`${header}[replaceUnknownRecordedEntry] Found new recordedEntryId : ${recordedEntryId}`);
                                return Q.resolve(recordedEntryId);
                            }
                        });
                }
                else {
                    return Q.reject(`${header}[replaceUnknownRecordedEntry] recordedEntryId does not exist on entry object`);
                }
            })
            .then((recordedEntryId) => {
                logger.debug(`[${entryId}-${recordedEntryId}][replaceUnknownRecordedEntry][2 of 4] Calling changeRecordedEntry on recordingEntrySession`);
                return recordingEntrySession.changeRecordedEntry(recordedEntryId);
            })
            .then(() => {
                header = `[${entryId}-${recordingEntrySession.entryObject.recordedEntryId}]`;
                logger.debug(`${header}[replaceUnknownRecordedEntry][3 of 4] Changing directory name from [${oldRecordingSessionPath}] to [${recordingEntrySession.recordingSessionPath}]`);
                // Renaming fails is directory exists and not empty! -> recordedEntryId must be a new one
                return qio.rename(oldRecordingSessionPath, recordingEntrySession.recordingSessionPath)
            })
            .then(() => {
                logger.debug(`${header}[replaceUnknownRecordedEntry][4 of 4] Export recorded entry to live directory`);
                return recordingEntrySession.accessibleRecording();
            })
            .catch((err) => {
                logger.error(`[${entryId}] Failed to change recorded entry! Error: ${ErrorUtils.error2string(err)}`);
            })
            .finally(() => {
                logger.info(`[${entryId}-${recordedEntryId}] UNKNOWN entry replacement finished`);
                recordingEntrySession.mp4FilesQueueLock = false;
            })
    }

    stopRecording(entryId, recordingEntrySession) {
        let stopRecordingPromise = null;

        if (recordingEntrySession) {
            let recordedEntryId = recordingEntrySession.entryObject.recordedEntryId;
            let header = `[${entryId}-${recordedEntryId}]`;
            logger.debug(`${header}[step:(8)]==>[stopRecording]`);
            stopRecordingPromise = recordingEntrySession.serializedActionsPromise // check first that all chunks are completed
                .then(()=> {
                    logger.debug(`${header}[stopRecording] successfully stopped recording session`)
                    return  this.endRecordingSession(entryId, recordingEntrySession);
                })
                .catch((err) => {
                    logger.error(`${header}[stopRecording] failed to stop recording session. Error: ${ErrorUtils.error2string(err)}`);
                    // Stop process is not caught anywhere therefore there is no meaning for passing on the error.
                    // Furthermore, even a failure of stop shouldn't prevent start process from completing in case of split.
                    return Q.resolve();
                });
        }
        else {
            logger.warn(`[${entryId}][stopRecording] Can't stop recording, it was not found in recording list. Check if stopped already`);
            stopRecordingPromise = Q.resolve();
        }

        return stopRecordingPromise;
    }

    stopSessionIfNeeded(entryObj, stopAlreadyStartedSession) {

        let recordingEntrySession = this.recordingList[entryObj.entryId];
        let stopSessionPromise = null;

        if (recordingEntrySession == null) { // session doesn't exit
            return Q.resolve();
        }

        // check if need to stop existing session because recordedEntryId changed or forcibly (max duration)
        if (recordingEntrySession.entryObject.recordedEntryId != entryObj.recordedEntryId || stopAlreadyStartedSession) {
            let recordedEntryId = recordingEntrySession.entryObject.recordedEntryId;
            let header = `[${entryObj.entryId}-${recordedEntryId}]`;
            let mp4FilesQueue = recordingEntrySession.mp4FilesQueue;
            logger.info(`${header}[step:(2)]==>[stopSessionIfNeeded] New recorded entryId [${entryObj.recordedEntryId}] has been generated. Delete existing session and start new one`);
            stopSessionPromise = this.stopRecording(entryObj.entryId, recordingEntrySession)
                .then(()=> {
                    logger.info(`${header}[stopSessionIfNeeded] successfully stopped recording session`)
                    return Q.resolve(mp4FilesQueue);
                })
                .catch((error)=> {
                    logger.error(`${header}[stopSessionIfNeeded] failed to properly stop recording session. Error: ${ErrorUtils.error2string(err)}`);
                    return Q.reject(error);
                });
        }
        else { // session exists with same recordedEntryId as in received entryObj
            stopSessionPromise = Q.resolve();
        }

        return stopSessionPromise;
    }

    handleFlavorsMismatch(entryObj, sessionObj) {
        let header = `[${entryObj.entryId}]-[${entryObj.recordedEntryId}]`;
        let playlistPath = path.join(sessionObj.session.recordingSessionPath, 'playlist.json');
        return qio.exists(playlistPath) // this is must since PlaylistGenerator.initializeStart() swallow promise.reject when playlist.json doesn't exist
            .then((sessionExist)=> {
                if (sessionExist) {
                    return sessionObj.session.verifyFlavorSetMatchPlaylistFlavors(entryObj)
                        .then((flavorsMatch) => {
                            if (!flavorsMatch) {
                                logger.debug(`${header}[step:(4)]==>[handleFlavorsMismatch]`);
                                return sessionObj.session.splitRecordedEntry(entryObj, 'found mismatch in flavors set from previous session')
                                    .then(()=> {
                                        return backendClient.createRecordedEntry(entryObj);
                                    })
                                    .then((newRecordedEntryId)=> {
                                        logger.info(`${header}[handleFlavorsMismatch] Successfully created new recordedEntryId: [${newRecordedEntryId}]. Next, session will restart!`);
                                        entryObj.recordedEntryId = newRecordedEntryId;
                                    })
                                    .then(()=> {
                                        logger.info(`${header}[handleFlavorsMismatch] after split, [${sessionObj.session.entryObject.recordedEntryId}] replaced by [${entryObj.recordedEntryId}]`);
                                        if (sessionObj.sessionStarted) {
                                            return this.stopSessionIfNeeded(entryObj)
                                        }
                                        else {
                                            delete this.recordingList[entryObj.entryId];
                                            return Q.resolve();
                                        }
                                    })
                                    .then((mp4FilesQueue)=> {
                                        return this.getRecordingEntrySession(entryObj, sessionObj.session.entryServerNodeId, mp4FilesQueue);
                                    });
                            }
                            else {
                                return Q.resolve(sessionObj);
                            }
                        });
                } else {
                    return Q.resolve(sessionObj);
                }
            })
    }

    endRecordingSession(entryId, recordingEntrySession) {
        let recordedEntryId = recordingEntrySession.entryObject.recordedEntryId;
        let mp4FilesQueue = recordingEntrySession.mp4FilesQueue;
        let doneFilePath = path.join(recordingEntrySession.recordingSessionPath, 'done');
        let totalRecordingDurationMsec = recordingEntrySession.getDurationMSec();
        let knownRecordedEntryPromise = null;
        let header = `[${entryId}-${recordedEntryId}]`;
        logger.debug(`${header}[step:(5)]==>[endRecordingSession]`);
        if (this.isRecordedEntryUnknown(recordedEntryId)) {
            knownRecordedEntryPromise = this.replaceUnknownRecordedEntry(recordingEntrySession)
                .catch((err)=> {
                    logger.error(`${header}[endRecordingSession] failed to replace recorded entry (content root dir not updated). Error: ${ErrorUtils.error2string(err)}`);
                })
                .then(()=> {
                    recordedEntryId = recordingEntrySession.entryObject.recordedEntryId;
                });
        }
        else {
            knownRecordedEntryPromise = Q.resolve();
        }

        return knownRecordedEntryPromise
            .then(()=> {
                return recordingEntrySession.updateEntryDuration(true)
                    .catch((err)=> {
                        logger.error(`[${header}][endRecordingSession] Failed to update recording duration!!! Error: ${ErrorUtils.error2string(err)}`);
                        return Q.resolve();
                    })
              })
              .then(()=> {
                    // if recording start flow didn't finish, startDuration can be null (initialized in accessibleRecording())
                    if (isNaN(recordingEntrySession.startDuration)) {
                        logger.warn(`${header}[endRecordingSession] Recording didn't start, do nothing.`);
                        delete this.recordingList[entryId];
                        return Q.resolve(mp4FilesQueue);
                    }
                    // get total number of chunks, in recording (sum for all flavors), for statistics
                    let totalAddedChunks = _.reduce(recordingEntrySession.flavorsChunksCounter, (memo, flavorChunks) => {
                        return memo + flavorChunks
                    }, 0);
                    //todo should also print warning if # of chunks is not equal between all flavors!
                    // check that duration is at least the minimum (to be handled properly by nginx)
                    if (totalRecordingDurationMsec < this.recordingMinDurationInMS) {
                        logger.warn(`${header}[endRecordingSession] Recording duration is less than minimum required, do nothing. Current duration: [${totalRecordingDurationMsec}] msec, start duration: [${recordingEntrySession.startDuration}] msec, totalAddedChunks: [${totalAddedChunks}]`);
                        delete this.recordingList[entryId];
                        return qio.write(doneFilePath, 'done')
                            .then(()=>{
                                logger.debug(`${header}[endRecordingSession] Successfully written 'done' file`);
                                return Q.resolve(mp4FilesQueue);
                            })
                    }
                    // write stamp file. The file is used by liveRecorder to verify duration equals between job and actual recording content
                    let stampFilePath = path.join(recordingEntrySession.recordingSessionPath, 'stamp');
                    return qio.write(stampFilePath, totalRecordingDurationMsec.toString())
                        .then(() => {
                            logger.debug(`${header}[endRecordingSession] Successfully written 'stamp' file`);
                            let destFilePath = path.join(this.completedRecordingFolderPath, entryId + '_' + recordedEntryId + '_' + totalRecordingDurationMsec);
                            return qio.symbolicLink(destFilePath, recordingEntrySession.recordingSessionPath, 'directory')
                                .then(() => {
                                    logger.info(`${header}[endRecordingSession] Successfully created soft link from ${recordingEntrySession.recordingSessionPath} to ${destFilePath}. Total recording duration [${totalRecordingDurationMsec}] msec, total chunks in this session: [${totalAddedChunks}] `);
                                })
                                .catch((err)=> {
                                    if (err instanceof Error && err.code == 'EEXIST') {
                                        logger.warn(`${header}[endRecordingSession] Could not create soft link from ${recordingEntrySession.recordingSessionPath} to ${destFilePath}, because it was already created.`);
                                        return Q.resolve(err);
                                    }
                                    else {
                                        logger.error(`${header}[endRecordingSession] Failed to create soft link from ${recordingEntrySession.recordingSessionPath} to ${destFilePath}. Error: ${ErrorUtils.error2string(err)}`);
                                        return Q.reject(err);
                                    }
                                });
                        })
                        .then(() => {
                            return qio.write(doneFilePath, 'done')
                                .then(()=> {
                                    logger.debug(`${header}[endRecordingSession] Successfully written 'done' file`);
                                })
                                .catch((err) => {
                                    logger.error(`${header}[endRecordingSession] Failed to write 'done' file. Error: ${ErrorUtils.error2string(err)}`);
                                })
                        })
                        .then(()=> {
                            return Q.resolve(mp4FilesQueue);
                        })
            })
            .catch((err)=> {
                // todo: decide whether we want to stop recording ignoring errors or not???
                logger.error(`${header}[endRecordingSession] Error happened during end recording session: ${ErrorUtils.error2string(err)}`);
            })
            .finally(()=> {
                delete this.recordingList[entryId];
            })
    }

}

if (!configRecording.enable){
    return
}
let recordingManager = new RecordingManager()
module.exports = recordingManager