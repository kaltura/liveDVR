/**
 * Created by ron.yadgar on 19/10/2016.
 */
/**
 * Created by ron.yadgar on 17/07/2016.
 */
const Q = require('q');
const loggerBase = require('../../common/logger')
const util = require('util');
const events = require("events");
const config = require('../../common/Configuration');
const qio = require('q-io/fs');
const path = require('path');
const _ = require('underscore');
const glob = require('glob');
const ErrorUtils = require('../utils/error-utils');
const PlaylistGenerator = require('../playlistGenerator/PlaylistGenerator');
const mp4Utils = require('../utils/mp4-utils.js');
const PersistenceFormat = require('../../common/PersistenceFormat.js');
const pGlob = Q.denodeify(glob);
const kalturaTypes = require('../kaltura-client-lib/KalturaTypes');
const backendClient = require('../BackendClientFactory.js').getBackendClient();
const promUtils = require('../utils/promise-utils');
const recordingUpdateEntryTimeIntervalMs = config.get('recording').recordingUpdateEntryTimeIntervalInMin * 60 * 1000
const recordingMaxDurationInMs = config.get('recording').recordingMaxDurationInHours * 60 * 60 * 1000;
const unknownEntry = "UNKNOWN";
const recordingEntryMetaDataFile = 'metadata.json';
const getEntryInfoIntervalMSec = config.get('recording').getEntryInfoIntervalMSec;
const persistenceFormat = require('../../common/PersistenceFormat');


class RecordingEntrySession {
    constructor(entryObj, entryServerNodeId, mp4FilesQueue = null, flavorsObjArray = null) {

        const createPlaylistGenerator = () => {
            //create playlist  json
            let options = {
                'recording': true,
                'recordingSessionPath': this.recordingSessionPath
            };
            if (this.recordingSessionPath) {
                options.flavors = this.entryObject.flavorsObjArray
            }
            return new PlaylistGenerator(this.entryObject, options)
        };

        this.lastUpdateTime = new Date();
        this.entryObject = entryObj;
        this.entryServerNodeId = entryServerNodeId;
        this.recordStatus = entryObj.recordStatus;
        this.recordingSessionPath = persistenceFormat.getRecordingSessionPath(this.entryObject.entryId, this.recordStatus, this.entryObject.recordedEntryId);
        this.flavors = [];
        this.flavorsChunksCounter = {};
        if (!flavorsObjArray) {
            _.each(entryObj.flavorsObjArray, (flavorObj)=> {
                this.flavors.push(flavorObj.name);
                this.flavorsChunksCounter[flavorObj.name] = 0;
            });
        }
        else {
            this.flavors = flavorsObjArray;
        }

        this.recordingSessionDuration = entryObj.recordingSessionDuration;
        this.lastUpdateDuration = 0;
        this.playlistGenerator = createPlaylistGenerator(); //todo check that its not passed the limit
        this.recordingSessionId = `[${this.entryObject.entryId}-${this.entryObject.recordedEntryId}] `;
        this.logger = loggerBase.getLogger('RecordingEntrySession', `${this.recordingSessionId}`);
        this.logger.info("Starting a new recording session");
        this.serializedActionsPromise = Q.resolve();
        this.getDurationMSec = ()=> {
            return this.playlistGenerator.getTotalDuration()
        };
        this.serverType = entryObj.serverType;
        this.mp4FilesQueueLock = true;
        this.mp4FilesQueue = (mp4FilesQueue) ? mp4FilesQueue : [];
        this.sync = this.entryObject.syncPromises;
        this.lastGetRecordedEntryIdTime = new Date(0);
        this.splitRecordingRequired = false;
        this.replacementEntryObj = null;
        // use this flag to indicate that session should be deleted, but deletion is delayed to avoid loss of chunks.
        // the actual delete is done in RecordingManager.getRecordingEntrySession
        this.markedForDeletion = false;
        this.maxDurationReached = ()=> {
            return this.getDurationMSec() >= recordingMaxDurationInMs;
        };
    }

    makeFlavorDirectories() {
        this.logger.debug(`About to create directories ${this.flavors}`);
        let creatingDirectoriesPromise = _.map(this.flavors, (flavorId)=> {
            let flavorPath = path.join(this.recordingSessionPath, flavorId);
            return qio.makeDirectory(flavorPath);
        });
        return Q.allSettled(creatingDirectoriesPromise)
            .then((results)=> {
                _.each(results, (promise)=> {
                    if (promise.state === 'rejected') {
                        if (promise.reason && promise.reason.code === 'EEXIST') {
                            this.logger.debug(`path ${promise.reason.path} already exist`);
                        }
                        else {
                            this.logger.error(`Failed to make directory ${ErrorUtils.error2string(promise.reason)}`);
                        }
                    }
                })
            })
    }

    startExistSession() {
        this.logger.debug(`[step:(10)]==>[startExistSession]`);
        let doneFilePath = path.join(this.recordingSessionPath, 'done');
        return this.accessibleRecording()
            .then(()=> {
                return qio.exists(doneFilePath)
            })
            .then((fileDoneExist)=> {

                if (fileDoneExist) {
                    this.logger.debug(`file-done exists, remove it`);
                    return qio.remove(doneFilePath)
                }
                else {
                    this.logger.warn(`file done is not exist, check for restoration`);
                    return this.makeFlavorDirectories().then(()=> {
                        return this.restoreSession()
                    })
                }
            })
    }

    startNewSession() {
        this.logger.debug(`[step:(10)]==>[startNewSession]`);
        return qio.makeTree(this.recordingSessionPath)
            .then(()=> {
                return this.makeFlavorDirectories()
            })
            .then(()=> {
                return this.accessibleRecording()
            })
    }

    startRecording() {
        this.logger.debug(`[startRecording]`);
        let playlistPath = path.join(this.recordingSessionPath, 'playlist.json');
        return qio.exists(playlistPath).then((sessionExist)=> {
            if (sessionExist) {
                return this.startExistSession();
            }
            else {
                return this.startNewSession();
            }
        })
    }


    accessibleRecording() {
        /*
         Create manifest,and then crate symbolic link to live
         */
        return this.playlistGenerator.initializeStart().then(()=> {
            return this.playlistGenerator.finalizeStart().then(()=> {
                    if (this.maxDurationReached()) {
                        let durationMSec = this.getDurationMSec();
                        let msg = util.format(`Warning, recorded entry is passed the limit of recording session, [${durationMSec}] msec (limit: ${recordingMaxDurationInMs} msec). The VOD might fail to process`);
                        this.logger.warn(msg);
                        //return Q.reject(msg)
                    }
                    if (this.playlistGenerator.MaxClipCountReached()) {
                        return Q.reject("Recording has passed num of clips")
                    }
                    if (this.startDuration === undefined) {
                        this.startDuration = this.getDurationMSec();
                        this.logger.debug("Start duration %s", this.startDuration);
                    }
                    let updatedDurationPromise = this.updateEntryDuration(true)
                        .catch((err)=> {
                            this.logger.info(`failed to update recording duration. Error: [${ErrorUtils.error2string(err)}]`);
                            return Q.resolve();
                        });

                    updatedDurationPromise
                        .then(() => {
                            let accessibleRecordingFolder = PersistenceFormat.getEntryBasePath(this.entryObject.recordedEntryId)
                            let accessibleRecordingBasePath = path.dirname(accessibleRecordingFolder)
                            return qio.makeTree(accessibleRecordingBasePath)
                                .then(()=> {
                                    let metadataPath = path.join(this.recordingSessionPath, recordingEntryMetaDataFile);
                                    let metadata = JSON.stringify({
                                        entryServerNodeId: this.entryServerNodeId,
                                        serverType: this.serverType
                                    });
                                    return qio.write(metadataPath, metadata);
                                })
                                .then(()=> {
                                    return qio.exists(accessibleRecordingFolder).then((isExist)=> {
                                        if (!isExist) {
                                            if (this.entryObject.recordedEntryId === unknownEntry) {
                                                this.logger.warn("Can't link recorded entry into live, recorded entry is unknown")
                                                return Q.resolve()
                                            }
                                            this.logger.info("Accessible recording")
                                            return qio.symbolicLink(accessibleRecordingFolder, this.recordingSessionPath, 'directory')
                                        }
                                    })

                                })
                        });
                })
            })
    }

    /*
     In order to check that all chunks in live directory exist in recording, we check first that all chunks in recording are in json
     */
    updateEntryDuration(force) {
        let duration = this.getDurationMSec();
        let durationDiff = duration - this.lastUpdateDuration;
        if (force == true || durationDiff >= recordingUpdateEntryTimeIntervalMs) {
            this.logger.debug(`[step:(9)]==>[updateEntryDuration]`);
            let currentSessionDuration = duration - this.startDuration;
            this.lastUpdateDuration = duration;
            // must report duration greater than zero
            let reportDurationMsec = duration > 0 ? duration : 1;
            let reason = force ? 'force' : 'time to'
            this.logger.info(`[updateEntryDuration] ${reason} update recording duration. Recording duration [${duration}] msec, this session duration [${currentSessionDuration}] msec`);
            return this.sync.exec(()=> {
                return backendClient.updateEntryDuration(this.entryObject.entryId, reportDurationMsec, this.entryObject.recordedEntryId, this.entryServerNodeId).then(()=> {
                    this.logger.info(`[updateEntryDuration] successfully updated recorded entry with duration ${reportDurationMsec}`)
                });
            });
        }
        else {
            return Q.resolve();
        }
    }

    // splitRecordedEntry: the method resets recorded entry Id.
    // comments: SessionManager.startRecording(), calls createRecodedEntry()
    // Separation of createRecordedEntry from resetRecordingEntry is part of Recording Redundancy feature
    splitRecordedEntry(entryObject, reason) {
        return this.sync.exec(() => {
            this.logger.info(`Recording session will split due to: ${reason}`);
            return backendClient.resetRecordingEntry(entryObject)
                .then(()=> {
                    return backendClient.createRecordedEntry(entryObject);
                })
                .then((newRecordedEntryId) => {
                    this.logger.info(`Successfully created new recordedEntryId: [${newRecordedEntryId}]. Next, session will restart!`);
                    entryObject.recordedEntryId = newRecordedEntryId;
                })

        });
    }

    restoreSession() {
        return this.accessibleRecording() //in order to check if file exist, first need to load Json form disk
            .then(()=> {
                return this.checkFilesFromRecordingFolder()
            })
            .then(()=> {
                return this.checkFilesFromLiveFolder()
            })
            .then(()=> {
                this.logger.info("restoreSession is finished")
            })
            .catch((err)=> {
                this.logger.error("Failed to restore session : %s", ErrorUtils.error2string(err))
            })
    }

    checkMissingChunks(downloadedChunks) {
        let missingChunks = [];
        _.each(downloadedChunks, (filePath)=> {
            let fileName = path.basename(filePath);
            if (!this.playlistGenerator.checkFileExists(fileName)) {
                this.logger.info("checkMissingChunks: Found chunk %s missing on playList: path %s", fileName, filePath)
                missingChunks.push(filePath)
            }

        })
        return missingChunks
    }

    checkFilesFromLiveFolder() {
        let liveEntryPath = PersistenceFormat.getEntryBasePath(this.entryObject.entryId);
        return this.findMissingChunksAndGetMetadata(path.join(liveEntryPath, '*/*/*.mp4'))
            .then((Mp4Files)=> {
                if (Mp4Files) {
                    _.each(Mp4Files, (Mp4File)=> {
                        Mp4File.flavor = PersistenceFormat.getFlavorFromLivePath(Mp4File.path)
                        return Mp4File
                    })
                    return this.linkAndUpdateJson(Mp4Files)
                }
            })

    }

    /*
     This funcion check that all file in recording directory are also in Json, Otherwise, calling addFileToJson
     */
    checkFilesFromRecordingFolder() {
        return this.findMissingChunksAndGetMetadata(path.join(this.recordingSessionPath, '*/*.mp4')).then((missingChunks)=> {
            if (missingChunks) {
                this.logger.debug("checkFilesFromRecordingFolder: About to update chunks %s in json for recorded session id", JSON.stringify(missingChunks))
                _.each(missingChunks, (Mp4File)=> {
                    Mp4File.flavor = PersistenceFormat.getFlavorFromRecordingPath(Mp4File.path)
                    return Mp4File
                })
                return this.updateJson(missingChunks)
            }
        })
    }

    findMissingChunksAndGetMetadata(directoriesToCheck) {
        return pGlob(directoriesToCheck)
            .then((downloadedChunks)=> {
                let missingChunks = this.checkMissingChunks(downloadedChunks);
                if (missingChunks.length == 0) {
                    this.logger.debug(" No missing chunks found compare to folders %s", directoriesToCheck);
                    return Q.resolve()
                }
                else {
                    this.logger.info("Found %d missing chunks compare to %s : %s", missingChunks.length, directoriesToCheck, missingChunks);
                    return this.getAllMetaData(missingChunks)
                }
            })
    }

    /*
     This function is parsing the metadata of all files
     */
    getAllMetaData(missingChunks) {
        function getMetaDataChunk(filePath) {
            this.logger.debug("About to parse meta data for the file %s", filePath)
            return qio.stat(filePath)
                .then((stats)=> {
                    if (!stats.size) {
                        this.logger.error("Zero bytes in file %s!", filePath)
                        return Q.reject()
                    }
                    return mp4Utils.extractMetadata(filePath)
                        .then((metaData)=> {
                                metaData.path = filePath
                                metaData.chunkName = path.basename(filePath)
                                this.logger.debug("Extract Metadata for %s: %s", filePath, JSON.stringify(metaData))
                                return Q.resolve(metaData)
                            },
                            (err)=> {
                                this.logger.error("Failed to get metadata for file %s: %s", filePath, ErrorUtils.error2string(err))
                                return Q.reject()
                            })
                })
        }

        return promUtils.runningArrayOfPromisesInBlocks(getMetaDataChunk.bind(this), 100, missingChunks)
            .then((results)=> {
                let errs = ErrorUtils.aggregateErrors(results);
                if (errs.numErrors > 0) {
                    this.logger.error("getMetaData: Failed to extract matadata for the chunks %s: %s", missingChunks, errs.err.message)
                }
                return this.removeFailurePromisesAndSort(results)
            })
    }

    linkFiles(Mp4Files, flavorId) {
        let Mp4FilesPath = _.map(Mp4Files, function (element) {
            return element.path;
        });
        this.logger.debug("LinkAndUpdateJson : %s", Mp4FilesPath)
        var promises = _.map(Mp4Files, (Mp4File)=> {
            let SourcefilePath = Mp4File.path;
            let chunkName = path.basename(Mp4File.path)
            if (flavorId == undefined) {
                flavorId = Mp4File.flavor
            }
            let DestFilePath = path.join(this.recordingSessionPath, flavorId, chunkName);

            return qio.link(SourcefilePath, DestFilePath)
                .then(()=> {
                    Mp4File.path = DestFilePath;
                    this.logger.debug("Linked %s to %s", chunkName, DestFilePath)
                    return Q.resolve(Mp4File)
                }, (err)=> {
                    if (err.code == 'EEXIST') { // if the error is the file exist...
                        this.logger.warn(" %s", err.message)
                        return Q.resolve()
                    }
                    else { //Otherwise return reject promise!
                        this.logger.error("%s ", ErrorUtils.error2string(err))
                        return Q.reject(ErrorUtils.error2string(err))
                    }
                })
        });
        return Q.allSettled(promises)
    }

    parseUpdateJsonResult(result) {
        _.each(result, (chunk)=> {
            if ('error' in chunk) {
                this.logger.error("Failed to add %s to playlist, %ss", chunk.chunkName, ErrorUtils.error2string(chunk.error))
            }

        })
    }

    removeFailurePromisesAndSort(results) {
        let Mp4FilesUpdated = _.reduce(results, (sum, promise)=> {
            if (promise.state == 'fulfilled' && promise.value) {
                sum.push(promise.value);
            }
            return sum;
        }, []);
        let Mp4FilesUpdatedSorted = _.sortBy(Mp4FilesUpdated, 'startTime')
        return Q.resolve(Mp4FilesUpdatedSorted)
    }

    updateJson(Mp4Files) {
        let chunksNameChained = _.reduce(Mp4Files, (str, obj)=> {
            return str + obj.chunkName + " ";
        }, "");
        this.logger.debug("About to update chunks: %s", chunksNameChained)
        return Q.allSettled(this.playlistGenerator.update(Mp4Files))
            .then(()=> {
                this.parseUpdateJsonResult(Mp4Files)
                return Q.resolve(chunksNameChained)
            })
    }

    updateRecordingFiles(newMp4Files, flavorId) {
        this.mp4FilesQueue.push({newMp4Files, flavorId});
        if (this.mp4FilesQueueLock) {
            this.logger.debug(`Queue is locked. Not updating playlist! queue size: [${this.mp4FilesQueue.length}]`);
            return;
        }
        while (this.mp4FilesQueue.length) {
            // Array.shift() pop the first element of the array, just like in a queue
            let firstInLine = this.mp4FilesQueue.shift();
            this.linkAndUpdateJson(firstInLine.newMp4Files, firstInLine.flavorId);
        }
    }

    linkAndUpdateJson(Mp4Files, flavorId) {
        let deferred = Q.defer();
        this.serializedActionsPromise = this.serializedActionsPromise
            .finally(()=> {
                return this.linkAndUpdateJsonSerialize(Mp4Files, flavorId)
                    .finally(()=> {
                        deferred.resolve();
                    })
            });
        return deferred.promise
    }

    linkAndUpdateJsonSerialize(Mp4Files, flavorId) {
        return this.linkFiles(Mp4Files, flavorId)
            .then((results) => { //todo check why no error trow when try to acess non existing elemnt in promise
                return this.removeFailurePromisesAndSort(results)
            })
            .then((Mp4FilesUpdated) => {
                if (flavorId != undefined) {
                    this.flavorsChunksCounter[flavorId] = this.flavorsChunksCounter[flavorId] + Mp4FilesUpdated.length
                }
                return this.updateJson(Mp4FilesUpdated)
            })
            .then(()=> {
                return this.updateEntryDuration(false)
            })
            .then(()=> {
                let currentTime = new Date();
                return this.checkIfRecordedEntryIdChanged(currentTime);
            })
            .catch((err) => {
                this.logger.error("Error occurred while trying to add new chunks: %s", ErrorUtils.error2string(err));
                // Only method that calls this function is linkAndUpdateJson (above), and serializedActionsPromise cannot be rejected.
                return Q.resolve();
            })

    }

    changeRecordedEntry(recordedEntryId) {
        this.entryObject.recordedEntryId = recordedEntryId;
        this.recordingSessionId = `[${this.entryObject.entryId}-${recordedEntryId}] `;
        this.recordingSessionPath = this.getRecordingSessionPath(recordedEntryId);
        this.logger = loggerBase.getLogger('RecordingEntrySession', `${this.recordingSessionId}`);
        return this.playlistGenerator.setBasePath(this.recordingSessionPath);
    }

    checkIfRecordedEntryIdChanged(currentTime) {
        let timeElapsed = Math.abs(currentTime.getTime() - this.lastGetRecordedEntryIdTime.getTime());

        if (timeElapsed >= getEntryInfoIntervalMSec) {
            this.lastGetRecordedEntryIdTime = currentTime;
            return this.sync.exec(()=> {
                return backendClient.getEntryInfo(this.entryObject.entryId)
                    .then((entryObj) => {
                        if (entryObj.recordedEntryId != this.entryObject.recordedEntryId) {
                            this.logger.info(`recordedEntryId changed to [${entryObj.recordedEntryId}]. Recording will stop and a new session will start using [${entryObj.recordedEntryId}]`);
                            // split recording done on remote DC need to do it in local DC as well
                            this.splitRecordingRequired = true;
                            this.replacementEntryObj = entryObj;
                            return Q.resolve();
                        }
                    })
                    .catch((err) => {
                        return Q.resolve(err);
                    });
            });
        }
    }


    verifyFlavorSetMatchPlaylistFlavors(newEntryObj) {
        //create playlist  json
        let options = {
            'recording': true,
            'recordingSessionPath': this.recordingSessionPath
        };

        var playlist = new PlaylistGenerator(this.entryObject, options);

        return playlist.initializeStart()
            .then(() => {
                return playlist.getFlavors();
            })
            .then((flavorsFromPlaylist)=> {
                if (flavorsFromPlaylist == null) {
                    Q.reject(`error, failed to get flavors from playlist!!!`);
                }
                let newFlavorNames = _.map(newEntryObj.flavorsObjArray, function (newFlavorDir) {
                    return newFlavorDir.name;
                });
                // check if flavors match current provisioned flavors
                if (flavorsFromPlaylist.length != newFlavorNames.length) {
                    this.logger.debug(`found flavors mismatch, previous: [${flavorsFromPlaylist}] current: [${newFlavorNames}]`);
                    return false;
                }
                // check if there are same number of flavors but not same set.
                // this situation is impossible maybe it's not relevant to check.
                let commonFlavors = _.intersection(flavorsFromPlaylist, newFlavorNames);
                if (commonFlavors.length != flavorsFromPlaylist.length) {
                    this.logger.debug(`found flavors set has same size but flavors differ, previous: [${flavorsFromPlaylist}] current: [${newFlavorNames}]`);
                    return false;
                }

                return true;
            })
            .catch((err) => {
                if (err instanceof Error && err.code !== 'ENOENT') {
                    this.logger.error(`Failed to read [${this.recordingSessionPath}]. Error: ${ErrorUtils.error2string(err)}`);
                    return Q.reject(err);
                }
                else
                    return Q.resolve(true);
            })
    }

    updateRecordingStatus(recordingStatus) {
        let status = recordingStatus == kalturaTypes.KalturaEntryServerNodeRecordingStatus.ON_GOING ? "ON_GOING" : "STOPPED";
        return this.sync.exec(()=> {
            return backendClient.updateRecordingStatus(this.entryObject.entryId, this.entryServerNodeId, recordingStatus)
                .then(()=> {
                    this.logger.info(`Successfully updated recording status to [(${recordingStatus}):${status}]`);
                })
                .catch((err)=> {
                    this.logger.debug(`Failed to update recordingStatus to [(${recordingStatus}):${status}], [entryServerNodeId:${this.entryServerNodeId}]. Error: ${ErrorUtils.error2string(err)}`);
                    // don't fail recording flow on error
                    return Q.resolve();
                })
        });
    }

}

module.exports = RecordingEntrySession