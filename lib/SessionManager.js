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
    //TODO : duplicate code here: timeFromLastSession and checkExpiry are doing the same task, but have diffrent threshold. Also the functions isNewSession and ShouldCallLiveEntryStop
    var sessionFileName = "sessionTimestamp";

    function timeFromLastSession(timestampFile) {
        var lastModificationTime = timestampFile.node.mtime.getTime();
        var currentTime = (new Date()).getTime();
        var sessionDuration = config.get('sessionDuration');
        var message = "Checking if this is a new session: ";
        var result = currentTime - lastModificationTime > sessionDuration;
        message += " current time: " + currentTime + "; ";
        message += " session duration: " + sessionDuration + "; ";
        message += " m3u8 last modification time: " + lastModificationTime + "; ";
        message += " is new session: " + result;
        logger.debug(message);

        return result;
    };

    function checkExpiry(timestampFile) {
        var lastModificationTime = timestampFile.node.mtime.getTime();
        var currentTime = (new Date()).getTime();
        var sessionDuration = config.get('flavorDownloaderTeardownInterval');
        var message = "Checking if this time to call stop entry downloader: ";
        var result = currentTime - lastModificationTime > sessionDuration;
        message += " current time: " + currentTime + "; ";
        message += " grace period duration: " + sessionDuration + "; ";
        message += " m3u8 last modification time: " + lastModificationTime + "; ";
        message += " ShouldCallLiveEntryStop: " + result;
        logger.debug(message);

        return result;
    };


    var isNewSession = function (entryId) {
        var entryFolder = persistenceFormat.getEntryFullPath(entryId);
        return Q.fcall(function() {
            return path.join(entryFolder, sessionFileName);
        }).then(function (timestampFilePath) {
            return qio.exists(timestampFilePath).then(function(exists){
                if (!exists) {
                    return null;
                }
                return qio.stat(timestampFilePath);
            });
        }).then(function (timestampFileDetails) {
            if (!timestampFileDetails) {
                logger.info("No timestamp file found in entry folder - starting a new session!");
                return true;
            }

            return timeFromLastSession(timestampFileDetails);
        });
    };
    var ShouldCallLiveEntryStop = function (entryId){
        var entryFolder = persistenceFormat.getEntryFullPath(entryId);
        return Q.fcall(function() {
            return path.join(entryFolder, sessionFileName);
        }).then(function (timestampFilePath) {
            return qio.exists(timestampFilePath).then(function(exists){
                if (!exists) {
                    return null;
                }
                return qio.stat(timestampFilePath);
            });
        }).then(function (timestampFileDetails) {
            if (!timestampFileDetails) {
                logger.error("No timestamp file found in entry folder");
                return null;
            }
            return checkExpiry(timestampFileDetails);
        });
    };

    var refreshSessionTimestamp = function(entryId){
        var entryFolder = persistenceFormat.getEntryFullPath(entryId);
        var timestampFilePath = path.join(entryFolder, sessionFileName);
        var promisedTouch = Q.denodeify(touch);
        return promisedTouch(timestampFilePath);
    };

    var getSessionDuration = function(){
        return config.get('sessionDuration');
    };

    return  {
        isNewSession : isNewSession,
        getSessionDuration : getSessionDuration,
        refreshSessionTimestamp : refreshSessionTimestamp,
        ShouldCallLiveEntryStop : ShouldCallLiveEntryStop
    };
})();