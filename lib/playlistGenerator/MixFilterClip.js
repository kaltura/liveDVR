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

function MixFilterClip(serializationCtx) {

    PlaylistItem.prototype.constructor.call(this,serializationCtx);
    if(!Object.keys(this.inner).length) {
        this.inner.type = "mixFilter";
        this.inner.sources = [];
    }
}

MixFilterClip.prototype = {
    get clipCount () {
        return this.sources ? this.sources[0].durations.length : 0;
    }
};

util.inherits(MixFilterClip,PlaylistItem);

MixFilterClip.prototype.validate = function validate(opts) {
    var that = this;

    if(that.inner.basePath && !fs.existsSync(that.inner.basePath)){
        playlistUtils.Warn("that.inner.basePath && !fs.existsSync(that.inner.basePath)" + that.inner.basePath);
        return false;
    }

    if(that.inner.type !== "mixFilter") {
        playlistUtils.Warn('type !== "mixFilter"');
        return false;
    }

    if( that.inner.sources.length === 0 || that.inner.sources.length > 2 ) {
        playlistUtils.Warn('sources.length === 0 || sources.length > 2');
        return false;
    }

    return that.inner.sources.every(function(s){
        return s.validate(opts);
    });
};


var validateInput = function(fileInfo){
    if(!fileInfo){
        playlistUtils.Warn('MixFilterClip.validateInput bad fileInfo');
        return false;
    }

    if(!fileInfo.flavor){
        playlistUtils.Warn('MixFilterClip.validateInput bad fileInfo.flavor');
        return false;
    }

    if(!fileInfo.sig || typeof fileInfo.sig !== 'string'){
        playlistUtils.Warn('MixFilterClip.validateInput bad fileInfo.sig');
        return false;
    }

    if(!fileInfo.video &&  !fileInfo.audio){
        playlistUtils.Warn('MixFilterClip.validateInput !fileInfo.video &&  !fileInfo.audio');
        return false;
    }

    if(fileInfo.video) {
        if (typeof fileInfo.video.firstDTS !== 'number') {
            playlistUtils.Warn("MixFilterClip.validateInput typeof fileInfo.video.firstDTS !== 'number'");
            return false;
        }

        if (typeof fileInfo.video.firstEncoderDTS !== 'number') {
            playlistUtils.Warn("'MixFilterClip.validateInput typeof fileInfo.video.firstEncoderDTS !== 'number'");
            return false;
        }

        if (typeof fileInfo.video.duration !== 'number') {
            playlistUtils.Warn("MixFilterClip.validateInput typeof fileInfo.video.duration !== 'number'");
            return false;
        }
        if (fileInfo.video.duration <= 0) {
            playlistUtils.Warn('MixFilterClip.validateInput fileInfo.video.duration  <= 0');
            return false;
        }
    }

    if(fileInfo.audio) {
        if (typeof fileInfo.audio.firstDTS !== 'number') {
            playlistUtils.Warn("MixFilterClip.validateInput typeof fileInfo.audio.firstDTS !== 'number'");
            return false;
        }

        if (typeof fileInfo.audio.firstEncoderDTS !== 'number') {
            playlistUtils.Warn("'MixFilterClip.validateInput typeof fileInfo.audio.firstEncoderDTS !== 'number'");
            return false;
        }

        if (typeof fileInfo.audio.duration !== 'number') {
            playlistUtils.Warn("MixFilterClip.validateInput typeof fileInfo.audio.duration !== 'number'");
            return false;
        }
        if (fileInfo.audio.duration <= 0) {
            playlistUtils.Warn('MixFilterClip.validateInput fileInfo.audio.duration  <= 0');
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
        that.inner.sources.push(new ConcatSource("v1",fileInfo.path));
        if(playlistUtils.palylistConfig.useAudio && fileInfo.audio){
            that.inner.sources.push(new ConcatSource("a1",fileInfo.path));
        }

        _.each(that.inner.sources,function(s){
            s.addListener(that.getListener());
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

        playlistUtils.Debug('MixFilterClip.insert. clip=%s track=%s duration=%d. first_dts=%d enc_dts=%d expires=%s',
            fileInfo.path,src.inner.tracks,track.duration,track.firstDTS,track.firstEncoderDTS,expires);

        if( track.duration <= 0 ) {
            playlistUtils.Warn('MixFilterClip.insert: bad duration: %d clip: (%s)',track.duration,fileInfo.path);
            throw new Error('bad clip duration <= 0');
        }

        src.concatClip(fileInfo,track,expires);
    }
    return this;
};

MixFilterClip.prototype.checkExpires = function (expires,maxChunkCount){
    var that = this;

    var paths = [];

    playlistUtils.Debug('MixFilterClip.checkExpires. expires=%d',expires);

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

    playlistUtils.Debug('MixFilterClip.getDTSRange. min=%d max=%d',retVal.min,retVal.max);

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
    this.inner.sources = this.inner.sources.map(function(s){
        return new ConcatSource(s);
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
