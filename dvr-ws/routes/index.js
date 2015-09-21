var express = require('express');
var router = express.Router();
var MasterManifestCreator = require('../../lib/MasterManifestGenerator');
var config = require('../../lib/Configuration');

router.get(/\/smil\:([^\\/]+?)\.smil\/playlist\.m3u8(?:\/(?=$))?$/i, function(req, res, next) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    var entrySmil = req.params[0];
    var tagIndex = entrySmil.lastIndexOf("_");
    var entryId = entrySmil.substring(0, tagIndex);
    var tag = entrySmil.substring(tagIndex + 1);

    console.log('entrySmil: ' + entrySmil + ' entryId: ' + entryId + ' tag: ' + tag);

    var masterManifestCreator = MasterManifestCreator(entryId, config.get("mediaServer").hostname, config.get("mediaServer").port, config.get('mediaServer').applicationName);


    //get master manifest
    masterManifestCreator.getManifest(fullUrl, tag).then(
        function (m3u8) {
            res.send(m3u8.toString());
        }
        ,
        function (err) {
            return next(err);
        });
});

module.exports = router;