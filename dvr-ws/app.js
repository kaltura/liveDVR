var express = require('express');
var path = require('path');
var expresslogger = require('./expressLogger/logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('../common/Configuration');
var logger = require('./logger/logger');
var routes = require('./routes/index');
var morgan = require('morgan');
var compression = require('compression');
var fs=require('fs');

var app = express();
app.set('env', 'production');

var accessLogStream = fs.createWriteStream(path.dirname(config.get('webServerParams:logFileName'))+'/access.log', {flags: 'a'})

app.use(morgan('combined', {stream: accessLogStream}));


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


app.get(/version/i, function(req, res) {
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.set('Content-Type', 'text/plain');
  var re=/\/v(.*)\/dvr-ws/.exec(__dirname);
  if (re!=null && re.length===2) {
    res.send(re[1]);
  } else {
    res.send(__dirname);
  }
});


app.use(express.static(path.join(__dirname, 'public')));
app.use('/' + config.get('webServerParams:applicationName'), routes);


app.use(expresslogger.errorLogger);



module.exports = app;
