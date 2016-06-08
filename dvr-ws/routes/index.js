var express = require('express');
var router = express.Router();
var config = require('../../common/Configuration');
var logger = require('../logger/logger');
var path = require('path')
var persistenceFormat = require('../../common/PersistenceFormat');

router.get(/\/smil\:([^\\/]*)_all\.smil\/([^\?]*)/i, function(req, res) {
    var that = this;
    var entryId = req.params[0];
    var fileName = req.params[1];

    var fullpath = path.join(persistenceFormat.getEntryFullPath(entryId),fileName);
    res.sendFile(fullpath);
/*
    checkFileModifiedTime(fullpath)
        .then( function() {
            res.sendFile(fullpath);
        })
        .catch( function() {
            res.status(404).send('%s not found', that.filename);
        });
*/
});


module.exports = router;