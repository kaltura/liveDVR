/**
 * Created by lilach.maliniak on 05/11/2017.
 */
const Q = require('q');
const fs = require('fs');
const util = require('util');
const events = require("events");
const qio = require('q-io/fs');
const path = require('path');
const _ = require('underscore');
const glob = require('glob');
const config = require('../../common/Configuration')
//config.set('logToConsole', true);
const ErrorUtils = require('../utils/error-utils');
const PersistenceFormat = require('../../common/PersistenceFormat.js');
const logger = require('../../common/logger').getLogger("RestoreRecordingFromBackup");
const backendClient = require('../BackendClientFactory.js').getBackendClient();
const options = require('commander');
const mediaServerHostname = config.get('mediaServer').hostname;
const persistenceFormat = require('../../common/PersistenceFormat');
const kalturaTypes = require('../kaltura-client-lib/KalturaTypes');
const completedRecordingFolderPath = config.get('recording').completedRecordingFolderPath;
const unknownEntry = 'UNKNOWN';

options
    .version('0.0.1')
    .option('-p, --path <path>', 'specify path')
    .option('-d --duration <duration msec>', 'recording duration in msec')
    .parse(process.argv);

const valid = ('path' in options) && ('duration' in options);
if (valid !== true) {
    logger.error("Missing mandatory argument, path (recording content full path) and duration (recording duration, msec. Can be taken from stamp file) must be passed as args, in command line");
    process.exit(1);
}

let arg = options.path.split(/[\/]+/);
let recordedEntryId = arg[arg.length - 1];
const entryId = arg[arg.length - 2];
let partnerId = -1;
let restoreRecordingStatus = 'succeeded';
let status = 0;
const mediaServerIndex = kalturaTypes.KalturaEntryServerNodeType.LIVE_PRIMARY;
const liveEntryStatus = kalturaTypes.KalturaEntryServerNodeStatus.PLAYABLE;
logger.info(`[${entryId}-${recordedEntryId}], registerMediaServer host [${mediaServerHostname}], path: [${options.path}], duration: [${options.duration}] msec, received from command line`);

backendClient.getEntryInfo(entryId)
    .then((entryObject)=> {
        partnerId = entryObject.partnerId;
        if (entryObject.recordedEntryId) {
            recordedEntryId = entryObject.recordedEntryId;
            return entryObject;
        }
        else {
            backendClient.registerEntryInDatabase({entryId: entryId, serverType: mediaServerIndex, partnerId: partnerId}, liveEntryStatus, 'play')
                .then((entryObject)=> {
                    recordedEntryId = entryObject.recordedEntryId;
                    return backendClient.unregisterEntryInDatabase(entryId, mediaServerIndex);
                });
        }
    })
    .then(()=> {
        let recordingPath = options.path;
        if (recordedEntryId == unknownEntry) {
            logger.warn(`[${entryId}-${recordedEntryId}], Can't link recorded entry into live, recorded entry is unknown`);
            return Q.reject(new Error('failed to restore recording recordedEntryId is UNKNOWN'));
        }
        let accessibleRecordingFolder = PersistenceFormat.getEntryBasePath(recordedEntryId);
        logger.info(`[${entryId}-${recordedEntryId}], Accessible recording`);
        return qio.symbolicLink(accessibleRecordingFolder, recordingPath, 'directory')
            .then(()=> {
                return recordingPath;
            })
            .catch((err)=> {
                if (err instanceof Error && err.code == 'EEXIST') {
                    logger.warn(`[${entryId}-${recordedEntryId}], could not create soft link: [${accessibleRecordingFolder}]-->[${recordingPath}], symlink already created.`);
                    return Q.resolve(recordingPath);
                }
                else {
                    logger.error(`[${entryId}-${recordedEntryId}], failed to create soft link: [${accessibleRecordingFolder}]-->[${recordingPath}]. Error: ${ErrorUtils.error2string(err)}`);
                    restoreRecordingStatus = 'failed';
                    status = 4;
                    return Q.resolve(recordingPath);
                }
            })
    })
    .then((recordingPath)=> {
        let destFilePath = path.join(completedRecordingFolderPath, entryId + '_' + recordedEntryId + '_' + options.duration);
        return qio.symbolicLink(destFilePath, recordingPath, 'directory')
            .then(()=> {
                logger.info(`[${entryId}-${recordedEntryId}] successfully created job symlink: [${destFilePath}]-->[${recordingPath}]`);
            })
            .catch((err)=> {
                if (err instanceof Error && err.code == 'EEXIST') {
                    logger.warn(`[${entryId}-${recordedEntryId}], could not create symlink: [${destFilePath}]-->[${recordingPath}], symlink already created.`);
                    return Q.resolve();
                }
                else {
                    logger.error(`[${entryId}-${recordedEntryId}], failed to create symlink: [${destFilePath}]-->[${recordingPath}]. Error: ${ErrorUtils.error2string(err)}`);
                    restoreRecordingStatus = 'failed';
                    status = 5;
                }
            });
    })
    .catch((err)=> {
        logger.error(`[${entryId}-${recordedEntryId}], failed to restore recording from backup DC. Error: ${ErrorUtils.error2string(err)}`);
        restoreRecordingStatus = 'failed';
        status = status == 0 ? 6 : status;
    })
    .finally(()=> {
        logger.info(`[${entryId}-${recordedEntryId}] resotore recording from backup ${restoreRecordingStatus}, [${status}]`);
        process.exit(status);
    });
