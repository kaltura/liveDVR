/*
*   vod packager playlist implementation.
 *   for details see https://github.com/kaltura/nginx-vod-module
* */

var ConcatSource = require('./ConcatSource');
var _ = require('underscore');
var util = require('util');
var playlistUtils = require('./playlistGen-utils');
var PlaylistItem = require('./PlaylistItem');
var BroadcastEventEmitter = require('./BroadcastEventEmitter');
var path = require('path');
var loggerModule = require('../../common/logger');

/*
    MixFilterClip class.
    used in playlist sequences collection of clips.
    internally implements collection of media tracks each containing multiple chunks - ConcatSource instances.
*/
function MixFilterClip(loggerInfo, playlist,  seq, clipTime, serializationCtx) {

    this.loggerInfo = loggerInfo;
    this.logger = loggerModule.getLogger("MixFilterClip", loggerInfo + "[" + seq.inner.clips.length + "] ");
    this.clipTime = clipTime || playlist.checkAddClipTime(seq);

    PlaylistItem.prototype.constructor.call(this, this.logger, playlist, serializationCtx);
    this.addListener(seq);
    if(!Object.keys(this.inner).length) {
        this.inner.type = "mixFilter";
        this.inner.sources = []; //collection of ConcatSource
    }

    this.emit(playlistUtils.ClipEvents.clip_added,this);
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

/*
    if( typeof that.clipIndex  != 'number' ) {
        that.logger.warn('typeof that.clipIndex  != Number');
        return false;
    }
*/
    return that.inner.sources.every(function(s){
        return s.validate(opts);
    });
};


var validateInput = function(fileInfo){
    var that = this;

    if(!fileInfo.startTime){
        that.logger.warn('FileInfo.startTime is not set to unix time');
    }

    if(!fileInfo){
        that.logger.warn('Bad fileInfo');
        return false;
    }

    if(!fileInfo.flavor){
        that.logger.warn('Bad fileInfo.flavor');
        return false;
    }

    if(!fileInfo.sig || typeof fileInfo.sig !== 'string'){
        that.logger.warn('Bad fileInfo.sig');
        return false;
    }

    if(!fileInfo.video &&  !fileInfo.audio){
        that.logger.warn('!fileInfo.video && !fileInfo.audio');
        return false;
    }

    if(fileInfo.video) {
        if (typeof fileInfo.video.firstDTS !== 'number') {
            that.logger.warn("Typeof fileInfo.video.firstDTS !== 'number'");
            return false;
        }

        if (typeof fileInfo.video.firstEncoderDTS !== 'number') {
            that.logger.warn("'Typeof fileInfo.video.firstEncoderDTS !== 'number'");
            return false;
        }

        if (typeof fileInfo.video.duration !== 'number') {
            that.logger.warn("Typeof fileInfo.video.duration !== 'number'");
            return false;
        }
        if (fileInfo.video.duration <= 0) {
            that.logger.warn('FileInfo.video.duration  <= 0');
            return false;
        }
    }

    if(fileInfo.audio) {
        if (typeof fileInfo.audio.firstDTS !== 'number') {
            that.logger.warn("Typeof fileInfo.audio.firstDTS !== 'number'");
            return false;
        }

        if (typeof fileInfo.audio.firstEncoderDTS !== 'number') {
            that.logger.warn("'Typeof fileInfo.audio.firstEncoderDTS !== 'number'");
            return false;
        }

        if (typeof fileInfo.audio.duration !== 'number') {
            that.logger.warn("Typeof fileInfo.audio.duration !== 'number'");
            return false;
        }
        if (fileInfo.audio.duration <= 0) {
            that.logger.warn('FileInfo.audio.duration  <= 0');
            return false;
        }
    }
    return true;
};

var createConcatSource = function(index,type,path){
    var that = this;

    return new ConcatSource(that.loggerInfo + '[' + index + ']',that.playlist,that.clipTime,type,path);
};

var checkNewSource = function(type,fileInfo){
    var that = this;

    var source = _.filter(that.inner.sources,function(s){
        return s.inner.tracks[0] == type;
    });

    if(!source.length){
        source = createConcatSource.call(that,0,type+'1',fileInfo.path);
        that.inner.sources.push(source);
        source.addListener(that);
        return source;
    } else {
        return source[0];
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
                throw new Error('unsupported track type ' + src.inner.tracks);
                break;
        }

        that.logger.debug('Insert Clip %s: Track = [%s]; Duration = [%d]; First_dts = [%d]; Enc_dts = [%d]',
            fileInfo.path, src.inner.tracks, track.duration.toFixed(2), track.firstDTS, track.firstEncoderDTS);

        if( track.duration <= 0 ) {
            that.logger.warn('Problem inserting clip. Bad duration: [%d], clip: [%s]', track.duration, fileInfo.path);
            throw new Error('Clip duration <= 0');
        }

        src.concatClip(fileInfo,track);
    }
    return this;
};

// iterates over all sources t ofind obsolete chunks. returns array of paths to chunks
MixFilterClip.prototype.checkExpires = function (){
    var that = this;

    var paths = [];

    that.logger.debug('Mix clip checkExpires');

    var args = arguments;

    _.each(this.inner.sources,function (s) {
        var p = ConcatSource.prototype.checkExpires.apply(s,args);
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

    var retVal = new playlistUtils.TimeRange();

    _.each(that.inner.sources,function(s) {
        var range = s.getDTSRange();
        retVal.min = Math.max(range[0],retVal.min);
        retVal.max = Math.min(range[1] ,retVal.max);
    });

    that.logger.debug('Get DTS Range for mix clip. Min = [%d]; Max = [%d]', retVal.min, retVal.max);

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

    that.inner.sources = _.map(that.inner.sources,function(s,index){
        return createConcatSource.call(that,index,s);
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

MixFilterClip.prototype.split = function (r) {
    var that = this;

    that.logger.info("Split mix clip: %d", that.clipTime);

    var newInst =  new MixFilterClip(that.loggerInfo, that.playlist, that.listenerCb);

    _.each(that.inner.sources, function(src,index) {
        var newSrc = checkNewSource.call(newInst, src.inner.tracks[0], {path: src.inner.basePath + 'dum'});
        src.split(newSrc,r);
    });

    return newInst;

};

Object.defineProperty(MixFilterClip.prototype , "lastClipStartTime", {

    get: function get_lastClipStartTime() {
        var that = this;
        return _.map(that.inner.sources, function (src) {
            return src.durationsMan.itemCount ? src.durationsMan.firstDTS.last : -1;
        }).min();
    }
});

MixFilterClip.prototype.handleEvent = function (type,arg) {
    var that = this;

    switch(type){
        case playlistUtils.ClipEvents.gap_limit_exceeded:
            if(that.inner.sources.length > 1 && arg.inner.tracks[0] !== 'v'){
                return;
            }
         default:
            //forward
            BroadcastEventEmitter.prototype.handleEvent.apply(that,arguments);
            break;
    }
};

module.exports = MixFilterClip;
