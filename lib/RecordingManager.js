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
const mp4Utils =  require('./utils/mp4-utils.js');
const PersistenceFormat = require('../common/PersistenceFormat.js');
class RecordingManager {
    //todo what to do if we stop stream and start, but other machine has start to get it
    //todo move all path join baseName etc to persistent format
    //todo check zero bytes only in staring or each one?
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

        const accessibleRecording = (playlistGenerator, entryId ,recordedEntryId, recordingSessionPath) =>{
            /*
             Create manifest,and then crate symbolic link to live
             */
            return playlistGenerator.initializeStart().then(()=>{
                return playlistGenerator.finalizeStart().then(()=>{
                    let accessibleRecordingFolder = PersistenceFormat.getEntryBasePath(recordedEntryId)
                    return qio.exists(accessibleRecordingFolder).then((isExist)=>{
                        if (!isExist){
                            logger.info("[%s-%s] Accessible recording", entryId, recordedEntryId)
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
                logger.info("[%s-%s] Starting a new recording session", entryId, entryObj.recordedEntryId);
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
                recordingList[entryId].duration = playlistGenerator.getTotalDuration()/1000 //todo maybe should wait to initialize???
                createManifestPromise = accessibleRecording(playlistGenerator, entryId ,entryObj.recordedEntryId, recordingSessionPath)
            }
            else{
                recordingList[entryId].flavors.push(flavorId) //todo should check that not exist
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
                                logger.info("[%s-%s] Found a previous recording session.", entryObj.entryId, entryObj.recordedEntryId)
                                //todo should update recording duration
                                if (recordingList[entryId].duration  > recordingMaxDuration){
                                    logger.info("[%s-%s] Recorded entry is  passed the maximum length of recording session",  entryObj.entryId, entryObj.recordedEntryId) //todo checkit
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

            const checkForErrors = (results, recordingEntrySessionId, Mp4Files) => {
                const errs = ErrorUtils.aggregateErrors(results);
                if (errs.numErrors === results.length) {

                    throw new Error("Failed to start entry recording for entry: "+recordingEntrySessionId+". All chunks link failed: "+ErrorUtils.error2string(errs.err));
                }
                if (errs.numErrors > 0) {
                    // Report an error (but proceed) if only some flavor downloaders could not be started
                    _.each(results, (element, index)=>{
                        if(element.state !== 'fulfilled'){
                            let sourcePath = Mp4Files[index].path
                            logger.error("[%s] Failed to link %s: %s",recordingEntrySessionId, sourcePath, ErrorUtils.error2string(element.reason))
                            delete Mp4Files[index] //remove from mp4 since failed to link
                        }
                    })
                    Mp4Files = _.filter(Mp4Files, (element)=>{
                        return element !== undefined
                    })

                }
                return Mp4Files
            }



            let chunksNameChained = _.reduce(Mp4Files, function(str, obj){ return str+ obj.chunkName+ " " }, "")
            let recordedEntryId =recordingList[entryId].recordedEntryId;
            logger.info("[%s-%s] Receiving new chunks :%s", entryId, recordedEntryId, chunksNameChained);

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
                return qio.link(SourcefilePath, DestFilePath).then(()=>{ //todo should verify that if we links a then b, then the callback is also be at the same order, so it will add to json with the same order
                    Mp4File.path = DestFilePath
                    return Q.resolve()
                })
            });
            return Q.allSettled(promises).then(function (results) {
                    let Mp4FilesUpdated= checkForErrors(results, entryId + '-' + recordedEntryId, Mp4Files);
                    return Q.resolve(Mp4FilesUpdated)
                })
                .then(function (Mp4FilesUpdated) {
                    let chunksNameChained = _.reduce(Mp4FilesUpdated, function(str, obj){ return str+ obj.chunkName+ " " }, "")
                    logger.debug("[%s-%s] About to update chunks: %s", entryId, recordedEntryId, chunksNameChained)
                    return recordingList[entryId].playlistGenerator.update(Mp4FilesUpdated);
                })
                .then(function () {
                    recordingList[entryId].lastTimeUpdateChunk = new Date();
                    if ( flavorId == findSourceStreamId(recordingList[entryId].flavors)){
                        recordingList[entryId].duration = recordingList[entryId].playlistGenerator.getTotalDuration()/1000
                    }

                })
                .catch(function (err) {
                    logger.error("[%s-%s] Error occurred while try to add new chunks: %j", entryId + '-' + recordedEntryId, ErrorUtils.error2string(err));
                    return Q.reject(err);
                })
        }

        const handleRecordingEntries =  () => {
            try {
                let now = new Date();
                logger.debug("Check for end recording session");
                _.each(recordingList, function (element, entryId) {
                    let objectAsString = JSON.stringify(element)
                    logger.debug("[%s-%s] handleRecordingEntries-  now:%s, element: %s", entryId, element.recordedEntryId, now, objectAsString)
                    if (now - element.lastTimeUpdateChunk > element.recordingSessionDuration) {
                        logger.info("[%s-%s] recording  didn't get new chunks for %d - stop recording", entryId, element.recordedEntryId, element.recordingSessionDuration);
                        let source = findSourceStreamId(element.flavors);
                        if (source == -1){
                            logger.error("Error while trying to find source stream of "+entryId+" from flavor list "+element.flavors)
                            return
                        }
                        let recordingSessionSourcePath = path.join(element.recordingSessionPath, source);
                        stopRecording(entryId, element.recordedEntryId, recordingSessionSourcePath)
                    }
                });
                logger.info("Available recording entry: %j", _.keys(recordingList));
            } catch (err) {
               logger.error("Error while trying to run handleRecordingEntries: %s ", ErrorUtils.error2string(err))
            }
        }

        const findSourceStreamId = (flavorList) =>{
            if (flavorList.length > 0)
                return flavorList.min()
           // return -1 in not found
            return -1
        }

        const stopRecording = (entryId, recordedEntryId, recordingSessionSourcePath) =>{

            let now = new Date().getTime().toString()
            let destFilePath = path.join(completedRecordingFolderPath, entryId +'_' + recordedEntryId + '_' +now);
            return qio.symbolicLink(destFilePath, recordingSessionSourcePath, 'directory')
                .then(function(){
                    let doneFilePath = path.join(recordingSessionSourcePath, 'done')
                    return qio.write(doneFilePath, 'done')
                })
                .then(function () {
                        delete recordingList[entryId];
                        logger.info("[%s-%s] Successfully create soft link from %s, into %s",entryId, recordedEntryId, recordingSessionSourcePath, destFilePath);
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

            /*
            In order to check that all chunks in live directory exist in recording, we check first that all chunks in recording are in json
            */

            const checkAndGetMissionChunks = (liveEntryPath, recordingSessionPath, recordingSessionId, playlistGenerator) => {
                return checkFilesFromRecordingFolder(recordingSessionPath, playlistGenerator, recordingSessionId).then(()=> {
                    return checkFilesFromLiveFolder(liveEntryPath, recordingSessionPath, recordingSessionId, playlistGenerator)
                })
            }

            const checkMissingChunks = (downloadedChunks, playlistGenerator, recordingSessionId)=>{
                let missingChunks = [];
                _.each(downloadedChunks,  (filePath)=> {
                    let fileName = path.basename(filePath);
                    if (! playlistGenerator.checkFileExists(fileName) && !fileName.endsWith('_out.mp4') ) {
                        //    if (!stats.size) {
                        //        that.logger.warn("Zero size file! Adding %s to chunksToDownload", fileName);
                        //      that.downloadedChunks[fileName] = true;
                        logger.info("[%s] checkMissingChunks: Found chunk %s missing on playList: path %s",recordingSessionId,  fileName, filePath)
                        missingChunks.push(filePath)
                    }
                })
                return missingChunks
            }

            const checkFilesFromLiveFolder = (liveEntryPath, recordingSessionPath, recordingSessionId, playlistGenerator) => {

                const generateHardLink= (missingChunks)=>{
                    let linkChunksPromises= _.map(missingChunks, function (filePath) {
                        let fileName = path.basename(filePath);
                        let arrayPath = filePath.split(path.sep);
                        let flavorId = arrayPath[arrayPath.length - 3];
                        let DestFilePath = path.join(recordingSessionPath, flavorId, fileName);
                        return qio.link(filePath, DestFilePath)
                    })
                    return Q.allSettled(linkChunksPromises).then((results)=>{
                        _.each(results, (element, index)=> {
                            if(element.state !== 'fulfilled'){
                                logger.error("[%s] checkFilesFromLiveFolder: Failed to link %s : %s", recordingSessionId, missingChunks[index], element.reason  ? ErrorUtils.error2string(element.reason) : "Unknown reason")
                                missingChunks.splice(index, 1) //remove failed chunks from array todo veryfy that missingChunks can access from here
                                //todo change it
                            }
                        })
                        return missingChunks
                    })
                }

                return pGlob(path.join(liveEntryPath, '*/*/*.mp4')).then((downloadedChunks)=> { //todo should verify that pglobe is giving the chunks in right order
                    let missingChunks = checkMissingChunks(downloadedChunks, playlistGenerator, recordingSessionId)
                    if (missingChunks.length == 0){
                        logger.debug("[%s] checkFilesFromLiveFolder: No missing chunks found", recordingSessionId)
                        return Q.resolve()
                    }
                    else{
                        //should create hard link and then add to json
                        logger.debug("[%s] checkFilesFromLiveFolder: Found %d missing chunks %s ", recordingSessionId, missingChunks.length, missingChunks)
                        return generateHardLink(missingChunks)
                            .then((updateMissingChunks)=> {
                            return getMetaData(updateMissingChunks, recordingSessionId)
                            })
                            .then((chunksToUpdate)=> {
                                return playlistGenerator.update(chunksToUpdate).then(()=> {
                                    logger.info("[%s] checkFilesFromLiveFolder: Successfully add  chunks for recorded entry %s", recordingSessionId, chunksToUpdate)
                                    return Q.resolve() // return resolve anyway!
                                })
                            })
                    }
                })
            }

            /*
                This funcion check that all file in recording directory are also in Json, Otherwise, calling addFileToJson
             */
            const checkFilesFromRecordingFolder = (recordingSessionPath, playlistGenerator, recordingSessionId)=>{ //todo should verify that json is update on the main object!!!
                return pGlob(path.join(recordingSessionPath, '*/*.mp4'))
                    .then(function(downloadedChunks) {
                        let missingChunks = checkMissingChunks(downloadedChunks, playlistGenerator, recordingSessionId)
                        if (missingChunks.length == 0){
                            logger.debug("[%s] checkFilesFromRecordingFolder: No missing chunks found (compare to Live directory) for recorded session id", recordingSessionId)
                            return Q.resolve()
                        }
                        else{
                            return getMetaData(missingChunks, recordingSessionId).then((chunksToUpdate)=>{
                                logger.debug("[%s] checkFilesFromRecordingFolder: About to update chunks %s in json for recorded session id", recordingSessionId, missingChunks)
                                return  playlistGenerator.update(chunksToUpdate)
                            })
                                .then(()=>{
                                    logger.info("[%s] checkFilesFromRecordingFolder: Successfully add chunks %s.", recordingSessionId, missingChunks)
                                    return Q.resolve() // return resolve anyway!
                                })

                        }
                    })
            }

            /*
            This function is parsing the metadata of all files
             */
            const getMetaData = (missingChunks, recordingSessionId)=>{
                logger.debug("[%s] About to parse meta data for the file %s", recordingSessionId, missingChunks) //todo verify that all chunks are sorted
                let updateChunksPromises= _.map(missingChunks, function (filePath) {
                    return mp4Utils.extractMetadata(filePath)
                        .then((metaData)=> {
                            metaData.path = filePath
                            metaData.flavor = path.basename(path.dirname(filePath))
                            logger.debug("[%s] extractMetadata for %s: %s", recordingSessionId, filePath, JSON.stringify(metaData))
                            return Q.resolve(metaData)
                        })
                })
                return Q.allSettled(updateChunksPromises).then((results)=> {
                    let errs = ErrorUtils.aggregateErrors(results);
                    if (errs.numErrors > 0) {
                        logger.error("[%s] checkAndAddFileToJson: Failed to extract matadata for missingChunks %s: %s", recordingSessionId, missingChunks, errs.err.message)
                        results = _.filter(results, function(p) { return (p.state !== 'fulfilled') }); //remove all failed promise
                    }
                    let resultsValue= _.map(results, function (result) {
                        return result.value
                    })
                    return Q.resolve(resultsValue) // return resolve anyway!
                })
            }

            const getFlavors = (entryObj, recordingEntryPath)=> { //todo what happen if promise faied?
                let recordedEntryId = entryObj.recordedEntryId; //todo what happen if not exist?
                return pGlob(path.join(recordingEntryPath, recordedEntryId, '*/')).then((flavorListPath)=> {
                    let flavorList = []
                    _.each(flavorListPath, function (flavorPath) {
                        let flavorId = path.basename(flavorPath);
                        flavorList.push(flavorId)
                    })
                    return Q.resolve(flavorList)
                })
            }

            const addToRecordingList = (entryObj, recordingSessionPath, playlistGenerator, now, flavorList)=>{

                recordingList[entryObj.entryId] = {
                    "recordingSessionDuration": entryObj.recordingSessionDuration,
                    "lastTimeUpdateChunk": now,
                    'recordedEntryId': entryObj.recordedEntryId,
                    "recordingSessionPath": recordingSessionPath,
                    "playlistGenerator" : playlistGenerator,
                    'flavors' : flavorList,
                    'duration' : playlistGenerator.getTotalDuration()/1000, //since value is return in millisecond
                }
                let objectAsString = JSON.stringify(recordingList[entryObj.entryId])
                logger.debug("[%s-%s] addToRecordingList: %s", entryObj.entryId, entryObj.recordedEntryId, objectAsString)
            }
            let startTime = new Date();
            return pGlob(path.join(recordingRootPath, '*/')) // get all folders in recording dir
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
                                                let msg = '['+ entryId+ '-' + recordedEntryId + '] Source not found'
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
                                                    let liveEntryPath = PersistenceFormat.getEntryBasePath(entryId);
                                                    return checkAndGetMissionChunks(liveEntryPath,  recordingSessionPath, entryId + '-' + recordedEntryId, playlistGenerator).then(()=> { //should be continiue even if we failed!
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
