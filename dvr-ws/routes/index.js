var express = require('express');
var router = express.Router();
var MasterManifestCreator = require('../../lib/MasterManifestGenerator');
var config = require('../../common/Configuration');
var logger = require('../logger/logger');
var qio = require('q-io/fs');
var persistenceFormat = require('../../common/PersistenceFormat');
var path = require('path')

router.get(/\/smil\:([^\\/]+?)\.smil\/playlist\.m3u8(?:\/(?=$))?$/i, function(req, res, next) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    var entrySmil = req.params[0];
    var tagIndex = entrySmil.lastIndexOf("_");
    var entryId = entrySmil.substring(0, tagIndex);
    var tag = entrySmil.substring(tagIndex + 1);

    logger.info('Received play manifest request with entry ' + entryId + ' and tag ' + tag);

    var entryFolder = persistenceFormat.getEntryFullPath(entryId);
    var masterManifestPath = path.join(entryFolder, tag +  '_' + persistenceFormat.getMasterManifestName());
    qio.exists(masterManifestPath).then(function(exists) {
        if (exists) {
            qio.read(masterManifestPath).then(function (masterManifestContent) {
                res.send(masterManifestContent);
            }).catch(function (err) {
                logger.error('Error reading an existing master manifest file at ' + masterManifestPath, err);
                next(err);
            })
        }
        else {
            var masterManifestCreator = MasterManifestCreator(entryId, config.get("mediaServer").hostname, config.get("mediaServer").port, config.get('mediaServer').applicationName);
            var manifestContent;
            //get master manifest
            masterManifestCreator.getManifest(fullUrl, tag).then(
                function (m3u8) {
                    manifestContent = m3u8.toString();
                    res.send(manifestContent);
                    logger.debug('Master manifest returned: \n' + m3u8.toString());
                },
                function (err) {
                    next(err);
                    return Q.reject(err);
                }).then(function () {
                    return qio.write(masterManifestPath, manifestContent)
                }).catch(function () {
                    logger.error('Error writing manifest to ' + masterManifestPath);
                });
        }
    })
});

module.exports = router;