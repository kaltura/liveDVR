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
const maxAllowedMp4FilesQueueSize = config.get("recording").recordingMaxAllowedMp4FilesQueueSize;
const TaskManager = require('../TaskManager').TaskManager;
const completedRecordingFolderPath = configRecording.completedRecordingFolderPath;
const clippingTaskTemplateName = config.get('newClippingTaskPushNotificationTemplateName');

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

        const recordingTimeInterval = configRecording.recordingTimeIntervalInSec * 1000;
        this.completedRecordingFolderPath = configRecording.completedRecordingFolderPath;
        //verify that recordingMaxDurationInHours is no longer that
        this.recordingMaxDurationInMs = config.get("recording").recordingMaxDurationInHours * 60 * 60 * 1000;
        this.recordingMinDurationInMS = config.get("recording").recordingMinDurationInSeconds * 1000;
        this.recordingList = {};

        logger.info("Initializing recording manager");
        TaskManager.register(kalturaTypes.KalturaEntryServerNodeType.LIVE_CLIPPING_TASK, clippingTaskTemplateName, this.handleNewLiveClippingTask);
        
        setInterval(()=> {
            this.handleRecordingEntries()
        }, recordingTimeInterval, this);
        this.synchronizeAddNewChunks=Q.resolve();
    }

    getRecordingEntrySession(entryObj, mp4FilesQueue = null) {
        let entryId = entryObj.entryId;
        if (mp4FilesQueue != null && mp4FilesQueue.length > 0) {
            logger.debug(`[${entryObj.entryId}-${entryObj.recordedEntryId}] getRecordingEntrySession called with mp4 files queue size [${mp4FilesQueue.length}]`);
        }
        if (!entryObj.recordedEntryId) {
            entryObj.recordedEntryId = unknownEntry;
            logger.warn(`[${entryObj.entryId}] Entry has no recordedEntryId`);
        }
        if (!this.recordingList[entryId]) {
            logger.info(`[${entryObj.entryId}-${entryObj.recordedEntryId}] Create new recording session`);
            let recordingEntrySession = new RecordingEntrySession(entryObj, mp4FilesQueue);
            this.recordingList[entryId] = recordingEntrySession;
            return Q.resolve({session:recordingEntrySession, sessionStarted:false});
        }
        else if (this.recordingList[entryId] && this.recordingList[entryId].disableRecording) {
            let msg = `disableRecording is set. Entry won't be recording anymore`;
            logger.error(msg);
            delete this.recordingList[entryId];
            return Q.reject(msg);
        }    
        else if (this.recordingList[entryId].recordedEntryId != entryObj.recordedEntryId) {
            let msg = `[${entryId}-${this.recordingList[entryId].recordedEntryId}] unexpected state: session already exist for same liveEntry!!! [NEW ${entryObj.recordedEntryId}]`
            logger.error(msg);
            return Q.reject(msg);
        }
        else {
            logger.info(`[${entryObj.entryId}-${entryObj.recordedEntryId}] Found a previous recording session, update time stamp`);
            this.recordingList[entryId].lastUpdateTime = new Date();
            return Q.resolve({session:this.recordingList[entryId], sessionStarted:true});
        }
    }

    startRecording(entryObj) {
        return Q.resolve().then(()=> {
            let startRecordingTime = new Date();
            logger.debug(`[${entryObj.entryId}-${entryObj.recordedEntryId}] Start recording`);
            return this.stopSessionIfNeeded(entryObj)
                .then((mp4FilesQueue)=> {
                    return this.getRecordingEntrySession(entryObj, mp4FilesQueue)
                })
                .then((sessionObj)=> {
                      return this.handleFlavorsMismatch(entryObj, sessionObj)
                        .then((sessionObj) => {
                            if (!sessionObj.sessionStarted) {
                                return sessionObj.session.startRecording()
                                    .then(()=> {
                                        // Once start process is complete, release lock on files queue
                                        logger.info(`[startRecording] release lock mp4FilesQueueLock`)
                                        sessionObj.session.mp4FilesQueueLock = false;
                                        let startRecordingTimeDuration = new Date() - startRecordingTime;
                                        logger.info(`[${entryObj.entryId}-${entryObj.recordedEntryId}] Start recording completed, time : ${startRecordingTimeDuration} ms`);
                                    })
                            } else {
                                logger.info(`[${entryObj.entryId}-${entryObj.recordedEntryId}] session running already, no reason to start it again.`);
                                if (sessionObj.session.mp4FilesQueueLock) {
                                    logger.warn(`[startRecording] new session was not started. Check log for reason. Release lock mp4FilesQueueLock`);
                                    sessionObj.session.mp4FilesQueueLock = false;
                                }
                            }
                        });
                });
        }).catch((err)=> {
            logger.error(`[${entryObj.entryId}-${entryObj.recordedEntryId}] Error while trying to start recording : ${ErrorUtils.error2string(err)}, delete session`);
            if (this.recordingList[entryObj.entryId]) {
                delete this.recordingList[entryObj.entryId];
                logger.warn(`[startRecording] new session was not started due to error.`);
            }
            return Q.reject(`[startRecording] start recording failed`);
        })
    }

    stopLive(entryId) {
        let recordingEntrySession = this.recordingList[entryId];
        if (!recordingEntrySession) {
            logger.warn("[%s] Can't updateServer recording, entry does not exist on recording list", entryId);
            return
        }
        if (this.isRecordedEntryUnknown(recordingEntrySession.recordedEntryId)) {
            this.replaceUnknownRecordedEntry(recordingEntrySession);
        }
        recordingEntrySession.updateEntryDuration(true)
    }

    splitRecording(entryId, reason) {
        let recordingSession = this.recordingList[entryId];
        if (!recordingSession) {
            logger.warn(`[${entryId}] Error splitting recording for entry, recordingEntrySession not found`);
            return Q.resolve();
        }
        if (recordingSession.disableRecording) {
            logger.warn(`[${entryId}] recording is disabled. Look for reason in log`);
            return Q.resolve();
        }
        return recordingSession.isUnlimitedRecordingDurationEnabled()
            .then((isEnabled)=> {
                if (!isEnabled) {
                    return this.stopRecording(entryId);
                }
                else {
                    let entryObject = recordingSession.entryObject;
                    logger.info(`[${entryId}-${recordingSession.entryObject.recordedEntryId}] Recording entry ${this.recordingList[entryId].recordedEntryId} has passed the limit of recording duration - ${this.recordingMaxDurationInMs / 1000} seconds. Split session`);
                    return recordingSession.splitRecordedEntry(recordingSession.entryObject, reason)
                        .then(()=> {
                            // Pass startRecording the queue of previous session in case there are files waiting to be written
                            return this.startRecording(entryObject);
                        })
                        .then(()=> {
                            logger.info(`[${entryId}-${entryObject.recordedEntryId}] Split process completed successfully. Replaced recordedEntryId: [${recordingSession.recordedEntryId}] by: [${entryObject.recordedEntryId}]`);
                        })
                        .catch((err)=> {
                            logger.error(`[${entryId}-${entryObject.recordedEntryId}] Error splitting recording for entry. Error: ${ErrorUtils.error2string(err)}`);
                        });
                }

            })
    }

    isRecordedEntryUnknown(recordedEntryId) {
        return recordedEntryId === unknownEntry
    }

    addNewChunks(Mp4Files, entryId, flavorId) {
        let chunksNameChained = _.reduce(Mp4Files, function (str, obj) {
            return str + obj.chunkName + " ";
        }, "");

        logger.info(`[${entryId}] Receiving new chunks: ${chunksNameChained}`);

        this.synchronizeAddNewChunks = this.synchronizeAddNewChunks.finally( ()=>
        {
            return this.handleMaxDuration(entryId)
                .then(()=>
                {
                    let recordingEntrySession = this.recordingList[entryId];
                    if (!recordingEntrySession)
                    {
                        logger.info(`[${entryId}] failed to add chunks. RecordedEntrySession doesn't exist in RecordingList. Maybe entry has passed the limit of max duration`);
                        return Q.resolve();
                    }
                    if (recordingEntrySession.mp4FilesQueue.length > maxAllowedMp4FilesQueueSize)
                    {
                        logger.fatal(`[${entryId}] recording queue reached [${maxAllowedMp4FilesQueueSize}] size. Dropping chunks!!!! CALL DEVELOPER`);
                    }
                    else
                    {
                        // update lastUpdateTime
                        recordingEntrySession.lastUpdateTime = new Date();

                        let Mp4FilesClone = _.clone(Mp4Files);
                        return recordingEntrySession.updateRecordingFiles(Mp4FilesClone, flavorId);
                    }
                })
                .catch((err)=>
                {
                    logger.error(`[${entryId}] failed adding new chunks. Error [${ErrorUtils.error2string(err)}]`);
                });
        });
        return this.synchronizeAddNewChunks;
    }

    handleRecordingEntries() {
        let now = new Date();
        // Function is not used anywhere in the project!

        function isRecordingFinish(recordingSession) {
            if (now - recordingSession.lastUpdateTime > recordingSession.recordingSessionDuration) {
                logger.info("[%s-%s] recording  didn't get new chunks for %d - stop recording", recordingSession.entryId, recordingSession.recordedEntryId, recordingSession.recordingSessionDuration);
                return true
            }
            if (recordingSession.playlistGenerator.MaxClipCountReached()) {
                logger.warn("[%s-%s] recording  has passed num of clips - stop recording", recordingSession.entryId, recordingSession.recordedEntryId);
                return true
            }

            if (recordingSession.entryObject.recordingStatus == kalturaTypes.KalturaRecordingStatus.PAUSED)
            {
                logger.info("[%s-%s] recording is paused", recordingSession.entryId, recordingSession.recordedEntryId);
                return false;
            }
            else if (recordingSession.entryObject.recordingStatus == kalturaTypes.KalturaRecordingStatus.STOPPED)
            {
                logger.info("[%s-%s] recording is stopped", recordingSession.entryId, recordingSession.recordedEntryId);
                return true;
            }

            return false
        }

        try {
            logger.debug("Check for end recording session");
            _.each(this.recordingList, (element, entryId) => {
                logger.debug("[%s] handleRecordingEntries-  now:[%s], duration: [%s], element: [%j]",
                    element.recordingSessionId, now, element.getDurationMSec() / 1000, element);

                if (this.isRecordedEntryUnknown(element.recordedEntryId)) {
                    this.replaceUnknownRecordedEntry(element)
                }
                if (isRecordingFinish(element)) {
                    this.stopRecording(entryId);
                }
            });
            logger.info("Available recording entry: %j", _.keys(this.recordingList));
        } catch (err) {
            logger.error("Error while trying to run handleRecordingEntries: %s ", ErrorUtils.error2string(err))
        }
    }

    replaceUnknownRecordedEntry(recordingEntrySession) {
        if (recordingEntrySession.mp4FilesQueueLock === true) {
            return Q.reject(`[${recordingEntrySession.entryId}] Replacement of UNKNOWN entry is already running`);
        }
        //lock the ability to change playlistJson, in order to avoid race-condition
        logger.info(`Set lock mp4FilesQueueLock`);
        recordingEntrySession.mp4FilesQueueLock = true;
        logger.debug(`[${recordingEntrySession.entryId}] [replaceUnknownRecordedEntry][1 of 4] Calling get entry`);
        let entryId = recordingEntrySession.entryId;
        let oldRecordingSessionPath = recordingEntrySession.recordingSessionPath;
        let recordedEntryId;
        return backendClient.getEntryInfo(entryId)
            .then((entryObj) => {
                if (entryObj.recordedEntryId) {
                    recordedEntryId = entryObj.recordedEntryId;
                    let newRecordingDirectory = persistenceFormat.getRecordingSessionPath(entryId, recordingEntrySession.recordStatus, recordedEntryId);
                    return qio.isDirectory(newRecordingDirectory)
                        .then(result => {
                            // If path already exists finish method and wait for next iteration to see if a new recordedEntryID has been generated
                            if (result) {
                                logger.info(`[${entryId}] Directory: ${newRecordingDirectory} already exists. Waiting for a new recordedEntryId`);
                                return Q.reject(`Path to recordedEntryId [${recordedEntryId}] already exists`);
                            }
                            else {
                                logger.debug(`[${entryId}] Found new recordedEntryId : ${recordedEntryId}`);
                                return Q.resolve(recordedEntryId);
                            }
                        });
                }
                else {
                    return Q.reject(`[${entryId}] recordedEntryId does not exist on entry object`);
                }
            })
            .then((recordedEntryId) => {
                logger.debug(`[${entryId}-${recordedEntryId}][replaceUnknownRecordedEntry][2 of 4] Calling changeRecordedEntry on recordingEntrySession`);
                return recordingEntrySession.changeRecordedEntry(recordedEntryId);
            })
            .then(() => {
                logger.debug(`[${entryId}-${recordedEntryId}][replaceUnknownRecordedEntry][3 of 4] Changing directory name from [${oldRecordingSessionPath}] to [${recordingEntrySession.recordingSessionPath}]`);
                // Renaming fails is directory exists and not empty! -> recordedEntryId must be a new one
                return qio.rename(oldRecordingSessionPath, recordingEntrySession.recordingSessionPath)
            })
            .then(() => {
                logger.debug(`[${entryId}-${recordedEntryId}][replaceUnknownRecordedEntry][4 of 4] Export recorded entry to live directory`);
                return recordingEntrySession.accessibleRecording();
            })
            .catch((err) => {
                logger.error(`[${entryId}] Failed to change recorded entry! Error: ${ErrorUtils.error2string(err)}`);
            })
            .finally(() => {
                logger.info(`[${entryId}-${recordedEntryId}] [replaceUnknownRecordedEntry]  UNKNOWN entry replacement finished. Release lock mp4FilesQueueLock`);
                recordingEntrySession.mp4FilesQueueLock = false;
            })
    }

    stopRecording(entryId, resetRecordedEntry = false) {
        if (this.recordingList[entryId]) {
            let recordingEntrySession = this.recordingList[entryId];
            if (!recordingEntrySession) {
                logger.warn(`[${entryId}][stopRecording] Can't stop recording, entry doesn't exist on recording list`);
                return Q.resolve();
            }
            let doneFilePath = path.join(recordingEntrySession.recordingSessionPath, 'done');
            return recordingEntrySession.serializedActionsPromise
                .finally(() => { // check first that all chunks are completed
                    let totalAddedChunks = _.reduce(recordingEntrySession.flavorsChunksCounter, (memo, flavorChunks) => {
                        return memo + flavorChunks
                    }, 0);
                    //todo should also print warning if # of chunks is not equal between all flavors!
                    // use here is that recording failed to start from some reason so startDuration is null (initialized in accessibleRecording())
                    if (isNaN(recordingEntrySession.startDuration)) {
                        logger.warn(`[${entryId}-${recordingEntrySession.recordedEntryId}][stopRecording] Recording didn't start, do nothing.`);
                        delete this.recordingList[entryId];
                        return Q.resolve();
                    }
                    let recordingSessionDuration = recordingEntrySession.getDurationMSec() - recordingEntrySession.startDuration;
                    if (recordingSessionDuration < this.recordingMinDurationInMS) {
                        logger.warn(`[${entryId}-${recordingEntrySession.recordedEntryId}][stopRecording] recording session duration is less than minimum required, do nothing. Session duration: [${recordingSessionDuration}] msec, total duration: [${recordingEntrySession.getDurationMSec()}] msec, totalAddedChunks: [${totalAddedChunks}]`);
                        delete this.recordingList[entryId];
                        return qio.write(doneFilePath, 'done')
                    }
                    let recordingDuration = recordingEntrySession.getDurationMSec().toString();
                    let stampFilePath = path.join(recordingEntrySession.recordingSessionPath, 'stamp');
                    return qio.write(stampFilePath, recordingDuration)
                        .then(() => {
                            if (recordingEntrySession.serverType !== kalturaTypes.KalturaEntryServerNodeType.LIVE_PRIMARY) {
                                logger.info(`[${entryId}-${recordingEntrySession.recordedEntryId}][stopRecording] entry is backup, skip creating soft link`);
                                return Q.resolve()
                            }
                            let destFilePath = path.join(this.completedRecordingFolderPath, entryId + '_' + recordingEntrySession.recordedEntryId + '_' + recordingDuration);
                            return qio.symbolicLink(destFilePath, recordingEntrySession.recordingSessionPath, 'directory')
                                .then(() => {
                                    logger.info(`[${entryId}-${recordingEntrySession.recordedEntryId}][stopRecording] Successfully created soft link from ${recordingEntrySession.recordingSessionPath} to ${destFilePath}; Recording chunks in this session: [${totalAddedChunks}] recordingSessionDuration [${recordingSessionDuration}]`);
                                })
                                .catch((err)=> {
                                    if (err instanceof Error && err.code == 'EEXIST') {
                                        logger.warn(`Could not create soft link from ${recordingEntrySession.recordingSessionPath} to ${destFilePath}, because it was already created.`);
                                        return Q.resolve(err);
                                    }
                                    else {
                                        logger.error(`Failed to create soft link from ${recordingEntrySession.recordingSessionPath} to ${destFilePath}. Error: ${ErrorUtils.error2string(err)}`);
                                        // todo: delete entry from list ????
                                        return Q.reject(err);
                                    }
                                });
                        })
                        .then(() => {
                            const entryObject = this.recordingList[entryId].entryObject;
                            delete this.recordingList[entryId];
                            if (resetRecordedEntry && (entryObject.serverType == kalturaTypes.KalturaEntryServerNodeType.LIVE_PRIMARY))
                            {
                                recordingEntrySession.updateEntryDuration(true).then(()=>{
                                    backendClient.resetRecordingEntry(entryObject, false);
                                });
                            }
                            return qio.write(doneFilePath, 'done');
                        })
                        .catch((err) => {
                            return Q.reject(err);
                        })
                })
                .catch((err) => {
                    logger.error(`[${entryId}-${recordingEntrySession.recordedEntryId}][stopRecording] Failure: ${ErrorUtils.error2string(err)}`);
                    // Stop process is not caught anywhere therefore there is no meaning for passing on the error.
                    // Furthermore, even a failure of stop shouldn't prevent start process from completing in case of split.
                    if (this.recordingList[entryId]) {
                        delete this.recordingList[entryId];
                    }
                    return Q.resolve();
                });
        }
        else {
            return Q.resolve();
        }
    }

    stopSessionIfNeeded(entryObj) {
        let recordingEntrySession = this.recordingList[entryObj.entryId];
        if (recordingEntrySession != null && recordingEntrySession.recordedEntryId != entryObj.recordedEntryId) {
            let mp4FilesQueue = recordingEntrySession.mp4FilesQueue;
            logger.info(`[${entryObj.entryId}-${recordingEntrySession.recordedEntryId}] New recorded entryId [${entryObj.recordedEntryId}] has been generated. Delete existing session and start new one`);
            return this.stopRecording(entryObj.entryId)
                .then(()=> {
                    return Q.resolve(mp4FilesQueue);
                })
                .catch((error)=> {
                    return Q.reject(error);
                });
        } else {
            return Q.resolve();
        }
    }

    handleFlavorsMismatch(entryObj, sessionObj) {

        return qio.exists(sessionObj.session.recordingSessionPath) // this is must since PlaylistGenerator.initializeStart() swallow promise.reject when playlist.json doesn't exist
            .then((sessionExist)=> {
                if (sessionExist) {
                    return sessionObj.session.verifyFlavorSetMatchPlaylistFlavors(entryObj)
                        .then((flavorsMatch) => {
                            if (!flavorsMatch) {
                                return sessionObj.session.splitRecordedEntry(entryObj, 'found mismatch in flavors set from previous session')
                                    .then(()=> {
                                        logger.info(`after split, [${sessionObj.session.recordedEntryId}] replaced by [${entryObj.recordedEntryId}]`);
                                        if (sessionObj.sessionStarted) {
                                            return this.stopSessionIfNeeded(entryObj)
                                        }
                                        else {
                                            delete this.recordingList[entryObj.entryId];
                                            return Q.resolve();
                                        }
                                    })
                                    .then((mp4FilesQueue)=> {
                                        return this.getRecordingEntrySession(entryObj, mp4FilesQueue);
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

    handleMaxDuration(entryId) {
        let handleMaxDurationPromise = null;
        let recordingEntrySession = this.recordingList[entryId];
        if (!recordingEntrySession) {
            logger.info(`[${entryId}] Entry does not exist in recording list. Maybe entry has passed the limit of max duration`);
            return Q.resolve();
        }

        let header = `[${entryId}-${recordingEntrySession.entryObject.recordedEntryId}]`;
        if (recordingEntrySession.maxDurationReached() && !recordingEntrySession.mp4FilesQueueLock) {
            // lock mp4 files queue
            logger.info(`${header} [handleMaxDuration] set lock mp4FilesQueueLock`);
            recordingEntrySession.mp4FilesQueueLock = true;

            let durationMSec =  recordingEntrySession.getDurationMSec();
            logger.info(`${header} [handleMaxDuration] recording reached max duration [${mathUtils.durationToString(durationMSec, 2, mathUtils.HOUR_IN_MSEC)}] hrs`);
            handleMaxDurationPromise = this.splitRecording(entryId, 'recording reached max duration');
        }
        else {
            handleMaxDurationPromise = Q.resolve();
        }

        return handleMaxDurationPromise
            .catch((err)=> {
                logger.debug(`${header} [handleMaxDuration] error [${ErrorUtils.error2string(err)}]`);
                if (recordingEntrySession.mp4FilesQueueLock) {
                    logger.warn(`${header} [handleMaxDuration] release lock mp4FilesQueueLock due to error in flow. Check logs for reason`);
                    recordingEntrySession.mp4FilesQueueLock = false;
                }
                return Q.resolve();
            });
    }

    handleNewLiveClippingTask(task)
    {
        logger.debug("TASK - in the recordingManager call back for task: " + util.inspect(task));
        let playListPath = path.join(persistenceFormat.getEntryBasePath(task.entryId), persistenceFormat.getMasterManifestName());
        let newPath = persistenceFormat.getRecordingSessionPath(task.entryId, null, task.clippedEntryId);
        let newPathInLive = persistenceFormat.getEntryBasePath(task.clippedEntryId);
        let duration = task.clipAttributes.duration;
        let strDuration = duration.toString();
        let flavors = null;

        return qio.makeTree(newPath).then(() => {
            return qio.read(playListPath);
        }).then((data) => {
            let playList = JSON.parse(data);
            playList.clipFrom = PlaylistGenerator.getAbsoluteTimeFromRelative(playList, task.clipAttributes.offset);
            playList.clipTo = PlaylistGenerator.getAbsoluteTimeFromRelative(playList, task.clipAttributes.offset + duration);
            if (playList.clipFrom >= playList.clipTo)
            {
                logger.error("VALIDATION ERROR: can not set playlist attribute: clipFrom: [" +playList.clipFrom + "] and clipTo: [" + playList.clipTo + "]");
                backendClient.updateEntryServerNodeStatus(task.id, kalturaTypes.KalturaEntryServerNodeStatus.ERROR);
                throw new Error("Error in setting playlist attribute for task id: " + task.id);
            }
            flavors = playList.sequences.map(elem => elem.id).join(',');
            let newPlayListPath = path.join(newPath,persistenceFormat.getMasterManifestName());
            logger.debug("Saving new playlist with clip Attributes to: " + newPlayListPath);
            return qio.write(newPlayListPath, JSON.stringify(playList));
        }).then(() => {
            let stampPath = path.join(newPath,persistenceFormat.getStampFileName());
            logger.debug(`Creating Stamp file with [${strDuration}] on [${stampPath}]`);
            return qio.write(stampPath, strDuration);
        }).then(() => {
            let dataFilePath = path.join(newPath,persistenceFormat.getDataFileName());
            let dataStr = JSON.stringify({"taskId": task.id, "taskType": task.serverType, "flavors": flavors});
            logger.debug(`Creating Data file with [${dataStr}] on [${dataFilePath}]`);
            return qio.write(dataFilePath, dataStr);
        }).then(() => {
            logger.debug(`Creating softLink from [${newPathInLive}] to [${newPath}]`);
            return qio.symbolicLink(newPathInLive, newPath, 'directory');
        }).then(() => {
            let destFilePath = path.join(completedRecordingFolderPath, task.liveEntryId + '_' + task.clippedEntryId + '_' + strDuration);
            logger.debug(`Creating softLink (for liveRecorder) from [${destFilePath}] to [${newPath}]`);
            return qio.symbolicLink(destFilePath, newPath, 'directory')
        }).then(() => {
            logger.debug("Updating status of: " + task.id + " to QUEUE");
            return backendClient.updateEntryServerNodeStatus(task.id, kalturaTypes.KalturaEntryServerNodeStatus.TASK_QUEUED);
        }).catch((err) => {
            logger.error(`[${task.id}] failed processing task. Error [${ErrorUtils.error2string(err)}]`);
        });
    }

}

if (!configRecording.enable){
    return
}
let recordingManager = new RecordingManager()
module.exports = recordingManager