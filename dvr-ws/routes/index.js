var express = require('express');
var router = express.Router();
var MasterManifestCreator = require('../../lib/MasterManifestGenerator');
var config = require('../../common/Configuration');
var logger = require('../logger/logger')(module);

router.get('/:app_name/smil::entrySmil.smil/playlist.m3u8', function(req, res, next) {

    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    var entrySmil = req.params['entrySmil'];
    var tagIndex = entrySmil.lastIndexOf("_");
    var entryId = entrySmil.substring(0, tagIndex);
    var tag = entrySmil.substring(tagIndex + 1);

    logger.info('Received play manifest request with entry ' + entryId + ' and tag ' + tag);

    var masterManifestCreator = MasterManifestCreator(entryId, config.get("mediaServer").hostname, config.get("mediaServer").port, config.get('mediaServer').applicationName);

    //get master manifest
    masterManifestCreator.getManifest(fullUrl, tag).then(
        function (m3u8) {
            res.send(m3u8.toString());
            logger.debug('Master manifest returned: \n' + m3u8.toString());
        }
        ,
        function (err) {
            return next(err);
        });
});

module.exports = router;