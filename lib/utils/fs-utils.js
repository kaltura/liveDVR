/**
 * Created by elad.benedict on 1/18/2016.
 */

var logger = require('../../common/logger').getLogger('fs-utils');
var config = require('./../../common/Configuration');
var _ = require('underscore');
var qio = require('q-io/fs');
var Q = require('q');
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var errorUtils = require('./../utils/error-utils');
var util=require('util');


module.exports = (function(){

    var sessionId=Math.ceil(Math.random()*10000000);
    var tempNumber=0;
    var pid=process.pid;

    function writeFileAtomically(targetPath, content){
        var tempPath=util.format("%s.%s.%d.%d.tmp",targetPath,pid,sessionId,tempNumber);
        tempNumber=(tempNumber+1) % 10000000;
        return qio.write(tempPath, content).then(function () {
            return qio.move(tempPath, targetPath);
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

    return {
        writeFileAtomically : writeFileAtomically,
        cleanFolder : cleanFolder,
        existsAndNonZero : existsAndNonZero,
        updateFileModifiedTime : updateFileModifiedTime
    };

})();
