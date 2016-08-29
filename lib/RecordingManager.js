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
const ErrorUtils = require('./utils/error-utils');
const backendClient=require('./BackendClientFactory.js').getBackendClient();
class RecordingManager {
    constructor() {
        const recordingTimeInterval = config.get("recordingTimeInterval");
        const recordingUploaderDir = config.get("recordingUploaderFolderPath");
        const recordingDir = config.get('recordingFolderPath');
        const recordingList = {};


        logger.info("Initializing recording manager");


        const newChunks =  (Mp4Files, entryId, liveSessionExpirationDuration) =>{
            //todo : Since we dont use start recording, then the parametr liveSessionExpirationDuration should passed evreytime, however, use it only for the first time
            const checkForErrors = (results, entryId) => {
                const errs = ErrorUtils.aggregateErrors(results);
                if (errs.numErrors === results.length) {

                    throw new Error("Failed to start entry recording for entry: %s. All chunks link failed", entryId);
                }
                if (errs.numErrors > 0) {
                    // Report an error (but proceed) if only some flavor downloaders could not be started
                    logger.error("Failed  to link chunk:  %s ", ErrorUtils.error2string(errs.err));
                }
            }


            const startRecording =  (entryId, liveSessionExpirationDuration) =>{
                recordingList[entryId] = {
                    "liveSessionExpirationDuration": liveSessionExpirationDuration,
                    "lastTimeUpdateChunk": new Date()
                }
                return qio.makeDirectory(recordingEntryDir)
            }
            let chunksName = _.reduce(Mp4Files, function(str, obj){ return str+ obj.chunkName+ " " }, "")
            logger.info("Receiving new chunks from %s :%s", entryId, chunksName);
            let recordingEntryDir = path.join(recordingDir, entryId);

            let promise = Q.resolve();
            if (recordingList[entryId]) {
                recordingList[entryId].lastTimeUpdateChunk = new Date();
            }
            else {
                logger.info("Starting new recorded entry for %s, with %s", entryId, liveSessionExpirationDuration);
                promise = startRecording(entryId, liveSessionExpirationDuration);
            }
            return promise.then(function () {
                var promises = _.map(Mp4Files, function (Mp4File) {
                    let SourcefilePath = Mp4File.path;
                    let DestFilePath = path.join(recordingEntryDir, Mp4File.chunkName + ".mp4"); //todo change it
                    return qio.link(SourcefilePath, DestFilePath)
                });
                return Q.allSettled(promises);
            })
                .then(function (results) {
                    checkForErrors(results, entryId);
                })
                .catch(function (err) {
                    logger.error("Error occurred while try to add new chunks for entry %s: %j", entryId, ErrorUtils.error2string(err));
                    return Q.reject(err);
                })
        }

        const handleRecordingEntries =  () => {
            let keys = [];
            let now = new Date();
            logger.debug("Check for end recording session");
            _.each(recordingList, function (element, entryId) {
                keys.push(entryId);
                if (now - element.lastTimeUpdateChunk > element.liveSessionExpirationDuration) {
                    logger.info("recording for entry %s didn't get new chunk for %d - stop recording", entryId, element.liveSessionExpirationDuration);
                    stopRecording(entryId)
                }
            });
            logger.debug("Available recording entry: %j", _.keys(recordingList));    //todo on start or on the end? is it effective to explore list again?

        }

        const stopRecording = (entryId) =>{

            let sourcefilePath = path.join(recordingDir, entryId);
            let destFilePath = path.join(recordingUploaderDir, entryId + "_" + new Date().getTime());
            qio.move(sourcefilePath, destFilePath)
                .then(function () {
                        delete recordingList[entryId];
                        logger.info("Successfully  move %s, into %s", sourcefilePath, destFilePath);
                        return Q.resolve()
                    },
                    function (err) {
                        return Q.reject("Failed to move %s, into %s : %s", ErrorUtils.error2string(err));
                    })
        }


        const onStartUp = ()=> {
            const getRecordedEntryProperties = (entryId)=> {
                return backendClient.getEntryInfo(entryId)
                    .then(function (entryInfo) {
                        if (entryInfo) {//todo check if enlty is not exist
                            return entryInfo.liveSessionExpirationDuration;
                        }
                    })

            };

            const getLastUpdateChunk = (filePath) => {
                return qio.list(filePath).then(function (filesList) {
                    var promisesList = filesList.map(function (fileName) {
                        return qio.stat(path.join(filePath, fileName))
                    })
                    return Q.allSettled(promisesList).then(function (res) {
                        res = _.filter(res, function (val) {
                            return val.state == "fulfilled"
                        })
                        _.sortBy(res, function (val) {
                            return val.value.node.mtime.getTime()
                        });
                        const errs = ErrorUtils.aggregateErrors(res);
                        if (errs.numErrors === res.length) {
                            // Fail if no flavor downloader could be started
                            throw new Error("Failed to stat files for ", filePath);  //todo who catch it ?
                        }
                        if (errs.numErrors > 0) {
                            // Report an error (but proceed) if only some flavor downloaders could not be started
                            logger.error("Failed  to stat some files for " + filePath + ": %s ", ErrorUtils.error2string(errs.err));
                        }
                        let returnValue = res[0].value.node.mtime.getTime();
                        return Q.resolve(returnValue)
                    })

                })
            }

            const filterList = (fileList) => {
                var promises = _.map(fileList, function (fileName) {
                    return qio.stat(path.join(recordingDir, fileName)).then(function (result) {
                        if (result.isDirectory()){
                            return fileName
                        }

                    })
                })
                return Q.all(promises).then(function (results) {
                    let fileListFiltered = _.filter(results, function (fileName) {
                            return fileName != undefined
                        })
                    return Q.resolve(fileListFiltered)
                    })
            }
            return qio.list(recordingDir).then(function (fileList) {   //filter results that are only folders - (latter check if it has entry id pattern )
                return filterList(fileList)
                    .then((fileListFiltered)=> {

                        let now = new Date();
                        let liveSessionExpirationDurationDefaultValue = config.get("sessionDuration") //default value
                        var promises = _.map(fileListFiltered, function (entryId) {
                            let deferred = Q.resolve();
                            let LiveSessionExpirationDurationPromise = getRecordedEntryProperties(entryId);
                            let lastUpdateChunkPromise = getLastUpdateChunk(path.join(recordingDir, entryId));
                            return Q.allSettled([LiveSessionExpirationDurationPromise, lastUpdateChunkPromise]).then(function (results) {
                                let liveSessionExpirationDuration, lastTimeUpdateChunk;

                                if (results[0].state === 'fulfilled') {
                                    liveSessionExpirationDuration = results[0].value;
                                }
                                else {
                                    liveSessionExpirationDuration = liveSessionExpirationDurationDefaultValue
                                }
                                if (results[1].state === 'fulfilled') {
                                    lastTimeUpdateChunk = results[1].value
                                }
                                else {
                                    return Q.reject(util.format("Failed to get lastTimeUpdateChunk for %s : %s", entryId, ErrorUtils.error2string(results[1].reason)));
                                }

                                if (now - lastTimeUpdateChunk > liveSessionExpirationDuration) {    // if session is expired, move directory
                                    logger.info("onStartUp: recorded entry %s didn't get new chunk for %d seconds- stop recording", entryId, liveSessionExpirationDuration/1000);
                                    deferred = stopRecording(entryId)
                                }
                                else {
                                    recordingList[entryId] = {
                                        "liveSessionExpirationDuration": liveSessionExpirationDuration,
                                        "lastTimeUpdateChunk": lastTimeUpdateChunk
                                    }
                                }
                                return deferred
                            })
                        })
                        return Q.allSettled(promises).then(function (results) {
                            const errs = ErrorUtils.aggregateErrors(results);
                            if (errs.numErrors > 0) {
                                logger.error(errs.err.message)
                            }
                        })
                    })
            })
                .catch(function (err) {
                    logger.error(ErrorUtils.error2string(err));
                })
        }

        this.start = onStartUp
        this.newChunks = newChunks
        setInterval(handleRecordingEntries, recordingTimeInterval)
        }

    }
module.exports = new RecordingManager();
