/**
 * Created by ron.yadgar on 29/12/2016.
 */

const Q = require('q');
const util = require('util');
const events = require("events");
const qio = require('q-io/fs');
const path = require('path');
const _ = require('underscore');
const glob = require('glob');
const ErrorUtils = require('../utils/error-utils');
const PlaylistGenerator = require('../playlistGenerator/PlaylistGenerator');
const PersistenceFormat = require('../../common/PersistenceFormat.js');
const RecordingEntrySession = require('./RecordingEntrySession.js')
const recordingManager = require('./RecordingManager.js')
const logger = require('../../common/logger').getLogger("RecordingManager");
const backendClient = require('../BackendClientFactory.js').getBackendClient();
let arg = process.argv[2].split(path.sep)
let pathBase = path.dirname(process.argv[2])
let recordingEntrySession
let chunksDir = arg[arg.length - 1];
let recordedId = arg[arg.length - 2];
let enrtyId = arg[arg.length - 3];
backendClient.getEntryInfo(enrtyId).then((entryObj)=>{
    let flavorsObjArray = [{"name" : chunksDir}]
    entryObj.recordedEntryId = recordedId
    recordingEntrySession = new RecordingEntrySession(entryObj, flavorsObjArray)
    let jsonPath =  recordingEntrySession.playlistGenerator.playlistPath
    return qio.exists(jsonPath).then((isExist)=>{
        if (isExist){
            let jsonPathNew = path.join(jsonPath + "_"+ new Date().getTime().toString())
            logger.info("Found playlist json exist, rename it to %s", jsonPathNew)
            return qio.rename(jsonPath, jsonPathNew)
        }
    })
})
    .then(()=>{
        return recordingEntrySession.restoreSession()
})
    .then(()=>{
        logger.info("Finish to write files, about to create link")
        recordingManager.recordingList[enrtyId] = recordingEntrySession
        return recordingManager.stopRecording(enrtyId, recordedId, pathBase)
    })
    .then(()=>{
        logger.info("Finish to create link")
        process.exit(0);
        })
    .catch((err)=>{
        logger.info("Error: [%s]",  ErrorUtils.error2string(err))
        process.exit(1);
    })
