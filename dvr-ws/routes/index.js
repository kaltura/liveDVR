var express = require('express');
var router = express.Router();
var config = require('../../common/Configuration');
var logger = require('../logger/logger');
var path = require('path')
var persistenceFormat = require('../../common/PersistenceFormat');
var request = require('request');
var util = require('util');
var fs = require('fs');
var errorUtils = require('../../lib/utils/error-utils');


var wsPort = config.get("mediaServer:port");
var urlPattern='http://localhost:%s/kLive/smil:%s_all.smil/%s';

router.get(/\/smil:([^\/]*)_pass.smil\/(.*)/i, function(req, res) {

    var entryId = req.params[0];
    var path = req.params[1];

    var newUrl=util.format(urlPattern,wsPort,entryId,path);
    //logger.error('_pass %s %s %s', entryId, path,newUrl);
    request(newUrl).pipe(res);
});


// get chunklist expire age
var chunklistExpireAge = config.get("webServerParams:chunklistExpireAge");

router.get(/\/smil:([^\\/]*)_(?:all|publish)\.smil\/([^\?]*)/i, function(req, res) {
    var entryId = req.params[0];
    var fileName = req.params[1];

    var fullPath = path.join(persistenceFormat.getEntryFullPath(entryId),fileName);

    if ( fileName.search('chunklist.m3u8') > -1 ) {
        checkExpriedAndSendFile(fullPath, res);
    }
    else {
        res.sendFile(fullPath);
    }

});

function checkExpriedAndSendFile(fullPath, res) {

    fs.stat(fullPath, function (err, stats) {
        if (err) {
            logger.error('failed to get modified time of %s. error: %s', fullPath, errorUtils.error2string(err));
            return res.status(404).send('Error, cannot access file');
        }
        else {
            var now=new Date();
            if (now - stats.mtime <= chunklistExpireAge) {
                //logger.debug('modified time of %s is %s. File is valid.', fullPath, stats.mtime.toDateString());
                res.sendFile(fullPath);
            }
            else {
                logger.warn('modified time of %s is %s which is smaller then now (%s) (threshold %s). File expired.', fullPath, stats.mtime,now,chunklistExpireAge);
                res.status(404).send('File expired');
            }
        }
    });
}

module.exports = router;