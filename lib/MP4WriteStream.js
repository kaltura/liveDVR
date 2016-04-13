/**
 * Created by igors on 3/13/16.
 */


var path = require('path');
var os = require('os');
var fs = require('fs');
var util = require('util');
var Writable = require('stream').Writable;
var config = require('./../common/Configuration');

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

var MP4WriteStream = (function(){
    function MP4WriteStream(chunkPath, logger) {

        var that = this;

        var savedChunk = config.get('preserveOriginalChunk') ? fs.createWriteStream(chunkPath + '_saved.ts') : undefined;

        if(savedChunk){
            savedChunk.on('error', function (err) {
                savedChunk.close();
            })
            .on('end', function () {
                savedChunk.close();
            })
            .on('finish',function(){
                savedChunk.end();
            });
        }

        var chunks = [];
        this._write = function (chunk, encoding, callback) {
            logger.debug("MP4Writer._write chunk len " + chunk.length);
            chunks.push(chunk);
            if(savedChunk){
                savedChunk.write(chunk);
            }
            callback();
        };

        var onFinish = function() {

            var ws;
            var onError = function (err) {
               logger.debug("onError ", err);
                if(ws) {
                    ws.close();
                }
                fs.unlink(chunkPath, function(){
                    that.emit('error',err);
                });
            };

            logger.debug("onFinish. create convertor ");
            var converter = new nativeTS2MP4.TS2MP4Convertor();


            try {
                logger.debug("onFinish. attempt tp open file ");
                ws = fs.createWriteStream(chunkPath);
                ws.on('error', function (err) {
                    ws.close();
                    onError(err);
                })
                .on('end', function () {
                    ws.close();
                });
            } catch(err){
                onError(err);
                return;
            }

            var onData = function (mp4Data) {
                    if(mp4Data == null){
                        return;
                    }
                    logger.debug("onData %d", mp4Data.length);
                    try {
                        ws.write(mp4Data);
                    } catch(err){
                        onError(err);
                    }
                },
                onEnd = function (fileInfo) {
                    logger.debug("onEnd ", util.inspect(fileInfo));
                    ws.on('finish', function () {
                        logger.debug("emitting result");
                        fileInfo.path = chunkPath;
                        that.emit('end',fileInfo);
                        logger.debug("Completed ts2mp4 conversion");
                    }).end();
                };

            var buf = Buffer.concat(chunks);
            try {

                converter.on('data', onData)
                    .on('end', onEnd)
                    .on('error', onError)
                    .push(buf)
                    .end();
            } catch(err){
                onError(err);
            }
        };

        Writable.call(that,{
            decodeStrings: true,
            objectMode: false,
            highWaterMark: 1024 * 1024

        });

        that.addListener('finish',onFinish);

        return that;
    };

    return MP4WriteStream;

})();

util.inherits(MP4WriteStream, Writable);

module.exports = MP4WriteStream;