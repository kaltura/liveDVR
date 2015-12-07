var express = require('express');
var path = require('path');
var expresslogger = require('./expressLogger/logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('../common/Configuration');
var logger = require('./logger/logger');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next){
  logger.info(JSON.stringify(req.url));
  next();
})

// express-winston logger makes sense BEFORE the router.
app.use(expresslogger.consoleLogger);


app.use(express.static(path.join(__dirname, 'public')));
app.use('/' + config.get('webServerParams:applicationName'),express.static(config.get('rootFolderPath')));


app.use('/', routes);

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
