/**
 * Created by igors on 3/13/16.
 */


var path = require('path');
var os = require('os');
var fs = require('fs');
var util = require('util');
var Writable = require('stream').Writable;
var config = require('./../common/Configuration');
var qio = require('q-io/fs');
var persistenceFormat = require('./../common/PersistenceFormat');
var loggerModule = require('../common/logger');

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

var nativeTS2MP4 = require(path.join(__dirname, '..', 'bin', getArchAndPlatform(), 'FormatConverter.node'));
nativeTS2MP4.Configure({ logLevel:'warn'});

var ConversionError = function(strErr,chunkName){
    Error.prototype.constructor.call(this);
    this.message = strErr;
    this.chunkName = chunkName;
};

util.inherits(ConversionError, Error);

var MP4WriteStream = (function(){
    function MP4WriteStream(chunkPath, loggerInfo) {

        var that = this;

        that.logger = loggerModule.getLogger("MP4WriteStream", loggerInfo);
        that.chunkPath = chunkPath;

        that.savedChunk = config.get('preserveOriginalChunk') ? fs.createWriteStream(chunkPath + '_saved.ts') : undefined;

        if(that.savedChunk){
            that.savedChunk.on('error', function () {
                that.savedChunk.close();
            })
                .on('end', function () {
                    that.savedChunk.close();
                })
                .on('finish',function(){
                    that.savedChunk.end();
                });
        }

        that.chunks = [];

        Writable.call(that,{
            decodeStrings: true,
            objectMode: false,
            highWaterMark: 1024 * 1024

        });

        that.addListener('finish',function(){
            onFinish.call(that);
        });

        return that;
    }

    return MP4WriteStream;

})();

util.inherits(MP4WriteStream, Writable);


MP4WriteStream.prototype._write = function (chunk, encoding, callback) {
    var that = this;

   // that.logger.debug("MP4Writer._write chunk len " + chunk.length);

    that.chunks.push(chunk);
    if(that.savedChunk){
        that.savedChunk.write(chunk);
    }
    callback();
};

var onError = function (errStr) {
    var that = this;

    that.logger.debug("onError %s conversion error: %s", that.chunkPath, errStr);
    if(that.ws) {
        that.ws.close();
    }
    fs.unlink(that.chunkPath, function(){
        that.emit('error',new ConversionError(errStr,path.basename(that.chunkPath)));
    });
};

var onData = function (mp4Data) {
    var that = this;

    if(mp4Data == null){
        return;
    }
    that.logger.debug("onData %d", mp4Data.length);
    try {
        that.ws.write(mp4Data);
    } catch(err){
        onError.call(that,err);
    }
};

var onEnd = function (fileInfo) {
    var that = this;

    that.logger.debug("onEnd ", util.inspect(fileInfo));
    that.ws.on('finish', function () {
        that.logger.debug("emitting result");
        fileInfo.path = path.join(path.dirname(that.chunkPath),persistenceFormat.getMP4FileNamefromInfo(fileInfo));
        try {
            qio.rename(that.chunkPath, fileInfo.path)
                .then(function () {
                    that.emit('end', fileInfo);
                    that.logger.debug("Completed ts2mp4 conversion");
                })
                .catch(function (err) {
                    onError(err);
                });
        } catch(err) {
            onError(err);
        }
    }).end();
};

var onFinish = function() {
    var that = this;

    if(that.savedChunk){
        that.savedChunk.end();
    }

    that.logger.debug("onFinish. Create converter ");
    var converter = new nativeTS2MP4.TS2MP4Convertor();

    try {
        that.logger.debug("onFinish. Attempt to open file ");
        that.ws = fs.createWriteStream(that.chunkPath);
        that.ws.on('error', function (err) {
            that.ws.close();
            onError.call(that,err);
        })
            .on('end', function () {
                that.ws.close();
            });
    } catch(err){
        onError.call(that,err);
        return;
    }

    var buf = Buffer.concat(that.chunks);
    try {
        converter.on('data', onData,that)
            .on('end', onEnd,that)
            .on('error', onError,that)
            .push(buf)
            .end();
    } catch(err){
        onError.call(that,err);
    }
};

module.exports.MP4WriteStream = MP4WriteStream;
module.exports.ConversionError = ConversionError;