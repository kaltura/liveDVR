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
const config = require('../../common/Configuration')
config.set('logToConsole', true);
const ErrorUtils = require('../utils/error-utils');
const PersistenceFormat = require('../../common/PersistenceFormat.js');
const logger = require('../../common/logger').getLogger("RestoreRecordingFromBackup");
const backendClient = require('../BackendClientFactory.js').getBackendClient();
const options = require('commander');
const mediaServerHostname = config.get('mediaServer').hostname;
const kalturaTypes = require('../kaltura-client-lib/KalturaTypes');
const completedRecordingFolderPath = config.get('recording').completedRecordingFolderPath;

options
    .version('0.0.1')
    .option('-p, --path <path>', 'specify path')
    .parse(process.argv);

const valid = ('path' in options);
if (valid !== true) {
    logger.error("Missing mandatory argument, path (recording content full path) must be passed as arg, in command line");
    process.exit(1);
}

// 07-11-17 todo Lilach:
// support use case of VOD replace using media.updateContent (example: live stream starts to primary and backup than stream to primary stops)

//nvm run v6.3.0 /opt/kaltura/liveController/latest/lib/recording/RestoreRecordingFromBackup.js -p "/web/content/kLive/liveRecorder/recordings/append/n/1_y9tatu4n/UNKNOWN"
let arg = options.path.split(/[\/]+/);
let recordedEntryId = arg[arg.length - 1];
const entryId = arg[arg.length - 2];
const stampPath = path.join(options.path, 'stamp');
let partnerId = -1;
let restoreRecordingStatus = 'succeeded';
let status = 0;
let durationMsec = -1;
const mediaServerIndex = kalturaTypes.KalturaEntryServerNodeType.LIVE_PRIMARY;
const liveEntryStatus = kalturaTypes.KalturaEntryServerNodeStatus.PLAYABLE;
logger.info(`[${entryId}-${recordedEntryId}], registerMediaServer host [${mediaServerHostname}], path: [${options.path}], duration: [${durationMsec}] msec, received from command line`);

qio.read(stampPath, 'r')
    .then(content => {
        if (content) {
            durationMsec = content;
            logger.debug(`[${entryId}] successfully read recording duration from stamp, value is [${durationMsec}] msec`);
        }
        else {
            let errorMsg = `[${entryId}] invalid recording duration read from [${options.path}]`;
            logger.error(errorMsg);
            return Q.reject(new Error(errorMsg));
        }
    })
    .then(()=> {
        return backendClient.getEntryInfo(entryId)
    })
    .then((entryObject)=> {
        partnerId = entryObject.partnerId;
        if (!entryObject.recordedEntryId) {
            entryObject.serverType = mediaServerIndex;
            return backendClient.registerEntryInDatabase(entryObject, liveEntryStatus, 'play')
                .then((reply)=> {
                    recordedEntryId = reply.recordedEntryId;
                    logger.info(`[${entryId}-${recordedEntryId}] after register media server`)
                    reply.serverType = mediaServerIndex;
                    logger.info(`wait 10 seconds before unregister`)
                    return Q.delay(10000).then(()=>{
                        backendClient.unregisterEntryInDatabase(reply)
                            .then(()=> {
                                logger.debug(`[${entryId}-${recordedEntryId}] after unregister media server`)
                            }).catch( ()=> {
                                //we don't actually care on unregister...
                                return Q.resolve();
                            });
                    });});
        }
        else {
            recordedEntryId = entryObject.recordedEntryId;
            logger.debug(`[${entryId}-${recordedEntryId}] after getEntryInfo`)
        }
    })
    .then(()=> {
        let recordingPath = options.path;
        if (!recordedEntryId) {
            logger.warn(`[${entryId}-${recordedEntryId}], can't link recorded entry into live, recorded entry is unknown`);
            return Q.reject(new Error('failed to restore recording recordedEntryId is UNKNOWN'));
        }
        let accessibleRecordingFolder = PersistenceFormat.getEntryBasePath(recordedEntryId);
        logger.info(`[${entryId}-${recordedEntryId}], Accessible recording`);
        return qio.symbolicLink(accessibleRecordingFolder, recordingPath, 'directory')
            .then(()=> {
                logger.info(`[${entryId}-${recordedEntryId}] successfully created job symlink: [${accessibleRecordingFolder}]-->[${recordingPath}]`);
                return recordingPath;
            })
            .catch((err)=> {
                if (err instanceof Error && err.code == 'EEXIST') {
                    logger.warn(`[${entryId}-${recordedEntryId}], could not create symlink: [${accessibleRecordingFolder}]-->[${recordingPath}], symlink already created.`);
                    return Q.resolve(recordingPath);
                }
                else {
                    logger.error(`[${entryId}-${recordedEntryId}], failed to create symlink: [${accessibleRecordingFolder}]-->[${recordingPath}]. Error: ${ErrorUtils.error2string(err)}`);
                    restoreRecordingStatus = 'failed';
                    status = 4;
                    return Q.resolve(recordingPath);
                }
            })
    })
    .then((recordingPath)=> {
        let destFilePath = path.join(completedRecordingFolderPath, entryId + '_' + recordedEntryId + '_' + durationMsec);
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
