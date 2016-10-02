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
const backendClient=require('./BackendClientFactory.js').getBackendClient();
const PlaylistGenerator = require('./playlistGenerator/PlaylistGenerator');
class RecordingManager {
    //todo what to do if we stop stream and start, but other machine has start to get it
    //
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
        const pGlob = Q.denodeify(glob);
        const recordingTimeInterval = config.get("recordingTimeInterval");
        const completedRecordingFolderPath = config.get("completedRecordingFolderPath");
        const recordingRootPath = config.get('recordingFolderPath');
        const liveFolderPath = config.get('rootFolderPath');
        const recordingMaxDuration = config.get('recordingMaxDuration')
        const recordingList = {};

        logger.info("Initializing recording manager");

        const createPlaylistGenerator = (entryObj, recordingSessionPath, flavors) =>{
            //create playlist  json
            let options = {
                'recording' : true,
                'recordingSessionPath': recordingSessionPath
            }
            if (flavors){
                options.flavors = flavors
            }
           return new PlaylistGenerator(entryObj, options) //todo whats happen if json exist?
        }

        const accessibleRecording = (playlistGenerator ,recordedEntryId, recordingSessionPath) =>{
            /*
             Create manifest,and then crate symbolic link to live
             */
            return playlistGenerator.initializeStart().then(()=>{
                return playlistGenerator.finalizeStart().then(()=>{
                    let accessibleRecordingFolder = path.join(liveFolderPath, recordedEntryId)
                    return qio.exists(accessibleRecordingFolder).then((isExist)=>{
                        if (!isExist){
                            logger.info("Accessible recording entry %s", recordedEntryId)
                            return qio.symbolicLink(accessibleRecordingFolder, recordingSessionPath, 'directory')
                        }
                    })
                })
            })
        }

        const startRecording =  (entryObj, flavorId) => {

            let recordingSessionPath;
            let entryId = entryObj.entryId
            let createManifestPromise = Q.resolve()
            if (!recordingList[entryId]) { // if this flavor is the first todo check that no race between flavor
                let now = new Date()
                logger.info("Starting a new recording session for entry  %s", entryId);
                //todo recordingSessionPath =  path.join(recordingRootPath,_.last(entryId), entryId, entryObj.recordedEntryId)
                recordingSessionPath =  path.join(recordingRootPath, entryId, entryObj.recordedEntryId)
               recordingList[entryId]  = {
                   "recordingSessionDuration": entryObj.recordingSessionDuration,
                   "lastTimeUpdateChunk": now,
                   'recordedEntryId': entryObj.recordedEntryId,
                   "recordingSessionPath": recordingSessionPath,
                   'flavors': [flavorId],
                   "duration": 0
               }
                let playlistGenerator = createPlaylistGenerator(entryObj, recordingSessionPath) //todo check that its not passed the limit
                recordingList[entryId].playlistGenerator = playlistGenerator
                recordingList[entryId].duration = playlistGenerator.getTotalDuration() //todo maybe should wait to initialize???
                createManifestPromise = accessibleRecording(playlistGenerator ,entryObj.recordedEntryId, recordingSessionPath)
            }
            else{
                recordingList[entryId].flavors.push(flavorId)
            }

            let recordingSessionSourcePath = path.join(recordingList[entryId].recordingSessionPath, flavorId);
            return qio.makeTree(recordingSessionSourcePath)
                .then(()=> {
                    return createManifestPromise
                })
                .then(()=> {
                    let doneFilePath = path.join(recordingSessionSourcePath, 'done')
                    return qio.exists(doneFilePath)
                        .then((fileDoneExist)=> {
                            if (fileDoneExist) {
                                logger.info("Found previous recording session for entry: %s", entryObj.entryId)
                                if (recordingList[entryId].duration  > recordingMaxDuration){
                                    logger.info("Recorded entry %s passed the maximum length of recording session", recordingList[entryId].recordedEntryId) //todo checkit
                                    return
                                }
                                return qio.remove(doneFilePath)
                                    .catch((err)=> {
                                        logger.warn('Failed to remove done file at %s : %s', fileDoneExist, ErrorUtils.error2string(err))
                                    })
                            }
                        })
                })
        }

        const addNewChunks =  (Mp4Files, entryId, flavorId, duration) =>{

            const checkForErrors = (results, entryId) => {
                const errs = ErrorUtils.aggregateErrors(results);
                if (errs.numErrors === results.length) {

                    throw new Error("Failed to start entry recording for entry: "+entryId+". All chunks link failed: "+ErrorUtils.error2string(errs.err));
                }
                if (errs.numErrors > 0) {
                    // Report an error (but proceed) if only some flavor downloaders could not be started
                    logger.error("Failed  to link chunk:  %s ", ErrorUtils.error2string(errs.err));
                }
            }



            let chunksNameChained = _.reduce(Mp4Files, function(str, obj){ return str+ obj.chunkName+ " " }, "")
            logger.info("Receiving new chunks from %s :%s", entryId, chunksNameChained);

            if (! recordingList[entryId]){
                logger.warn("Recording of entry %s is not exist on recording list ", entryId)
                return
            }
            if (recordingList[entryId] && recordingList[entryId].duration > recordingMaxDuration){
                logger.warn("Recording %s of entry %s has passed the limit of recording duration - %s seconds", recordingList[entryId].recordedEntryId, entryId, recordingList[entryId].duration)
                return //todo checkit
            }

            // update lastTimeUpdateChunk
            recordingList[entryId].lastTimeUpdateChunk = new Date();
            let recordingSessionSourcePath = path.join(recordingList[entryId].recordingSessionPath, flavorId);

            // generate hard link for each of the file!
            var promises = _.map(Mp4Files, function (Mp4File) {
                let SourcefilePath = Mp4File.path;
                let chunkName = path.basename(Mp4File.path)
                let DestFilePath = path.join(recordingSessionSourcePath, chunkName);
                return qio.link(SourcefilePath, DestFilePath).then(()=>{
                    Mp4File.path = DestFilePath
                })
            });
            return Q.allSettled(promises).then(function (results) {
                    checkForErrors(results, entryId);
                })
                .then(function () {
                    return recordingList[entryId].playlistGenerator.update(Mp4Files);
                })
                .then(function () {
                    recordingList[entryId].lastTimeUpdateChunk = new Date();
                    if ( flavorId == findSourceStreamId(recordingList[entryId].flavors)){
                        recordingList[entryId].duration = recordingList[entryId].duration + duration
                    }

                })
                .catch(function (err) {
                    logger.error("Error occurred while try to add new chunks for entry %s: %j", entryId, ErrorUtils.error2string(err));
                    return Q.reject(err);
                })
        }

        const handleRecordingEntries =  () => {
            try {
                let now = new Date();
                logger.debug("Check for end recording session");
                _.each(recordingList, function (element, entryId) {
                    if (now - element.lastTimeUpdateChunk > element.recordingSessionDuration) {
                        logger.info("recording for entry %s didn't get new chunk for %d - stop recording", entryId, element.recordingSessionDuration);
                        let source = findSourceStreamId(element.flavors);
                        if (source == -1){
                            logger.error("Error while trying to find source stream of "+entryId+" from flavor list "+element.flavors)
                            return
                        }
                        let recordingSessionSourcePath = path.join(element.recordingSessionPath, source);
                        stopRecording(entryId, element.recordedEntryId, recordingSessionSourcePath)
                    }
                });
                logger.debug("Available recording entry: %j", _.keys(recordingList));
            } catch (err) {
               logger.error("Error while trying to run handleRecordingEntries: %s ", ErrorUtils.error2string(err))
            }
        }

        const findSourceStreamId = (flavorList) =>{
            if (flavorList.length > 0)
                return flavorList.min()
            //otherwise throw error
            return -1
        }

        const stopRecording = (entryId, recordedEntryId, recordingSessionSourcePath) =>{

            let now = new Date().getTime().toString()
            let destFilePath = path.join(completedRecordingFolderPath, entryId +'_' + recordedEntryId + '_' +now);
            qio.symbolicLink(destFilePath, recordingSessionSourcePath, 'directory')
                .then(function(){
                    let doneFilePath = path.join(recordingSessionSourcePath, 'done')
                    qio.write(doneFilePath, 'done')
                })
                .then(function () {
                        delete recordingList[entryId];
                        logger.info("Successfully create soft link from %s, into %s", recordingSessionSourcePath, destFilePath);
                        return Q.resolve()
                    })
                .catch(function (err) {
                    logger.error(ErrorUtils.error2string(err))
                })
        }


        const onStartUp = ()=> { // onsttartup  finish before open new entry downloaders!

            const getEntryObject = (entryId)=> {
                return backendClient.getEntryInfo(entryId)
            };

            const getLastUpdateChunk = (DirectoryPath) => {
                /*
                last update chunk is in fact, the last time where the directory has been changed.
                However, note that the last is true, only with the assumption that no action on the folder is  done
                except insert
                 */
                return qio.stat(DirectoryPath).then((fileStat) => {
                                let lastModifiedSessionDir =fileStat.node.mtime.getTime()
                                return lastModifiedSessionDir  // retutn two valued
                            })
            }

            const checkAndGetMissionChunks = (liveEntryPath, recordingSessionPath, entryId, playlistGenerator) => {//todo should be for all flavors
                return checkAndAddFileToJson(recordingSessionPath, playlistGenerator, entryId).then(()=>{
                        return pGlob(path.join(liveEntryPath, '*/*/*.mp4')).then((downloadedChunks)=> {
                                let missingChunks = [];
                                _.each(downloadedChunks,  (filePath)=> {
                                    let fileName = path.basename(filePath);
                                    if (! playlistGenerator.checkFileExists(fileName)) {
                                        logger.info("checkAndGetMissionChunks: Found chunk exist on live directroy but missing on recording directory")
                                        missingChunks.push(filePath)
                                    }
                                })
                                if (missingChunks.length == 0){
                                    logger.debug("checkAndGetMissionChunks: No missing chunks found for entry %s", entryId) //TODO should add also recoridng entry
                                    return Q.resolve()
                                }
                                else{
                                    //should create hard link and then add to json
                                    let updateChunksPromises= _.each(missingChunks, function (filePath) {
                                        let fileName = path.basename(filePath);
                                        let arrayPath = filePath.split(path.sep);
                                        let flavorId = arrayPath[arrayPath.length-3];
                                        let DestFilePath = path.join(recordingSessionPath, flavorId, fileName);
                                        return qio.link(fileName, DestFilePath).then(()=>{
                                            return getMetaData(filePath).then((metaData)=>{
                                                playlistGenerator.update(metaData)
                                            })
                                        })

                                    })
                                    return Q.allSettled(updateChunksPromises).then((results)=>{
                                        let errs = ErrorUtils.aggregateErrors(results);
                                        if (errs.numErrors > 0) {
                                            logger.error("checkAndGetMissionChunks: Failed to recover files for recorded entry %s: %s",entryId, errs.err.message) //TODO should add also recoridng entry
                                        }
                                        else{
                                            logger.info("checkAndGetMissionChunks: Succesfullly add all chunks for recorded entry %s", entryId) //TODO should add also recoridng entry
                                        }
                                        return Q.resolve() // return resolve anyway!
                                    })
                                }
                        })

                })
            }

            /*
                This funcion check that all file in recording direcotry are also in Json, Otherwise, calling addFileToJson
             */
            const checkAndAddFileToJson = (recordingSessionPath, playlistGenerator, entryId)=>{ //todo should verify that json is update on the main object!!!
                return pGlob(path.join(recordingSessionPath, '*/*.mp4'))
                    .then(function(downloadedChunks) {
                        let missingChunks = [];
                        _.each(downloadedChunks, function (filePath) {
                            var fileName = path.basename(filePath);
                            if (! playlistGenerator.checkFileExists(fileName)) {
                                logger.info("checkAndAddFileToJson: Found chunk exist by missing on json")
                                missingChunks.push(filePath)
                            }
                        })
                        if (missingChunks.length == 0){
                            logger.debug("checkAndAddFileToJson: No missing chunks found for entry %s", entryId) //TODO should add also recoridng entry
                            return Q.resolve()
                        }
                        else{
                            let updateChunksPromises= _.each(missingChunks, function (filePath) {
                                return getMetaData(filePath)
                                    .then((metaData)=>{
                                        playlistGenerator.update(metaData)
                                    })
                            })
                            return Q.allSettled(updateChunksPromises).then((results)=>{
                                let errs = ErrorUtils.aggregateErrors(results);
                                if (errs.numErrors > 0) {
                                    logger.error("checkAndAddFileToJson: Failed to recover files for recorded entry %s: %s",entryId, errs.err.message) //TODO should add also recoridng entry
                                }
                                else{
                                    logger.info("checkAndAddFileToJson: Succesfullly add all chunks for recorded entry %s", entryId) //TODO should add also recoridng entry
                                }
                                return Q.resolve() // return resolve anyway!
                            })
                            //here should run ffprobe to get metadat of chenk
                        }
                    })
            }

            /*
            This function is parsing the metadata of file
             */
            const getMetaData = (filePath)=>{
                logger.debug("About to parse meta data of file %s", filePath)
            }
/*
                return qio.list(chunksDirLivePath).then((fileList)=>{
                    let promises =_.each(fileList, (fileName)=>{
                        let filePath = path.join(chunksRecordingPath, fileName)
                        return qio.exists(filePath).then((fileExist)=>{
                            if (!fileExist){
                                let sourceFIle = path.join(chunksDirLivePath, fileName)
                                logger.warn("Detect unlink file for entry %s, create hard-link for %s", enrtyId, fileName)
                                return qio.link(sourceFIle, filePath)
                            }
                        })
                    })
                    return Q.allSettled(promises).then((results)=>{
                            const errs = ErrorUtils.aggregateErrors(results);
                            if (errs.numErrors > 0) {
                                logger.error(errs.err.message)
                            }
                    })
                })
            */


            let startTime = new Date();
            return pGlob(path.join(recordingRootPath, '*/')) // get all folders in recording dir
            //todo add entry id pattern to regex?
                    .then((recordedEntryList)=> {

                        let now = new Date();
                        let CheckRecordedEntryPromises = _.map(recordedEntryList, function (recordingEntryPath) {
                            let entryId = path.basename(recordingEntryPath)
                            let deferred  = Q.defer();
                            return getEntryObject(entryId)
                                .then((entryObj)=> {
                                let recordedEntryId = entryObj.recordedEntryId; //todo what happen if not exist?
                                return pGlob(path.join(recordingEntryPath, recordedEntryId, '*/'))
                                    .then((flavorListPath)=>{
                                        let flavorList = []
                                        _.each(flavorListPath, function (flavorPath) {
                                            let flavorId = path.basename(flavorPath);
                                            flavorList.push(flavorId)
                                        })
                                        logger.debug("onStartUp: Found recording session %s-%s, flavors %s", entryId, recordedEntryId, flavorList)
                                        let source = findSourceStreamId(flavorList)
                                        if (source == -1){
                                            //todo defer = Q.rejet(); return?
                                            return Q.reject("Error while trying to find source stream of "+entryId+" from flavor list "+flavorList)
                                        }
                                        let recordingSessionPath = path.join(recordingEntryPath, recordedEntryId)
                                        let recordingSessionSourcePath =  path.join(recordingSessionPath, source)
                                            return Q.all([getLastUpdateChunk(recordingSessionSourcePath), qio.exists(path.join(recordingSessionSourcePath, 'done'))])
                                                .then((results)=> { //todo if faied return reject promice
                                                    let lastTimeUpdateChunk = results[0]
                                                    let fileDoneExist = results[1]
                                                    if (fileDoneExist){
                                                        logger.debug("onStartUp:  Recording session %s-%s, is already handled - file done exist.", entryId, recordedEntryId)
                                                        deferred = Q.resolve()
                                                        return
                                                    }
                                                    let playlistGenerator = createPlaylistGenerator(entryObj, recordingSessionPath, flavorList)
                                                    return accessibleRecording(playlistGenerator, recordedEntryId, recordingSessionPath).then(()=>{
                                                        let liveEntryPath = path.join(liveFolderPath, entryId)
                                                        return checkAndGetMissionChunks(liveEntryPath, recordingSessionPath, entryId, playlistGenerator).then(()=>{
                                                        if (now - lastTimeUpdateChunk > entryObj.recordingSessionDuration) {    // if session is expired, move directory
                                                            logger.info("onStartUp: recorded entry %s-%s didn't get new chunk for %d seconds- stop recording", entryId,recordedEntryId, entryObj.recordingSessionDuration / 1000);
                                                            deferred = stopRecording(entryId, recordedEntryId, recordingSessionPath)
                                                        }
                                                        else {
                                                            logger.info("onStartUp: Found recorded entry %s-%s still open session", entryId,recordedEntryId)
                                                            recordingList[entryId] = {
                                                                "recordingSessionDuration": entryObj.recordingSessionDuration,
                                                                "lastTimeUpdateChunk": now,
                                                                'recordedEntryId': entryObj.recordedEntryId,
                                                                "recordingSessionPath": recordingSessionPath,
                                                                "playlistGenerator" : playlistGenerator,
                                                                'flavors' : [],
                                                                'duration' : 0 //todo shoud get the corrent dutation and check not passed the limit
                                                            }
                                                            deferred = Q.resolve()
                                                        }
                                                    })
                                                    })
                                             })
                                        })
                                //    })
                                })
                            return deferred.promise
                        })
                        return Q.allSettled(CheckRecordedEntryPromises).then(function (results) {
                            const errs = ErrorUtils.aggregateErrors(results);
                            if (errs.numErrors > 0) {
                                logger.error("onStartUp failed!: %s",errs.err.message)
                            }
                            else{
                                let totalTime =  (new Date() - startTime)/1000;
                                logger.info("onStartUp finish successfully, taken %s seconds", totalTime)
                            }
                        })
                    })
                .catch(function (err) {
                    logger.error(ErrorUtils.error2string(err));
                })
        }

        this.start = onStartUp
        //this.start = ()=>{ return Q.resolve() }
        this.startRedording = startRecording
        this.addNewChunks = addNewChunks
        setInterval(handleRecordingEntries, recordingTimeInterval)
        }

    }
module.exports = new RecordingManager();
