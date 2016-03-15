/**
 * Created by elad.benedict on 1/18/2016.
 */

var persistenceFormat = require('./../../common/PersistenceFormat');
var logger = require('./../logger/logger')(module);
var config = require('./../../common/Configuration');
var _ = require('underscore');
var qio = require('q-io/fs');
var Q = require('q');
var t = require('tmp');
var path = require('path');
var mkdirp = require('mkdirp');

module.exports = (function(){

    var tempNameP = Q.denodeify(t.tmpName);

    var writeFileAtomically = function(targetPath, content){
        return tempNameP().then(function(tempPath) {
            return qio.write(tempPath, content).then(function () {
                return qio.move(tempPath, targetPath);
            });
        });
    };

    var cleanFolder = function(targetPath, newName) {
        // 1. Remove folder if exists
        return qio.isDirectory(targetPath).then(function (res) {
            if (res) {
                logger.debug("Removing directory " + targetPath);
                var renamedFolderName = path.join(config.get("oldContentFolderPath"), newName + '_' + (new Date()).getTime().toString());
                return qio.rename(targetPath, renamedFolderName);
            }
        }).then(function () {
            // 2. Create (clean) folder
            logger.debug("Removed directory: " + targetPath + " and recreating it");
            var mkdirFunc = Q.denodeify(mkdirp);
            return mkdirFunc(targetPath);
        });
    };
    var existsAndNonZero = function (path) {
        return qio.stat(path).then( function (file) {
            if (file.size===0){
                return false;
            }
            return true;
        }, function () {
            return false;
        });
    };

    return {
        writeFileAtomically : writeFileAtomically,
        cleanFolder : cleanFolder,
        existsAndNonZero :existsAndNonZero
    };

})();
