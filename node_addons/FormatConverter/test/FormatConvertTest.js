/**
 * Created by igors on 3/3/16.
 */
var os = require('os');
var util = require('util');

function getArchAndPlatform()
{
    if (os.platform() === 'win32')
    {
        if (os.arch() === 'x64')
        {
            return "win64";
        }
        else
        {
            return "win32";
        }
    } else if (os.platform() === 'darwin') {
        return "darwin";
    }
    else
    {
        return "linux";
    }
}
var Q = require('q');
var path = require('path');
var FormatConverter = require(path.join(__dirname, '..', 'bin', getArchAndPlatform(), 'FormatConverter.node'));

FormatConverter.Configure({ logLevel:'error'});

var fs = require('fs');
var inst = 0;
var counter = 0;
var testFilePath = '/Applications/XAMPP/xamppfiles/htdocs/wn/media-uhe4wm3o6_b475136_144354229.ts';
var converters = [];
var numOfInstances =100;
var g_Done = false;


var logLevels = {
    debug : 0,
    info: 1,
    warn:2,
    error:3
};

var loggingLevel = logLevels.info;
var lastTick = Date.now();

var logFunc = function(){
    var level = Array.prototype.shift.call(arguments);
    if(level >=  loggingLevel) {
        console.log.apply(this, arguments);
    }
};

var qnd = function QnDirty (filename){

    if(g_Done){
        logFunc(logLevels.debug,"qnd g_Done set" );
        return;
    }

    var that = this;

    this.testId = counter++;

    logFunc(logLevels.debug,"create reader " ,that.testId);

    var rs = fs.createReadStream(filename);
    var bufs = [];
    rs.on('data',function(chunk){
        bufs.push(chunk);
    });
    rs.on('error',function(err){
        logFunc(logLevels.error,"create reader failed " ,err);
    });
    rs.on('end',function() {
        rs.close();

        var contentLength = bufs.reduce(function(sum, buf) {
            return sum + buf.length;
        },0);
        var fileData = Buffer.concat(bufs);

        var outputFilePath = filename + '-' + inst++ + '.mp4';

        logFunc(logLevels.debug,"create writer",that.testId);

        var ws = fs.createWriteStream(outputFilePath);

        logFunc(logLevels.debug,'create converter',that.testId);

        var converter = new FormatConverter.TS2MP4Convertor();
        converter._state = 'new';
        converter.fileName = outputFilePath;

        converters.push(converter);

        var cleanup = function(err) {
            if (err) {
                converter._state = err;
                logFunc(logLevels.warn,err);
            }
            delete converter;
            converter._state = 'deleted';
            fs.unlink(outputFilePath);
            var idx = converters.indexOf(converter);
            if (idx < 0) {
                logFunc(logLevels.error,'what? converter %d not present is converters!!!', converter.testId);
            } else {
                delete converters[idx];
                converters.splice(idx,1);
            }
            var logLevel = logLevels.debug
            if(lastTick && lastTick < Date.now()) {
                logLevel = logLevels.info;
                lastTick = Date.now() + 3000;
            }
            logFunc(logLevel,"spawn new iteration: %d. # of converters: %d ", that.testId, converters.length);
             process.nextTick(function () {
                 qnd(testFilePath);
             });
        };

        ws.on('finish',function(){
            cleanup();
        });

        ws.on('error',cleanup);

        logFunc(logLevels.debug,'write data to converter',that.testId);

        converter.on('end',function(fileInfo){
              logFunc(logLevels.debug, "done writing  " + that.testId+" "+util.inspect(fileInfo));
             converter._state = 'end_write';
             ws.end();

        })
        converter._state = 'pushing';
        converter.on('data',function(data){
            converter._state = 'write';
            ws.write(data,function(){
                delete data;
            });
        })
        .on('error',cleanup)
        .push(fileData).end();
        converter._state = 'end_push';

    });
    rs.resume();
};

var afterTest = function(){
    g_Done = true;
    logFunc(logLevels.warn,"exit test" ,numOfInstances);
    converters.forEach(function(c){
        fs.unlink(c.fileName,function(){

        });
    });
};
process.on('SIGINT', afterTest);

process.on('exit',afterTest);

logFunc(logLevels.warn,"start test # of converters " ,numOfInstances);
    for(var i = 0; i < numOfInstances; i++)
    {
        qnd(testFilePath);
    }
