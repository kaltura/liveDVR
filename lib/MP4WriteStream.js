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
var _ = require('underscore');
var preserveOriginalHLS = config.get('preserveOriginalHLS').enable;
var Q = require('q');
var ErrorUtils = require('./utils/error-utils');


var nativeTS2MP4 = require(path.join(__dirname, '..', 'bin', 'FormatConverter.node'));
nativeTS2MP4.Configure({ logLevel:'warn'});

class ConversionError extends  Error{
    constructor(strErr, chunkName){
        super(strErr)
        this.chunkName = chunkName
    }
}

var MP4WriteStream = (function(){
    function MP4WriteStream(chunkPath, loggerInfo) {

        var that = this;

        that.logger = loggerModule.getLogger("MP4WriteStream", loggerInfo);
        that.tsChunkPath = persistenceFormat.getTSChunknameFromMP4FileName(chunkPath);

        that.savedChunk = preserveOriginalHLS ? fs.createWriteStream(that.tsChunkPath) : undefined;

        if(that.savedChunk){
            that.savedChunk.on('error', function (err) {
                that.savedChunk.close();
                that.logger.error(`failed to save [${that.tsChunkPath}], Error: [${ErrorUtils.error2string(err)}]`);
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

function saveTS () {
    var that = this;

    if(that.chunkDownloaded) {
        var buf = Buffer.concat(that.chunks);
        return qio.write(that.tsChunkPath, buf).catch((err)=>{
            that.logger.warn("saveTS error %s",ErrorUtils.error2string(err));
            return Q.resolve();
        });
    } else {
        return Q.resolve();
    }
}

var onError = function (errObj) {
    var that = this;
    let errReason = ErrorUtils.error2string(errObj);
    that.logger.debug("onError %j conversion error: %s", that.tsChunkPath, errReason);
    if(that.ws) {
        that.ws.close();
    }
    // cleanup, dump state etc.
    // TODO: Shouldn't there be "return" here? -> Gad
    Q.allSettled([that.chunkPath ? qio.remove(that.chunkPath) : Q.resolve(),
        saveTS.call(that)])
        .then((promises) => {
            var errors = _.filter(promises,(p) => { return p.state === 'rejected'});
            _.each(errors,(e)=>{
                that.logger.warn("onError error %j",ErrorUtils.error2string(e.reason));
            });
            that.emit('error', new ConversionError(errReason, path.basename(that.tsChunkPath)))
        });
};

var onData = function (mp4Data) {
    var that = this;

    if(mp4Data == null){
        return;
    }
    //that.logger.debug("onData %d", mp4Data.length);
    try {
        that.ws.write(mp4Data);
    } catch(err){
        onError.call(that,err);
    }
};

const _stream = Symbol('_stream');

class MP4File {
    constructor(fileInfo,stream){
        this[_stream] = stream;
        _.assign(this,fileInfo);
    }
    saveAsTS(){
        return saveTS.call(this[_stream]);

    }
    get path(){
        return this[_stream].chunkPath;
    }

    set path(path){
        this[_stream].chunkPath = path;
    }
}

var onEnd = function (fileInfo) {
    var that = this;

    that.logger.trace("onEnd %j", fileInfo);
    that.ws.on('finish', function () {
        that.emit('end', new MP4File(fileInfo,that) );
        that.logger.trace("Completed ts2mp4 conversion");
    }).end();
};

/*
class GapSimulator{
    constructor(everyChunkNum,failNum){
        this.configchunks = everyChunkNum;
        this.configDropChunkNum = failNum
        this.dropIndex =  this.dropStopIndex = 0;
    }

    create(){
        if(this.dropIndex++ == this.configchunks){
            this.dropStopIndex = this.dropIndex + this.configDropChunkNum;
        }
        if(this.dropIndex > this.configchunks) {
            if (this.dropIndex < this.dropStopIndex)
                throw new Error('gggggrrrrr');
            else
                this.dropIndex = this.dropStopIndex = 0;
        }
    }
}

const sim = new GapSimulator(20,3)
*/

var onFinish = function() {
    var that = this;

    if(that.savedChunk){
        that.savedChunk.end();
    }

    if(!that.chunks.length){
        onError.call(that,'empty ts chunk!');
        return;
    }

    that.logger.trace("onFinish. Create converter ");
    var converter = new nativeTS2MP4.TS2MP4Convertor();

    that.chunkDownloaded = true;

    try {

        //sim.create();

        that.chunkPath = persistenceFormat.getMP4FileNamefromInfo(that.tsChunkPath);
        that.logger.trace("onFinish. Attempt to open file %j",that.chunkPath);
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