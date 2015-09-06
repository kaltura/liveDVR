/**
 * Created by elad.benedict on 9/6/2015.
 */

var persistenceFormat = require('./PersistenceFormat');
var glob = require('glob');
var config = require('./Configuration');
var Q = require('q');
var qio = require('q-io/fs');
var _ = require('underscore');

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
                return true;
            }

            var lastModificationTime = _.chain(flavorDetails)
                .map(function (f) {
                    return f.node.mtime;
                })
                .max()
                .value();

            var currentTime = (new Date()).getTime();
            var sessionDuration = config.get('sessionDuration');
            return currentTime - lastModificationTime > sessionDuration;
        });
    };

    return  {
        isNewSession : isNewSession
    };
})();