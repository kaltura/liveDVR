var express = require('express');
var router = express.Router();
var config = require('../../common/Configuration');
var logger = require('../logger/logger');
var qio = require('q-io/fs');
var path = require('path')
var persistenceFormat = require('../../common/PersistenceFormat');
var request = require('request');
var util = require('util');


var urlPattern='http://localhost/kLive/smil:%s_all.smil/%s';

router.get(/\/smil:([^\/]*)_pass.smil\/(.*)/i, function(req, res) {

    var entryId = req.params[0];
    var path = req.params[1];

    request(util.format(urlPattern,entryId,path)).pipe(res);
});


router.get(/\/smil:([^\\/]*)_(?:all|publish)\.smil\/([^\?]*)/i, function(req, res) {

    var entryId = req.params[0];
    var fileName = req.params[1];

    var disk = path.join(persistenceFormat.getEntryFullPath(entryId),fileName);
    res.sendFile(disk);

});

module.exports = router;