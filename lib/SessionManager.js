/**
 * Created by elad.benedict on 9/6/2015.
 */

var persistenceFormat = require('./../common/PersistenceFormat');
var config = require('../common/Configuration');
var Q = require('q');
var qio = require('q-io/fs');
var logger = require('./logger/logger')(module);
var path = require('path');
var touch = require('touch');

module.exports = (function(){

    var sessionFileName = "sessionTimestamp";

    var isNewSession = function isNewSession(entryId) {
        return Q.fcall(function () {
            var entryFolder = persistenceFormat.getEntryFullPath(entryId);
            var timestampFilePath = path.join(entryFolder, sessionFileName);
            return timestampFilePath;
        }).then(function (timestampFilePath) {
            return qio.exists(timestampFilePath).then(function(exists){
                if (!exists)
                {
                    return null;
                }
                return qio.stat(timestampFilePath);
            });
        }).then(function (timestampFileDetails) {
            if (!timestampFileDetails) {
                logger.info("No timestamp file found in entry folder - starting a new session");
                return true;
            }

            var lastModificationTime = timestampFileDetails.node.mtime.getTime();
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
        refreshSessionTimestamp : refreshSessionTimestamp
    };
})();