var express = require('express');
var router = express.Router();
var MasterManifestCreator = require('../../lib/MasterManifestGenerator');
var config = require('../../lib/Configuration');

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

router.get('/error', function(req, res, next) {
    // here we cause an error in the pipeline so we see express-winston in action.
    return next(new Error("This is an error and it should be logged to the console"));
});

router.get('/:app_name/smil::entrySmil.smil/playlist.m3u8', function(req, res) {

    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    var entrySmil = req.params['entrySmil'];
    var tagIndex = entrySmil.lastIndexOf("_");
    var entryId = entrySmil.substring(0, tagIndex);
    var tag = entrySmil.substring(tagIndex + 1);

    var masterManifestCreator = MasterManifestCreator(entryId, config.get("mediaServer").hostname, config.get("mediaServer").port, req.params['app_name']);

    //get master manifest
    masterManifestCreator.getManifest(fullUrl,tag).then(
        function(m3u8) {
            res.send(m3u8.toString());
        },
        function(err) {
            return next(new Error("Failed to get m3u8 manifest " + err + err.stack));
        }
    );
});

module.exports = router;