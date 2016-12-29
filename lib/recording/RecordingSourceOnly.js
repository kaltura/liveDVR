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
const PlaylistGenerator = require('../playlistGenerator/PlaylistGenerator');
const PersistenceFormat = require('../../common/PersistenceFormat.js');
const RecordingEntrySession = require('./RecordingEntrySession.js')
const recordingManager = require('./RecordingManager.js')
const logger = require('../../common/logger').getLogger("RecordingManager");
const backendClient = require('../BackendClientFactory.js').getBackendClient();
let pathBase ="/web/content/kLive/liveRecorder/recordings/newSession/k/0_tmfke29k/0_zawnyb42"
let arg = process.argv[2].split(path.sep)
let recordingEntrySession
let chunksDir = arg[arg.length - 1];
let recordedId = arg[arg.length - 2];
let enrtyId = arg[arg.length - 3];
backendClient.getEntryInfo(enrtyId).then((entryObj)=>{
    let flavorsObjArray = [{"name" : chunksDir}]
    entryObj.recordedEntryId = recordedId
    recordingEntrySession = new RecordingEntrySession(entryObj, flavorsObjArray)
    return recordingEntrySession.restoreSession()
})
    .then(()=>{
        logger.info("Finish to write files, about to create link")
        recordingManager.recordingList[enrtyId] = recordingEntrySession
        return recordingManager.stopRecording(enrtyId, recordedId, pathBase)
    })
    .then(()=>{
        logger.info("Finish to create link")
        exit(0)
        });
