var express = require('express');
var path = require('path');
var expresslogger = require('./expressLogger/logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('../common/Configuration');
var logger = require('./logger/logger');
var routes = require('./routes/index');
var accesslog = require('apache-like-accesslog');
var compression = require('compression');

var app = express();
app.set('env', 'production');

accesslog.configure({
  format: 'EXTENDED',
  directory: path.dirname(config.get('webServerParams:logFileName')),
  filename: 'access.log'});

app.use(accesslog.logger);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


function shouldCompress(req, res) {
  if (req.url.indexOf('.m3u8') > -1 ) {

    return true;
  }
  // fallback to standard filter function
  return compression.filter(req, res)
}

//app.use(logger('dev'));
app.use(compression({filter: shouldCompress}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next){
  logger.info(JSON.stringify(req.url));
  next();
})

app.disable('x-powered-by');

// express-winston logger makes sense BEFORE the router.
app.use(expresslogger.consoleLogger);

app.use(function(req, res, next) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if (req.url.indexOf('.m3u8') > -1)
  {
    res.setHeader('Cache-Control', 'public, max-age=5');
    res.setHeader('Content-Type', 'application/vnd.apple.mpegURL');
  }
  else if (req.url.indexOf('.ts') > -1)
  {
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Content-Type', 'video/MP2T');
  }

  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/' + config.get('webServerParams:applicationName'), routes);


app.use(expresslogger.errorLogger);

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

module.exports = app;
