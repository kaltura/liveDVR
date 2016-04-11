/*
*   vod packager playlist implementation.
 *   for details see https://github.com/kaltura/nginx-vod-module
* */

var ConcatSource = require('./ConcatSource');
 var    _ = require('underscore');
var util = require('util');
var playlistUtils = require('./playlistGenrator-utils');
var PlaylistItem = require('./PlaylistItem');
var BroadcastEventEmitter = require('./BroadcastEventEmitter');

//MixFilterClip

function MixFilterClip(logger,serializationCtx) {

    PlaylistItem.prototype.constructor.call(this,logger,serializationCtx);
    if(!Object.keys(this.inner).length) {
        this.inner.type = "mixFilter";
        this.inner.sources = [];
    }
}

util.inherits(MixFilterClip,PlaylistItem);

MixFilterClip.prototype.validate = function validate(opts) {
    var that = this;

    if(that.inner.basePath && !fs.existsSync(that.inner.basePath)){
        that.logger.warn("that.inner.basePath && !fs.existsSync(that.inner.basePath)" + that.inner.basePath);
        return false;
    }

    if(that.inner.type !== "mixFilter") {
        that.logger.warn('type !== "mixFilter"');
        return false;
    }

    if( that.inner.sources.length === 0 || that.inner.sources.length > 2 ) {
        that.logger.warn('sources.length === 0 || sources.length > 2');
        return false;
    }

    return that.inner.sources.every(function(s){
        return s.validate(opts);
    });
};


var validateInput = function(fileInfo){
    if(!fileInfo){
        that.logger.warn('MixFilterClip.validateInput bad fileInfo');
        return false;
    }

    if(!fileInfo.flavor){
        that.logger.warn('MixFilterClip.validateInput bad fileInfo.flavor');
        return false;
    }

    if(!fileInfo.sig || typeof fileInfo.sig !== 'string'){
        that.logger.warn('MixFilterClip.validateInput bad fileInfo.sig');
        return false;
    }

    if(!fileInfo.video &&  !fileInfo.audio){
        that.logger.warn('MixFilterClip.validateInput !fileInfo.video &&  !fileInfo.audio');
        return false;
    }

    if(fileInfo.video) {
        if (typeof fileInfo.video.firstDTS !== 'number') {
            that.logger.warn("MixFilterClip.validateInput typeof fileInfo.video.firstDTS !== 'number'");
            return false;
        }

        if (typeof fileInfo.video.firstEncoderDTS !== 'number') {
            that.logger.warn("'MixFilterClip.validateInput typeof fileInfo.video.firstEncoderDTS !== 'number'");
            return false;
        }

        if (typeof fileInfo.video.duration !== 'number') {
            that.logger.warn("MixFilterClip.validateInput typeof fileInfo.video.duration !== 'number'");
            return false;
        }
        if (fileInfo.video.duration <= 0) {
            that.logger.warn('MixFilterClip.validateInput fileInfo.video.duration  <= 0');
            return false;
        }
    }

    if(fileInfo.audio) {
        if (typeof fileInfo.audio.firstDTS !== 'number') {
            that.logger.warn("MixFilterClip.validateInput typeof fileInfo.audio.firstDTS !== 'number'");
            return false;
        }

        if (typeof fileInfo.audio.firstEncoderDTS !== 'number') {
            that.logger.warn("'MixFilterClip.validateInput typeof fileInfo.audio.firstEncoderDTS !== 'number'");
            return false;
        }

        if (typeof fileInfo.audio.duration !== 'number') {
            that.logger.warn("MixFilterClip.validateInput typeof fileInfo.audio.duration !== 'number'");
            return false;
        }
        if (fileInfo.audio.duration <= 0) {
            that.logger.warn('MixFilterClip.validateInput fileInfo.audio.duration  <= 0');
            return false;
        }
    }
    return true;
};

MixFilterClip.prototype.insert = function (fileInfo,expires) {
    var that = this;

    if(!validateInput.call(that,fileInfo)){
        throw new Error('bad input fileInfo');
    }

    if(fileInfo.video && that.inner.sources.length < 2 && that.inner.sources.every( function(s){
            return s.inner.tracks !== 'v';
        })){
        that.inner.sources.push(new ConcatSource(that.logger,"v1",fileInfo.path));
        if(playlistUtils.playlistConfig.useAudio && fileInfo.audio){
            that.inner.sources.push(new ConcatSource(that.logger,"a1",fileInfo.path));
        }

        _.each(that.inner.sources,function(s){
            s.addListener(that.listener);
        });
    }


    for( var idx = 0; idx < that.inner.sources.length; idx++ ) {
        var src = that.inner.sources[idx];

        var track;

        switch (src.inner.tracks[0]) {
            case 'v':
                track = fileInfo.video;
                break;
            case 'a':
                track = fileInfo.audio;
                break;
            default:
                throw new Error('unsupported trak type ' + src.inner.tracks);
                break;
        }

        that.logger.debug('MixFilterClip.insert. clip=%s track=%s duration=%d. first_dts=%d enc_dts=%d expires=%s',
            fileInfo.path,src.inner.tracks,track.duration,track.firstDTS,track.firstEncoderDTS,expires);

        if( track.duration <= 0 ) {
            that.logger.warn('MixFilterClip.insert: bad duration: %d clip: (%s)',track.duration,fileInfo.path);
            throw new Error('bad clip duration <= 0');
        }

        src.concatClip(fileInfo,track,expires);
    }
    return this;
};

MixFilterClip.prototype.checkExpires = function (expires,maxChunkCount){
    var that = this;

    var paths = [];

    that.logger.debug('MixFilterClip.checkExpires. expires=%d',expires);

    _.each(this.inner.sources,function (s) {
        var p = s.checkExpires(expires,maxChunkCount);
        p = _.filter(p,function(file) {
            return _.every(that.inner.sources,function (s1) {
                return s1.inner.paths.indexOf(file) < 0;
            });
        });
        paths = paths.concat(p);
    });
    return paths;
};

MixFilterClip.prototype.getDTSRange = function(){
    var that = this;

    var retVal = {
        min: Number.MIN_VALUE,
        max: Number.MAX_VALUE
    };

    _.each(that.inner.sources,function(s) {
        var range = s.getDTSRange();
        retVal.min = Math.max(range[0],retVal.min);
        retVal.max = Math.min(range[1] ,retVal.max);
    });

    that.logger.debug('MixFilterClip.getDTSRange. min=%d max=%d',retVal.min,retVal.max);

    return retVal;
};

MixFilterClip.prototype.getTotalDuration = function(){
    var that = this;

    var range = that.getDTSRange();
    if(range.min ===  Number.MIN_VALUE){
        return 0;
    }
    return range.max - range.min;
};

MixFilterClip.prototype.isEmpty = function(){
    var sources = this.inner.sources;
    return !(sources.length && _.min(sources,function(s){
      return s.inner.durations.length
     }) > 0 );
};

MixFilterClip.prototype.updateOffset = function(firstClipTime){
    var that = this;
    _.each(that.inner.sources,function(s) {
        s.updateOffset(firstClipTime);
    });
};

MixFilterClip.prototype.onSerialize = function () {
    var that = this;

    that.inner.sources = that.inner.sources.map(function(s){
        return new ConcatSource(that.logger,s);
    });
};

MixFilterClip.prototype.collapseGap = function (from,to) {
    var that = this;
    _.each(that.inner.sources,function(s){
        s.collapseGap(from,to);
    });
};

MixFilterClip.prototype.addListener = function(listener){
    BroadcastEventEmitter.prototype.addListener.call(this,listener);
    var that = this;
    _.each(that.inner.sources,function(s){
        s.addListener(listener);
    });
};

MixFilterClip.prototype.removeListener = function(listener){
    playlistUtils.BroadcastEventEmitter.prototype.removeListener.call(this,listener);
};

module.exports = MixFilterClip;
