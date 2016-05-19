/*
*   vod packager playlist implementation.
 *   for details see https://github.com/kaltura/nginx-vod-module
* */

var ConcatSource = require('./ConcatSource');
 var    _ = require('underscore');
var util = require('util');
var playlistUtils = require('./playlistGen-utils');
var PlaylistItem = require('./PlaylistItem');
var BroadcastEventEmitter = require('./BroadcastEventEmitter');
var path = require('path');

/*
    MixFilterClip class.
    used in playlist sequences collection of clips.
    intenally implements collection of media tracks each containing multiple chunks - ConcatSource instances.
*/
function MixFilterClip(logger,playlist,serializationCtx) {

    PlaylistItem.prototype.constructor.call(this,logger,playlist,serializationCtx);
    if(!Object.keys(this.inner).length) {
        this.inner.type = "mixFilter";
        this.inner.sources = []; //collection of ConcatSource
    }
}

util.inherits(MixFilterClip,PlaylistItem);

// insures internal state is valid at given point of time
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
    var that = this;

    if(!fileInfo.startTime){
        that.logger.warn('MixFilterClip.validateInput fileInfo.startTime is not set to unix time');
    }

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

var checkNewSource = function(type,fileInfo){
    var that = this;

    if( that.inner.sources.every( function(s){
        return s.inner.tracks[0] !== type;
    })){
        var newSrc = new ConcatSource(that.logger,that.playlist,type+'1',fileInfo.path)
        that.inner.sources.push(newSrc);
        newSrc.addListener(that.listenerCb);
    }
};

// add new chunk to sources
MixFilterClip.prototype.insert = function (fileInfo) {
    var that = this;

    if(!validateInput.call(that,fileInfo)){
        throw new Error('bad input fileInfo');
    }

    // create on demand new media track ConcatSource
    fileInfo.video && checkNewSource.call(this,'v',fileInfo);
    fileInfo.audio && checkNewSource.call(this,'a',fileInfo);


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

        that.logger.debug('MixFilterClip.insert. clip=%s track=%s duration=%d. first_dts=%d enc_dts=%d',
            fileInfo.path,src.inner.tracks,track.duration.toFixed(2),track.firstDTS,track.firstEncoderDTS);

        if( track.duration <= 0 ) {
            that.logger.warn('MixFilterClip.insert: bad duration: %d clip: (%s)',track.duration,fileInfo.path);
            throw new Error('bad clip duration <= 0');
        }

        src.concatClip(fileInfo,track);
    }
    return this;
};

// iterates over all sources t ofind obsolete chunks. returns array of paths to chunks
MixFilterClip.prototype.checkExpires = function (){
    var that = this;

    var paths = [];

    that.logger.debug('MixFilterClip.checkExpires.');

    _.each(this.inner.sources,function (s) {
        var p = s.checkExpires();
        p = _.filter(p,function(file) {
            return _.every(that.inner.sources,function (s1) {
                return s1.inner.paths.indexOf(file) < 0;
            });
        });
        paths = paths.concat(p);
    });
    return paths;
};

// get range of DTS(PTS). returns least playable interval for all media or {Number.MIN_VALUE,Number.MAX_VALUE} in case there's none
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

// conveniency function - return duration of DTS(PTS) range
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
    if(sources.length === 0)
       return true;
    return _.some(sources,function(s){
            return s.inner.durations.length === 0
     }) ;
};

// PlaylistItem override called during playlist being serialized from <whatever>
MixFilterClip.prototype.onUnserialize = function () {
    var that = this;

    that.inner.sources = _.map(that.inner.sources,function(s){
        return new ConcatSource(that.logger,s);
    });
};

// remove part of media tracks overlapping with gap range
MixFilterClip.prototype.collapseGap = function (from,to) {
    var that = this;
    _.each(that.inner.sources,function(s){
        s.collapseGap(from,to);
    });
};

// BroadcastEventEmitter overrides
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

MixFilterClip.prototype.toJSON = function () {
    var that = this;
    if(!playlistUtils.playlistConfig.humanReadablePass){
        return PlaylistItem.prototype.toJSON.call(that);
    } else {
        var clips = [];
        var jsonReps =  _.map(that.inner.sources,function(src){
            return  src.toJSON().items;
        });
        if(jsonReps.length) {
            var l = jsonReps[0].length;
            for (var i = 0; i < l; i++) {
                var media = {};
                _.each(jsonReps, function (items,index) {
                    // check for short tracks
                    var offset = l - items.length,
                        src = that.inner.sources[index].inner;
                    if(i >= offset) {
                        var item = items[i - offset];
                        item.paths = path.join(src.basePath, item.paths);
                        media[src.tracks] = item;
                    } else {
                        media[src.tracks] = {missing:true};
                    }
                });
                clips.push(media);
            }
        }
        return {
            type: that.inner.type,
            clips: clips
        };
    }
};

MixFilterClip.prototype.checkFileExists = function(fileName) {
    return _.any(this.inner.sources,function(src){
        return src.checkFileExists(fileName);
    });
};

module.exports = MixFilterClip;
