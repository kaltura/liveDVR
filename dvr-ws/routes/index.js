var express = require('express');
var router = express.Router();
var config = require('../../common/Configuration');
var logger = require('../logger/logger');
var path = require('path')
var persistenceFormat = require('../../common/PersistenceFormat');
var fsUtils = require('../../lib/utils/fs-utils');

// get chunklist expire age
var chunklistExpireAge = config.get("webServerParams:chunklistExpireAge");

router.get(/\/smil:([^\\/]*)_all\.smil\/([^\?]*)/i, function(req, res) {
    var entryId = req.params[0];
    var fileName = req.params[1];

    var fullPath = path.join(persistenceFormat.getEntryFullPath(entryId),fileName);

    if ( fileName.search('chunklist.m3u8') > -1 ) {

        fsUtils.checkIfFileExpired(fullPath, chunklistExpireAge)
            .then(function () {
                res.sendFile(fullPath);
            })
            .catch(function () {
                res.status(404).send('File not found');
            });
    }
    else {
        res.sendFile(fullPath);
    }

});


module.exports = router;