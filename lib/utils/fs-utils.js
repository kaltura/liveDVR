/**
 * Created by elad.benedict on 1/18/2016.
 */

var logger = require('../../common/logger').getLogger('FS-utils');
var config = require('./../../common/Configuration');
var _ = require('underscore');
var qio = require('q-io/fs');
var Q = require('q');
var t = require('tmp');
var path = require('path');
var mkdirp = require('mkdirp');

module.exports = (function(){

    var tempNameP = Q.denodeify(t.tmpName);

    function writeFileAtomically(targetPath, content){
        return tempNameP().then(function(tempPath) {
            return qio.write(tempPath, content).then(function () {
                return qio.move(tempPath, targetPath);
            });
        });
    }

    function cleanFolder(targetPath, newName) {
        // 1. Remove folder if exists
        return qio.isDirectory(targetPath).then(function (res) {
            if (res) {
                logger.debug("Removing directory " + targetPath);
                var renamedFolderName = path.join(config.get("oldContentFolderPath"), newName + '_' + (new Date()).getTime().toString());
                return qio.rename(targetPath, renamedFolderName);
            }
        }).then(function () {
            // 2. Create (clean) folder
            logger.debug("Removed directory: %s and recreating it", targetPath);
            var mkdirFunc = Q.denodeify(mkdirp);
            return mkdirFunc(targetPath);
        });
    }

    function existsAndNonZero(path) {
        return qio.stat(path)
            .then(function(file) {
                return !(file.size === 0);
            }, function() {
                return false;
            });
    }

    return {
        writeFileAtomically : writeFileAtomically,
        cleanFolder : cleanFolder,
        existsAndNonZero : existsAndNonZero
    };

})();
