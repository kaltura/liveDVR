/**
 * Created by elad.benedict on 9/6/2015.
 */

var persistenceFormat = require('./PersistenceFormat');
var config = require('./Configuration');
var Q = require('q');
var qio = require('q-io/fs');
var logger = require('./logger/logger');
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
            var message = "Checking if this is a new session:" + "\n";
            var result = currentTime - lastModificationTime > sessionDuration;
            message += " current time: " + currentTime + "\n";
            message += " session duration: " + sessionDuration + "\n";
            message += " m3u8 last modification time: " + lastModificationTime + "\n";
            message += " is new session: " + result + "\n";
            logger.info(message);

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