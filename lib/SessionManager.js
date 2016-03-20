/**
 * Created by elad.benedict on 9/6/2015.
 */

var persistenceFormat = require('./../common/PersistenceFormat');
var config = require('../common/Configuration');
var Q = require('q');
var qio = require('q-io/fs');
var _ = require('underscore');
var logger = require('./logger/logger')(module);
var path = require('path');
var touch = require('touch');

module.exports = (function(){
    var sessionFileName = "sessionTimestamp";

    function lastTimestampSessionModification(lastModificationTime, isFromDisk, entryId) {
        var timeToWait;
        var message;
        if (isFromDisk) {
            logger.info("Checking if this is a new session for entry %s", entryId);
            timeToWait = config.get('sessionDuration');
            message = "Is this a new session result: ";
        }
        else {
            logger.info("Checking if to call 'stop' for entry %s", entryId);
            timeToWait = config.get('flavorDownloaderTeardownInterval');
            message = "Should entry stop result: ";
        }
        var currentTime = new Date();
        var result = (currentTime - lastModificationTime) > timeToWait;
        logger.debug("m3u8 last modification time: %s; Grace period duration: %s seconds", lastModificationTime, timeToWait/1000);
        logger.info("%s: %s", message, result);

        return result;
    }

    function isNewSession(entryId) {
        var entryFolder = persistenceFormat.getEntryFullPath(entryId);
        return Q.fcall(function() {
                return path.join(entryFolder, sessionFileName);
            })
            .then(function(timestampFilePath) {
                return qio.exists(timestampFilePath)
                    .then(function(exists){
                        if (!exists) {
                            return null;
                        }
                        return qio.stat(timestampFilePath);
                    });
            })
            .then(function(timestampFileDetails) {
                if (!timestampFileDetails) {
                    logger.info("No timestamp file found in entry folder - starting a new session!");
                    return true;
                }
                return lastTimestampSessionModification(timestampFileDetails.node.mtime, true, entryId);
            });
    }

    function refreshSessionTimestamp(entryId) {
        var entryFolder = persistenceFormat.getEntryFullPath(entryId);
        var timestampFilePath = path.join(entryFolder, sessionFileName);
        var promisedTouch = Q.denodeify(touch);
        return promisedTouch(timestampFilePath);
    }

    function getSessionDuration() {
        return config.get('sessionDuration');
    }

    return  {
        isNewSession : isNewSession,
        lastTimestampSessionModification : lastTimestampSessionModification,
        getSessionDuration : getSessionDuration,
        refreshSessionTimestamp : refreshSessionTimestamp
    };
})();