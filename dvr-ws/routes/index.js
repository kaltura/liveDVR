var express = require('express');
var router = express.Router();
var MasterManifestGenerator = require('../../lib/MasterManifestGenerator');
var config = require('../../lib/Configuration');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/application/:app_name/entry/:entry_id/tag/:tag/playlist.m3u8', function(req, res) {

  console.log('application' + req.params['app_name'] + " , entryid: " + req.params['entry_id'] + " , tag: " + req.params['tag']);

  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(fullUrl);

  var masterManifestGenerator = MasterManifestGenerator(req.params['entry_id'], config.get("mediaServer").hostname, config.get("mediaServer").port, req.params['app_name']);

  //get master manifest
  masterManifestGenerator.getManifest(fullUrl,req.params['tag']).then(
      function(m3u8) {
        res.send(m3u8.toString());
      },
      function(err) {
          res.status(500).send({ error: err }); //TODO better error
      }
  );
});


module.exports = router;
