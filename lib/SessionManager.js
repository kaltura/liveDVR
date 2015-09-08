/**
 * Created by elad.benedict on 9/6/2015.
 */

var persistenceFormat = require('./PersistenceFormat');
var glob = require('glob');
var config = require('./Configuration');
var Q = require('q');
var qio = require('q-io/fs');
var _ = require('underscore');
var logger = require('./logger/logger');

module.exports = (function(){

    var isNewSession = function isNewSession(entryId) {
        return Q.fcall(function () {
            var entryFolder = persistenceFormat.getEntryFullPath(entryId);
            return entryFolder;
        }).then(function (entryFolder) {
            var getManifestFiles = Q.denodeify(glob);
            return getManifestFiles("**/*.m3u8", {cwd: entryFolder, realpath: true});
        }).then(function (files) {
            // Get details for all the flavor manifests
            var fileDetails = _.map(files, function (f) {
                return qio.stat(f);
            });
            return Q.all(fileDetails);
        }).then(function (flavorDetails) {
            if (flavorDetails.length === 0) {
                logger.info("No m3u8 files found in entry folder - starting a new session");
                return true;
            }

            var lastModificationTime = _.chain(flavorDetails)
                .map(function (f) {
                    return f.node.mtime;
                })
                .max()
                .value()
                .getTime();

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

    return  {
        isNewSession : isNewSession
    };
})();