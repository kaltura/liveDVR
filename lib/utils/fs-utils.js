/**
 * Created by elad.benedict on 1/18/2016.
 */

var logger = require('../../common/logger').getLogger('fs-utils');
var config = require('./../../common/Configuration');
var _ = require('underscore');
var qio = require('q-io/fs');
var Q = require('q');
var t = require('tmp');
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var errorUtils = require('./../utils/error-utils');

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

    function updateFileModifiedTime(fullPath, fileModifiedTime) {

       try {
            fs.utimes(fullPath, fileModifiedTime, fileModifiedTime, function (err) {
                if (err) {
                    logger.error('error: %s, failed to update modified time of %s to %s', errorUtils.error2string(err), fullPath, fileModifiedTime.toDateString());
                }
                else {
                    logger.debug('successfully updated modified time of %s to %s', fullPath, fileModifiedTime.toDateString());
                }
            });

        } catch (e) {
            logger.error('exception, failed to set modified time of %s to %s. error: %s', fullPath, fileModifiedTime.toDateString(), errorUtils.error2string(e));
        }

    }

    function checkIfFileExpired(fullPath, fileExpireAge) {

        return Q.Promise(function(resolve, reject) {

            var oldestValidAge = Date.now() - fileExpireAge;

            try {
                    fs.stat(fullPath, function (err, stats) {
    
                    if (stats.mtime.getTime() > oldestValidAge)
                        resolve();
                    else {
                        logger.warn('modified time of %s is %s. File expired.', fullPath, stats.mtime.toDateString());
                        reject();
                    }
                });

            } catch (e) {
                logger.error('exception, failed to get modified time of %s. error: %s', fullPath, errorUtils.error2string(e));
                reject();
            }
        });
    }

    return {
        writeFileAtomically : writeFileAtomically,
        cleanFolder : cleanFolder,
        existsAndNonZero : existsAndNonZero,
        updateFileModifiedTime : updateFileModifiedTime,
        checkIfFileExpired : checkIfFileExpired
    };

})();
