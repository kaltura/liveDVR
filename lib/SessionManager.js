/**
 * Created by elad.benedict on 9/6/2015.
 */

var persistenceFormat = require('./../common/PersistenceFormat');
var config = require('../common/Configuration');
var Q = require('q');
var qio = require('q-io/fs');
var _ = require('underscore');
var path = require('path');
var touch = require('touch');
var logger = require('../common/logger').getLogger('SessionManager');
const mathUtils = require('./utils/math-utils');
const sessionDuration = config.get('sessionDuration');
const flavorDownloaderTeardownInterval = config.get('flavorDownloaderTeardownInterval');


module.exports = (function(){
    var sessionFileName = "sessionTimestamp";
    function isTimeToStopSession(lastModificationTime, entryId) {
        logger.debug("[%s] Checking if grace time to stop session elapsed", entryId);
        var currentTime = new Date();
        var elapsedTimeMS = currentTime - lastModificationTime;
        logger.debug(`[${entryId}] Entry last updated at ${lastModificationTime}; time passed = ${mathUtils.durationToString(elapsedTimeMS, 2, 1000)} sec; Grace period: ${mathUtils.durationToString(flavorDownloaderTeardownInterval, 0, 1000)} seconds`);
        if (elapsedTimeMS >= flavorDownloaderTeardownInterval) {
            logger.debug(`Time to stop session the live session of [${entryId}]`);
            return true;
        }
        return false;
    }

    function isTimeToCreateNewSession(lastModificationTime, entryId) {
        logger.debug("[%s] Checking if this is a new session", entryId);
        var currentTime = new Date();
        var elapsedTimeSinceLastStopMSec = currentTime - lastModificationTime;
        logger.debug(`[${entryId}] Entry was last live at ${lastModificationTime}; time passed = ${mathUtils.durationToString(elapsedTimeSinceLastStopMSec, 2, 1000)} sec; Grace period: ${mathUtils.durationToString(sessionDuration, 0, 1000)} seconds`);
        if (elapsedTimeSinceLastStopMSec >= sessionDuration) {
            logger.debug(`Need to create new live session for [${entryId}]`);
            return true;
        }
        return false;
    }

    function isNewSession(entryId) {
        var entryFolder = persistenceFormat.getEntryBasePath(entryId);
        let timestampFilePath = path.join(entryFolder, sessionFileName)
        return qio.exists(timestampFilePath)
            .then(function(exists) {
                if (!exists) {
                    return false;
                }
                return qio.stat(timestampFilePath);
            })
            .then(function(timestampFileDetails) {
                if (!timestampFileDetails) {
                    logger.info("[%s] No timestamp file found in entry folder",entryId);
                    return true;
                }
                return isTimeToCreateNewSession(timestampFileDetails.node.mtime, entryId);
            });
    }

    function refreshSessionTimestamp(entryId) {
        var entryFolder = persistenceFormat.getEntryBasePath(entryId);
        var timestampFilePath = path.join(entryFolder, sessionFileName);
        var promisedTouch = Q.denodeify(touch);
        return promisedTouch(timestampFilePath);
    }

    return  {
        isNewSession : isNewSession,
        isTimeToStopSession : isTimeToStopSession,
        refreshSessionTimestamp : refreshSessionTimestamp
    };
})();