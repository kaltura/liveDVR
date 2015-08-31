var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('../lib/Configuration');
var MasterManifestGenerator = require('../lib/MasterManifestGenerator');

//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(config.get('rootFolderPath')));


//app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  console.log('DEBUG');
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.get('/application/:app_name/entry/:entry_id/tag/:tag/playlist.m3u8', function(req, res) {

  console.log('application' + req.params['app_name'] + " , entryid: " + req.params['entry_id'] + " , tag: " + req.params['tag']);

  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(fullUrl);

  var masterManifestGenerator = MasterManifestGenerator(req.params['entry_id'], config.get("mediaServer").hostname, config.get("mediaServer").port, req.params['app_name']);

  //get master manifest
  //fullUrl = 'http://kalsegsec-a.akamaihd.net/dc-1/m/ny-live-publish1/kLive/smil:1_oorxcge2_all.smil/playlist.m3u8';
  masterManifestGenerator.getManifest(fullUrl,req.params['tag']).then(
      function(m3u8) {
        res.send(m3u8.toString());
      },
      function(err) {
        res.status(500).send({ error: err }); //TODO better error
      }
  );
});


module.exports = app;
