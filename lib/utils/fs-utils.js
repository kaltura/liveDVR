/**
 * Created by elad.benedict on 1/18/2016.
 */

var logger = require('../../common/logger').getLogger('fs-utils');
var config = require('./../../common/Configuration');
var persistenceFormat = require('./../../common/PersistenceFormat');
var _ = require('underscore');
var qio = require('q-io/fs');
var Q = require('q');
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var errorUtils = require('./../utils/error-utils');
var util=require('util');


var sessionId = Math.ceil(Math.random()*10000000);
var tempNumber = 0;
var pid = process.pid;
let oldContentFolderPath = config.get("oldContentFolderPath");
var mkdirFunc = Q.denodeify(mkdirp);

//create archived content folder
mkdirFunc(oldContentFolderPath);

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
            return persistenceFormat.createHierarchyPath(oldContentFolderPath, "entry", newName)
                .then(({fullPath}) => {
                    let renamedFolderName = path.join(fullPath, newName + '_' + (new Date()).getTime().toString());
                    return qio.rename(targetPath, renamedFolderName);
                });
        }
    }).then(function () {
        // 2. Create (clean) folder
        logger.debug("[%s] Creating directory: %s", newName, targetPath);
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

function isSameFlavorSet(flavorsPath, flavorsSet, excludeDirs, pattern) {
    return qio.listTree(flavorsPath,
        (path, stat) => {
            // read recording content path and return the flavors dirs
            if (!stat.isDirectory()) {
                return false;
            }
            let dirName = path.split("/").pop();

            if (excludeDirs.includes(dirName)) {
                return false;
            }
            if (pattern.test(dirName)) {
                return true;
            } else {
                return false;
            }
        })
        .then((flavorsDirs)=> {
            let flavorNames = _.map(flavorsDirs, function(flavorDir) {
                let name = flavorDir.split("/").pop();
                return name;
            });
            // check if flavors match current provisioned flavors
            if (flavorNames.length != flavorsSet.length) {
                logger.debug(`found flavors mismatch, previous: [${flavorNames}] current: [${flavorsSet}]`);
                return Q.resolve(false);
            }
            // check if there are same number of flavors but not same set.
            // this situation is impossible maybe it's not relevant to check.
            let flavorsDiff = _.difference(flavorNames, flavorsSet);
            if (flavorsDiff.length > 0) {
                logger.debug(`found flavors set has same size but flavors differ, previous: [${flavorNames}] current: [${flavorsSet}]`);
                return Q.resolve(false);
            }
            return Q.resolve(true);
        });
}

module.exports = {
    writeFileAtomically : writeFileAtomically,
    cleanFolder : cleanFolder,
    existsAndNonZero : existsAndNonZero,
    isSameFlavorSet : isSameFlavorSet
};