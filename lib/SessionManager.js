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
module.exports = (function(){
    var sessionFileName = "sessionTimestamp";
    // TODO: Change function erase duplications -> Gad
    function lastTimestampSessionModification(lastModificationTime, isFromDisk, entryId) {
        var timeToWait;
        if (isFromDisk) {
            logger.debug("[%s] Checking if this is a new session", entryId);
            timeToWait = config.get('sessionDuration');
        }
        else {
            logger.debug("[%s] Checking if to call 'stop' for entry", entryId);
            timeToWait = config.get('flavorDownloaderTeardownInterval');
        }
        var currentTime = new Date();
        logger.debug("[%s] Entry was last live at %s; time passed = %d sec; Grace period duration: %d seconds", entryId, lastModificationTime, (currentTime - lastModificationTime)/1000, timeToWait/1000);
        return ((currentTime - lastModificationTime) >= timeToWait);
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
                return lastTimestampSessionModification(timestampFileDetails.node.mtime, true, entryId);
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
        lastTimestampSessionModification : lastTimestampSessionModification,
        refreshSessionTimestamp : refreshSessionTimestamp
    };
})();