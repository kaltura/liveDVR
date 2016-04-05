/**
 * Created by elad.benedict on 1/18/2016.
 */

var logger = require('./../logger/logger')(module);
var config = require('./../../common/Configuration');
var _ = require('underscore');
var qio = require('q-io/fs');
var Q = require('q');
var path = require('path');
var mkdirp = require('mkdirp');
var fs= require ('fs');
var AtomicallyTmpFileIndex=0;
module.exports = (function(){


    var writeFileAtomically = function(targetPath, content){
        var def=Q.defer();
        var tempPath=targetPath+".temp."+AtomicallyTmpFileIndex;
        AtomicallyTmpFileIndex++;
        fs.writeFile(tempPath,content,function(err){
            if (err) {
                fs.unlink(tempPath);
                logger.error("Failed to write to file %s", tempPath);
                def.reject();
            }
            else
            {
                fs.rename(tempPath, targetPath, function(err) {
                    if (err) {
                        logger.error("Failed to rename "+tempPath+" to "+targetPath);
                        fs.unlink(tempPath);
                        def.reject();
                    }
                    else
                    {
                        def.resolve();
                    }
                })
            }
        });
        return def.promise;
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
            logger.debug("Removed directory: %s and recreating it", targetPath);
            var mkdirFunc = Q.denodeify(mkdirp);
            return mkdirFunc(targetPath);
        });
    };

    var existsAndNonZero = function (path) {
        return qio.stat(path)
            .then(function(file) {
                if (file.size === 0){
                    logger.warn("File "+path+" has zero bytes");
                    return false;
                }
                return true;
            }, function() {
                return false;
            });
    };

    return {
        writeFileAtomically : writeFileAtomically,
        cleanFolder : cleanFolder,
        existsAndNonZero : existsAndNonZero
    };

})();
