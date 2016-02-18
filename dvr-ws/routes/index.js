var express = require('express');
var router = express.Router();
var config = require('../../common/Configuration');
var logger = require('../logger/logger');
var qio = require('q-io/fs');
var path = require('path')
var persistenceFormat = require('../../common/PersistenceFormat');

router.get(/\/smil\:([^\\/]*)_all\.smil\/([^\?]*)/i, function(req, res) {

    var entryId = req.params[0];
    var fileName = req.params[1];

    var disk = path.join(persistenceFormat.getEntryFullPath(entryId),fileName);
    res.sendFile(disk);

});

module.exports = router;