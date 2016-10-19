            /**
             * Created by ron.yadgar on 17/07/2016.
             */
            const Q = require('q');
            const logger = require('../common/logger').getLogger("RecordingManager");
            const util = require('util');
            const events = require("events");
            const config = require('./../common/Configuration');
            const qio = require('q-io/fs');
            const path = require('path');
            const _ = require('underscore');
            const glob = require('glob');
            const ErrorUtils = require('./utils/error-utils');
            const backendClient = require('./BackendClientFactory.js').getBackendClient();
            const PlaylistGenerator = require('./playlistGenerator/PlaylistGenerator');
            const mp4Utils = require('./utils/mp4-utils.js');
            const PersistenceFormat = require('../common/PersistenceFormat.js');
            const pGlob = Q.denodeify(glob);



            class RecordingEntrySession {
                constructor(entryObj, flavorsObjArray){

                    const recordingRootPath = config.get('recordingFolderPath');
                    const createPlaylistGenerator = (entryObj, flavors) => {
                        //create playlist  json
                        let options = {
                            'recording': true,
                            'recordingSessionPath': recordingSessionPath
                        }
                        if (flavors) {
                            options.flavors = flavors
                        }
                        return new PlaylistGenerator(entryObj, options) //todo whats happen if json exist?
                    }

                    let now = new Date()
                    let entryId = entryObj.entryId;
                    let recordedEntryId = entryObj.recordedEntryId;
                    let recordingSessionDuration = entryObj.recordingSessionDuration
                    let recordingSessionPath = path.join(recordingRootPath, entryId, entryObj.recordedEntryId)
                    logger.info("[%s-%s] Starting a new recording session", entryId, recordedEntryId);
                    this.flavors = _.map(flavorsObjArray, (flavorObj)=>{
                        return flavorObj.name
                    });
                    this.recordingSessionDuration = recordingSessionDuration;
                    this.lastTimeUpdateChunk = now;
                    this.recordedEntryId = recordedEntryId;
                    this.recordingSessionPath = recordingSessionPath;
                    this.playlistGenerator = createPlaylistGenerator(entryObj, recordingSessionPath) //todo check that its not passed the limit
                    this.duration = this.playlistGenerator.getTotalDuration() / 1000 //todo maybe should wait to initialize???
                    this.recordingSessionId = entryId + '-' + recordedEntryId

                }
                accessibleRecording () {
                    /*
                     Create manifest,and then crate symbolic link to live
                     */
                    return this.playlistGenerator.initializeStart().then(()=> {
                        return this.playlistGenerator.finalizeStart().then(()=> {
                            let accessibleRecordingFolder = PersistenceFormat.getEntryBasePath(this.recordedEntryId)
                            return qio.exists(accessibleRecordingFolder).then((isExist)=> {
                                if (!isExist) {
                                    logger.info("[%s] Accessible recording", this.recordingSessionId)
                                    return qio.symbolicLink(accessibleRecordingFolder, this.recordingSessionPath, 'directory')
                                }
                            })
                        })
                    })
                }

                /*
                 In order to check that all chunks in live directory exist in recording, we check first that all chunks in recording are in json
                 */
                restoreSession() {

                    return this.accessibleRecording() //in order to check if file exist, first need to load Json form disk
                        .then(()=>{
                            return this.checkFilesFromRecordingFolder()
                        })
                        .then(()=> {
                            return this.checkFilesFromLiveFolder()
                        })
                        .then(()=>{
                            logger.info("[%s] restoreSession finished", this.recordingSessionId)
                        })
                        .catch((err)=>{ // todo why if accessibleRecording is failed, not catch it
                            logger.error("[%s] Failed to restore session : %s", this.recordingSessionId, ErrorUtils.error2string(err))
                        })
                }
                checkMissingChunks  (downloadedChunks) {
                    let missingChunks = [];
                    _.each(downloadedChunks, (filePath)=> {
                        let fileName = path.basename(filePath);
                        if (!this.playlistGenerator.checkFileExists(fileName)) {
                            //    if (!stats.size) {
                            //        that.logger.warn("Zero size file! Adding %s to chunksToDownload", fileName);
                            //      that.downloadedChunks[fileName] = true;
                            logger.info("[%s] checkMissingChunks: Found chunk %s missing on playList: path %s", this.recordingSessionId, fileName, filePath)
                            missingChunks.push(filePath)
                        }
                    })
                    return missingChunks
            }

                checkFilesFromLiveFolder (){
                    let liveEntryPath = PersistenceFormat.getEntryBasePath(this.entryId);
                    return pGlob(path.join(liveEntryPath, '*/*/*.mp4')).then((downloadedChunks)=> { //todo should verify that pglobe is giving the chunks in right order
                        let missingChunks = this.checkMissingChunks(downloadedChunks)
                        if (missingChunks.length == 0) {
                            logger.debug("[%s] checkFilesFromLiveFolder: No missing chunks found", this.recordingSessionId)
                            return Q.resolve()
                        }
                        else {
                            //should create hard link and then add to json
                            logger.debug("[%s] checkFilesFromLiveFolder: Found %d missing chunks %s ", this.recordingSessionId, missingChunks.length, missingChunks)
                            return this.getMetaData(missingChunks)
                                .then((Mp4Files)=> {
                                    return this.LinkAndUpdateJson( Mp4Files)
                                })
                        }
                    })
            }

                /*
                 This funcion check that all file in recording directory are also in Json, Otherwise, calling addFileToJson
                 */
                checkFilesFromRecordingFolder(){ //todo should verify that json is update on the main object!!!

                    return pGlob(path.join(this.recordingSessionPath, '*/*.mp4'))
                        .then( (downloadedChunks) =>{
                            let missingChunks = this.checkMissingChunks(downloadedChunks)
                            if (missingChunks.length == 0) {
                                logger.debug("[%s] checkFilesFromRecordingFolder: No missing chunks found (compare to Live directory) for recorded session id", this.recordingSessionId)
                                return Q.resolve()
                            }
                            else {
                                return this.getMetaData(missingChunks).then((chunksToUpdate)=> {
                                    logger.debug("[%s] checkFilesFromRecordingFolder: About to update chunks %s in json for recorded session id", this.recordingSessionId, missingChunks)
                                    return this.playlistGenerator.update(chunksToUpdate)
                                })
                                    .then(()=> {
                                        logger.info("[%s] checkFilesFromRecordingFolder: Successfully add chunks %s.", this.recordingSessionId, missingChunks)
                                        return Q.resolve() // return resolve anyway!
                                    })

                            }
                        })
            }

                /*
                 This function is parsing the metadata of all files
                 */
                getMetaData(missingChunks) {
                    logger.debug("[%s] About to parse meta data for the file %s", this.recordingSessionId, missingChunks) //todo verify that all chunks are sorted
                    let updateChunksPromises = _.map(missingChunks, function (filePath) {
                        return mp4Utils.extractMetadata(filePath)
                            .then((metaData)=> {
                                    metaData.path = filePath
                                    metaData.flavor = path.basename(path.dirname(filePath))
                                    logger.debug("[%s] extractMetadata for %s: %s", this.recordingSessionId, filePath, JSON.stringify(metaData))
                                    return Q.resolve(metaData)
                                },
                                (err)=> {
                                    logger.error("Failed to get metadata for file %s: %s", filePath, ErrorUtils.error2string(err))
                                })
                    })
                    return Q.allSettled(updateChunksPromises).then((results)=> {
                        let errs = ErrorUtils.aggregateErrors(results);
                        if (errs.numErrors > 0) {
                            logger.error("[%s] checkAndAddFileToJson: Failed to extract matadata for the chunks %s: %s", this.recordingSessionId, missingChunks, errs.err.message)
                            results = _.filter(results, function (p) {
                                return (p.state !== 'fulfilled')
                            }); //remove all failed promise
                        }
                        let resultsValue = _.map(results, function (result) {
                            return result.value
                        })
                        let resultsValueSorted = _.sortBy(resultsValue, 'startTime')
                        return Q.resolve(resultsValueSorted) // return resolve anyway!
                    })
            }

                LinkAndUpdateJson(Mp4Files) {
                    var promises = _.map(Mp4Files, function (Mp4File) {
                        let SourcefilePath = Mp4File.path;
                        let chunkName = path.basename(Mp4File.path)
                        let arrayPath = Mp4File.path.split(path.sep);
                        let flavorId = arrayPath[arrayPath.length - 3];
                        let DestFilePath = path.join(recordingSessionPath, flavorId, chunkName);

                        return qio.link(SourcefilePath, DestFilePath)
                            .then(()=> { //todo should verify that if we links a then b, then the callback is also be at the same order, so it will add to json with the same order
                                Mp4File.path = DestFilePath;
                                logger.debug("[%s] Linked %s to %s", this.recordingSessionId, chunkName, DestFilePath)
                                return Q.resolve(Mp4File)
                            }, (err)=> {
                                if (err.code == 'EEXIST') { // if the error is the file exist...
                                    logger.warn("[%s] %s", this.recordingSessionId, err.message)
                                    return Q.resolve()
                                }
                                else { //Otherwise return reject promise!
                                    logger.error("[%s] %s ", this.recordingSessionId, ErrorUtils.error2string(err))
                                    return Q.reject(ErrorUtils.error2string(err))
                                }
                            })
                    });

                    return Q.allSettled(promises).then( (results) => { //todo check why no error trow when try to acess non existing elemnt in promise
                        let Mp4FilesUpdated = _.reduce(results, (sum,promise)=> {
                            if (promise.state=='fulfilled' && promise.value) {
                                sum.push(promise.value);
                            }
                            return sum;
                        },[]);
                        return Q.resolve(Mp4FilesUpdated)
                    })
                        .then((Mp4FilesUpdated) =>{
                            let chunksNameChained = _.reduce(Mp4FilesUpdated, function (str, obj) {
                                return str + obj.chunkName + " ";
                            }, "");
                            logger.debug("[%s] About to update chunks: %s", this.recordingSessionId, chunksNameChained)
                            return this.playlistGenerator.update(Mp4FilesUpdated);
                        })
                        .catch( (err) =>{
                            logger.error("[%s] Error occurred while try to add new chunks: %s", this.recordingSessionId, ErrorUtils.error2string(err));
                            return Q.reject(err);
                        })

            }





            }

            class RecordingManager {
                //todo what to do if we stop stream and start, but other machine has start to get it
                //todo move all path join baseName etc to persistent format
                //todo check zero bytes only in staring or each one?
                //todo start recording on flavordownlowner, check
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

                    const recordingTimeInterval = config.get("recordingTimeInterval");
                    const completedRecordingFolderPath = config.get("completedRecordingFolderPath");
                    const recordingMaxDuration = config.get('recordingMaxDuration')
                    const recordingList = {};

                    logger.info("Initializing recording manager");





                    const startRecording = (entryObj, flavorsObjArray) => {


                        let recordingEntrySession
                        let entryId = entryObj.entryId
                        if (!recordingList[entryId]) { // if this flavor is the first todo check that no race between flavor
                            recordingEntrySession = RecordingEntrySession(entryObj, flavorsObjArray)
                            recordingList[entryId] = recordingEntrySession
                        }
                        else{
                            logger.info("[%s-%s] Found a previous recording session.", entryObj.entryId, entryObj.recordedEntryId)
                            recordingEntrySession = recordingList[entryId]
                            //todo what todo? should check that no configuarion changed?
                        }
                        let recordingSessionPath = recordingEntrySession.recordingSessionPath;
                        return qio.exists(recordingSessionPath).then((sessionExist)=>{
                            if (sessionExist){
                                let doneFilePath = path.join(recordingSessionPath, 'done');
                                return qio.exists(doneFilePath).then((fileDoneExist)=> {
                                    if (fileDoneExist) {
                                        logger.debug("[%s-%s] file done exist, remove it ", entryObj.entryId, entryObj.recordedEntryId)
                                        return qio.remove(doneFilePath)
                                    }
                                    else{
                                        logger.warn("[%s-%s] file done is not exist, check for restoration", entryObj.entryId, entryObj.recordedEntryId)
                                        return recordingSessionPath.restoreSession()
                                    }
                                })
                            }
                            else{
                                return qio.makeTree(recordingSessionPath)
                            }
                        }).then(()=>{
                            logger.debug("[%s-%s] About to create directories %s", entryObj.entryId, entryObj.recordedEntryId, recordingSessionPath.flavors)
                           let creatingDirectroriesPromise = _.map(recordingSessionPath.flavors, (flavorId)=>{
                               let flavorPath = path.join(recordingSessionPath.recordingSessionPath, flavorId)
                               return qio.makeDirectory(flavorPath)
                           })
                           return Q.allSettled(creatingDirectroriesPromise)
                        })
                            .then((results)=>{
                              //todo should check for error
                                _.each(results,(promise)=>{
                                    if (promise.state === 'rejected'){
                                        if (promise.reason && promise.reason.code === 'EEXIST'){
                                            logger.debug("[%s-%s] path %s already exist", entryObj.entryId, entryObj.recordedEntryId, promise.reason.path)
                                        }
                                        else{
                                            logger.error("[%s-%s] Failed to make directory %s", entryObj.entryId, entryObj.recordedEntryId, ErrorUtils.error2string(promise.reason))
                                        }
                                    }
                                })
                                return accessibleRecording(recordingEntrySession.playlistGenerator, entryId, entryObj.recordedEntryId, recordingSessionPath)
                            })

                        /*
                        return qio.makeTree(recordingSessionSourcePath)
                            .then(()=> {
                                return createManifestPromise
                            })
                            .then(()=> {
                                let doneFilePath = path.join(recordingSessionSourcePath, 'done')
                                return qio.exists(doneFilePath)
                                    .then((fileDoneExist)=> {
                                        if (fileDoneExist) {
                                            logger.info("[%s-%s] Found a previous recording session.", entryObj.entryId, entryObj.recordedEntryId)
                                            //todo should update recording duration
                                            return qio.remove(doneFilePath)
                                                .catch((err)=> {
                                                    logger.warn('Failed to remove done file at %s : %s', fileDoneExist, ErrorUtils.error2string(err))
                                                })
                                        }
                                    })
                            })// })
                            */
                    }

                    const addNewChunks = (Mp4Files, entryId, duration) => {

                        let recordingEntrySession
                        let chunksNameChained = _.reduce(Mp4Files, function (str, obj) {
                            return str + obj.chunkName + " ";
                        }, "");

                        if (!recordingList[entryId]) {
                            logger.warn("Recording of entry %s is not exist on recording list ", entryId);
                            return
                        }

                        if (recordingList[entryId].duration > recordingMaxDuration) {
                            logger.warn("Recording %s of entry %s has passed the limit of recording duration - %s seconds", recordingList[entryId].recordedEntryId, entryId, recordingList[entryId].duration)
                            return;
                        }

                        recordingEntrySession = recordingList[entryId]

                        let recordedEntryId = recordingEntrySession.recordedEntryId;
                        logger.info("[%s-%s] Receiving new chunks :%s", entryId, recordedEntryId, chunksNameChained);

                        // update lastTimeUpdateChunk
                        recordingList[entryId].lastTimeUpdateChunk = new Date();

                        return recordingEntrySession.linkAndUpdateJson(Mp4Files)
                    }

                    const handleRecordingEntries = () => {
                        try {
                            let now = new Date();
                            logger.debug("Check for end recording session");
                            _.each(recordingList, function (element, entryId) {
                                logger.debug("[%s-%s] handleRecordingEntries-  now:%s, element: %j", entryId, element.recordedEntryId, now, element)
                                if (now - element.lastTimeUpdateChunk > element.recordingSessionDuration) {
                                    logger.info("[%s-%s] recording  didn't get new chunks for %d - stop recording", entryId, element.recordedEntryId, element.recordingSessionDuration);
                                    stopRecording(entryId, element.recordedEntryId, element.recordingSessionPath)
                                }
                            });
                            logger.info("Available recording entry: %j", _.keys(recordingList));
                        } catch (err) {
                            logger.error("Error while trying to run handleRecordingEntries: %s ", ErrorUtils.error2string(err))
                        }
                    }

                    const stopRecording = (entryId, recordedEntryId, recordingSessionPath) => {

                        let now = new Date().getTime().toString()
                        let destFilePath = path.join(completedRecordingFolderPath, entryId + '_' + recordedEntryId + '_' + now);
                        return qio.symbolicLink(destFilePath, recordingSessionPath, 'directory')
                            .then(function () {
                                delete recordingList[entryId];
                                logger.info("[%s-%s] Successfully create soft link from %s, into %s", entryId, recordedEntryId, recordingSessionPath, destFilePath);
                                return Q.resolve()
                            })
                            .then(function () {
                                let doneFilePath = path.join(recordingSessionPath, 'done')
                                return qio.write(doneFilePath, 'done')
                            })
                            .catch(function (err) {
                                logger.error(ErrorUtils.error2string(err))
                            })

                    }

            /*
                    const onStartUp = ()=> { // onsttartup  finish before open new entry downloaders!

                        const getEntryObject = (entryId)=> {
                            return backendClient.getEntryInfo(entryId)
                        };

                        const getLastUpdateChunk = (DirectoryPath) => {

                            return qio.stat(DirectoryPath).then((fileStat) => {
                                let lastModifiedSessionDir = fileStat.node.mtime.getTime()
                                return lastModifiedSessionDir  // retutn two valued
                            })
                        }



                        const getFlavors = (entryObj, recordingEntryPath)=> { //todo what happen if promise faied?
                            let recordedEntryId = entryObj.recordedEntryId; //todo what happen if not exist?
                            return pGlob(path.join(recordingEntryPath, recordedEntryId, '*')).then((flavorListPath)=> {
                                let flavorList = []
                                _.each(flavorListPath, function (flavorPath) {
                                    let flavorId = path.basename(flavorPath);
                                    flavorList.push(flavorId)
                                })
                                return Q.resolve(flavorList)
                            })
                        }

                        const addToRecordingList = (entryObj, recordingSessionPath, playlistGenerator, now, flavorList)=> {

                            recordingList[entryObj.entryId] = {
                                "recordingSessionDuration": entryObj.recordingSessionDuration,
                                "lastTimeUpdateChunk": now,
                                'recordedEntryId': entryObj.recordedEntryId,
                                "recordingSessionPath": recordingSessionPath,
                                "playlistGenerator": playlistGenerator,
                                'flavors': flavorList,
                                'duration': playlistGenerator.getTotalDuration() / 1000, //since value is return in millisecond
                            }
                            let objectAsString = JSON.stringify(recordingList[entryObj.entryId])
                            logger.debug("[%s-%s] addToRecordingList: %s", entryObj.entryId, entryObj.recordedEntryId, objectAsString)
                        }
                        let startTime = new Date();
                        return pGlob(path.join(recordingRootPath, '*')) // get all folders in recording dir
                        //todo add entry id pattern to regex?
                            .then((recordedEntryList)=> {

                                let now = new Date();
                                let CheckRecordedEntryPromises = _.map(recordedEntryList, function (recordingEntryPath) {
                                    //let deferred = Q.defer();
                                    try {
                                        let entryId = path.basename(recordingEntryPath)
                                        return getEntryObject(entryId)
                                            .then((entryObj)=> {
                                                let recordedEntryId = entryObj.recordedEntryId; //todo what happen if not exist?
                                                return getFlavors(entryObj, recordingEntryPath).then((flavorList)=> {
                                                    logger.debug("[%s-%s] onStartUp: Found recording session, flavors %s", entryId, recordedEntryId, flavorList)
                                                    let source = findSourceStreamId(flavorList)
                                                    if (source == -1) {
                                                        let msg = '[' + entryId + '-' + recordedEntryId + '] Source not found'
                                                        return Q.reject(msg)
                                                    }
                                                    let recordingSessionPath = path.join(recordingEntryPath, recordedEntryId);
                                                    let recordingSessionSourcePath = path.join(recordingSessionPath, source);
                                                    let LastUpdateChunkPromise = getLastUpdateChunk(recordingSessionSourcePath);
                                                    let doneExistPromise = qio.exists(path.join(recordingSessionSourcePath, 'done'));
                                                    return Q.all([LastUpdateChunkPromise, doneExistPromise]).then((results)=> { //todo if faied return reject promice
                                                        let lastTimeUpdateChunk = results[0];
                                                        let fileDoneExist = results[1];
                                                        if (fileDoneExist) {
                                                            logger.debug("[%s-%s] onStartUp:  Recording session , is already handled - file done exist.", entryId, recordedEntryId)
                                                            return Q.resolve()
                                                        }
                                                        let playlistGenerator = createPlaylistGenerator(entryObj, recordingSessionPath, flavorList)
                                                        return accessibleRecording(playlistGenerator, entryId, recordedEntryId, recordingSessionPath).then(()=> {
                                                            return checkAndGetMissionChunks(liveEntryPath, recordingSessionPath, entryId + '-' + recordedEntryId, playlistGenerator).then(()=> { //should be continiue even if we failed!
                                                                logger.info("[%s-%s] About to check if session is still open, now-%d, lastTimeUpdateChunk-%d, diff:%d sec, sessionDuration: %d sec", entryId, recordedEntryId, now, lastTimeUpdateChunk, (now - lastTimeUpdateChunk) / 1000, entryObj.recordingSessionDuration / 1000)
                                                                if (now - lastTimeUpdateChunk > entryObj.recordingSessionDuration) {    // if session is expired, move directory
                                                                    logger.info("[%s-%s] onStartUp: recorded entry didn't get new chunk for %d seconds- stop recording", entryId, recordedEntryId, entryObj.recordingSessionDuration / 1000);
                                                                    return stopRecording(entryId, recordedEntryId, recordingSessionSourcePath)
                                                                }
                                                                else {
                                                                    logger.info("[%s-%s] onStartUp: Found that recorded entry is still on open session mode, add to the list", entryId, recordedEntryId)
                                                                    addToRecordingList(entryObj, recordingSessionPath, playlistGenerator, now, flavorList)
                                                                    //deferred.resolve()
                                                                    return Q.resolve()
                                                                }
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                    }
                                    catch (err) {
                                        return Q.reject(ErrorUtils.error2string(err))
                                    }
                                    //  return deferred.promise
                                })
                                return Q.allSettled(CheckRecordedEntryPromises).then(function (results) {
                                    const errs = ErrorUtils.aggregateErrors(results);
                                    if (errs.numErrors > 0) {
                                        logger.error("onStartUp failed!: %s", errs.err.message)
                                    }
                                    else {
                                        let totalTime = (new Date() - startTime) / 1000;
                                        logger.info("onStartUp finish successfully, taken %s seconds", totalTime)
                                    }
                                })
                            })
                            .catch(function (err) {
                                logger.error(ErrorUtils.error2string(err));
                            })
                    }
            */
                    this.startRedording = startRecording
                    this.addNewChunks = addNewChunks
                    setInterval(handleRecordingEntries, recordingTimeInterval)
                }

            }
            module.exports = new RecordingManager();
