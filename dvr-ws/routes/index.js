var express = require('express');
var router = express.Router();
var config = require('../../common/Configuration');
var logger = require('../logger/logger');
var path = require('path')
var persistenceFormat = require('../../common/PersistenceFormat');
var fs = require('fs');
var errorUtils = require('../../lib/utils/error-utils');

// get chunklist expire age
var chunklistExpireAge = config.get("webServerParams:chunklistExpireAge");

router.get(/\/smil:([^\\/]*)_all\.smil\/([^\?]*)/i, function(req, res) {
    var entryId = req.params[0];
    var fileName = req.params[1];

    var fullPath = path.join(persistenceFormat.getEntryFullPath(entryId),fileName);

    if ( fileName.search('chunklist.m3u8') > -1 ) {

        if (false === checkIfFileExpired(fullPath, chunklistExpireAge)) {
                res.sendFile(fullPath);
        }
        else {
                res.status(404).send('File expired');
        }
    }
    else {
        res.sendFile(fullPath);
    }

});

function checkIfFileExpired(fullPath, fileExpireAge) {

    var oldestValidAge = Date.now() - fileExpireAge;

    try {
         var stats = fs.statSync(fullPath);
        
         if (stats.mtime.getTime() >= oldestValidAge) {
            logger.debug('modified time of %s is %s. File is valid.', fullPath, stats.mtime.toDateString());
            return false;
        }
        else {
             logger.warn('modified time of %s is %s. File expired.', fullPath, stats.mtime.toDateString());
             return true;
        }
    } catch (e) {
        logger.error('exception, failed to get modified time of %s. error: %s', fullPath, errorUtils.error2string(e));
    }
}

module.exports = router;