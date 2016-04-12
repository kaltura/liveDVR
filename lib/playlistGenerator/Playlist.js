/*
 *   vod packager playlist implementation.
 *   for details see https://github.com/kaltura/nginx-vod-module
 * */

var    _ = require('underscore');
var util = require('util');
var playlistUtils = require('./playlistGenrator-utils');
var PlaylistItem = require('./PlaylistItem');
var BroadcastEventEmitter = require('./BroadcastEventEmitter');
var MixFilterClip = require('./MixFilterClip');
var SourceClip = require('./SourceClip');

function Playlist(logger,serializationCtx) {

    PlaylistItem.prototype.constructor.call(this,logger,serializationCtx);

    var inner = this.inner;
    if(!Object.keys(inner).length) {
        inner.durations = [0];
        inner.sequences = [];
        inner.playlistType = 'live';
        inner.segmentBaseTime = 0;
        inner.firstClipTime = 0;
        inner.initialSegmentIndex = 1;
        inner.initialClipIndex = 1;
        inner.discontinuity = false;
        inner.flavor2SeqIndex = {};
        inner.presentationEnd = false;
        inner.gaps = [];
    }
}

util.inherits(Playlist,PlaylistItem);

Playlist.prototype.getClipListForFlavor = function (flavor) {
    var that = this;

    if(flavor === undefined){
        that.logger.info("Playlist.getClipListForFlavor bad flavor=", flavor);
        return;
    }

    // sequenceId can be any identifier -> map to index in array of sequences
    if(that.inner.flavor2SeqIndex[flavor] === undefined){
        that.logger.info("Playlist.getClipListForFlavor add new sequence for flavor", flavor);
        that.inner.flavor2SeqIndex[flavor] = Object.keys(that.inner.flavor2SeqIndex).length;
        that.inner.sequences.push({clips:[]});
    }

    var sequenceIndex = that.inner.flavor2SeqIndex[flavor];
    return that.inner.sequences[sequenceIndex].clips;
};

Playlist.prototype.validate = function validate(opts) {
    var that = this;

    if( (typeof that.inner.playlistType !== 'string') || ['live','vod'].indexOf(that.inner.playlistType) < 0){
        that.logger.warn("Playlist.validate invalid that.inner.playlistType", that.inner.playlistType);
        return false;
    }

    if( (typeof that.inner.firstClipTime !== 'number')){
        that.logger.warn("Playlist.validate invalid that.inner.firstClipTime type", that.inner.firstClipTime);
        return false;
    }

    if( (typeof that.inner.segmentBaseTime !== 'number')){
        that.logger.warn("Playlist.validate invalid that.inner.segmentBaseTime type", that.inner.segmentBaseTime);
        return false;
    }

    if( (typeof that.inner.initialClipIndex !== 'number')){
        that.logger.warn("Playlist.validate invalid that.inner.initialClipIndex type", that.inner.initialClipIndex);
        return false;
    }

    if( (typeof that.inner.initialClipIndex !== 'number')){
        that.logger.warn("invalid that.inner.initialClipIndex type", that.inner.initialClipIndex);
        return false;
    }

    if( !Array.isArray(that.inner.durations) ){
        that.logger.warn("Playlist.validate !that.inner.durations || typeof that.inner.durations !== 'Array'");
        return false;
    }

    if( !_.every(that.inner.durations,function(d){
            return d >= 0;
        })  )  {
        that.logger.warn("Playlist.validate that.inner.duration < 0");
        return false;
    }

    if( !Array.isArray(that.inner.sequences)   ) {
        that.logger.warn("Playlist.validate !that.inner.sequences || typeof that.inner.sequences !== 'Array'");
        return false;
    }

    for( var i in that.inner.sequences) {
        var seq = that.inner.sequences[i];
        if( !Array.isArray(seq.clips) ) {
            that.logger.warn("Playlist.validate !seq.clips !seq.clips instanceof Array ");
            return false;
        }
        if( seq.validate && !seq.validate(opts) ){
            return false;
        }
    }

    if( !_.every(that.inner.sequences,function(seq){
            for( var i in seq.clips ) {
                var clip = seq.clips[i];
                var clipD = clip.getTotalDuration(),
                    overallD = that.inner.durations[i];
                if(  overallD - clipD > 2 ){
                    that.logger.warn("Playlist.validate clip[%d] duration=%d > sum of durations=%d",
                        i, overallD,clipD);
                    return false;
                }
            }
            return true;
        } ) ) {
        return false;
    }

    if(that.inner.firstClipTime <  that.inner.segmentBaseTime)  {
        that.logger.warn("Playlist.validate that.inner.firstClipTime <  that.inner.segmentBaseTime");
        return false;
    }

    return true;
};

var rangeOverlap = function(dtsRange2){
    return this.min < dtsRange2.max && this.max > dtsRange2.min;
};

Playlist.prototype.recalculateOffsetsAndDuration = function recalculateOffsetsAndDuration (index){
    var that = this;

    var retVal = {min:Number.MIN_VALUE,max:Number.MAX_VALUE};

    // determine dts range

    // step # 1: fill out all clip ranges
   var ranges = _.map(that.inner.sequences,function(seq){
        if(seq.clips.length > index) {
            return seq.clips[index].getDTSRange();
        }
    });

    ranges = _.compact(ranges);

    // step # 2: find sequences that have overlapping regions with other clip sequences

    var result = [];
    // look for disjoint sets. pick up the latest
    while(_.size(ranges) > 0) {
        var curRange = ranges.shift();
        if(_.size(ranges) > 0) {
            var affine = _.filter(ranges, rangeOverlap, curRange);
            _.each(affine, function (r) {
                curRange.min = Math.max(curRange.min, r.min);
                curRange.max = Math.min(curRange.max, r.max);
            });
            ranges = _.difference(ranges, affine);
        }
        result.push(curRange);

    }

    if(result.length) {
        retVal = _.max(result,function(r){return r.max;});
    }

    if(retVal.min > Number.MIN_VALUE) {

        that.inner.firstClipTime = Math.max(that.inner.firstClipTime,Math.ceil(retVal.min));

        // we must artifically bump up segmentBaseTime to keep packaged segment index continuity
        while(that.inner.gaps.length && that.inner.firstClipTime >= that.inner.gaps[0].gap) {
            that.inner.segmentBaseTime += that.inner.gaps[0].sz;
            that.inner.gaps.shift();
        }

        that.inner.durations[index] =  Math.ceil(retVal.max-that.inner.firstClipTime);

        var date = new Date(that.inner.firstClipTime);
        that.logger.info("Playlist.recalculateOffsetsAndDuration set firstClipTime=",date);

        _.each(that.inner.sequences,function(seq) {
            seq.clips.forEach(function(c) {
                c.updateOffset(that.inner.firstClipTime);
            });
        });
        return retVal;
    }
};

var unserializeClip = function (c){
    var that = this;
    switch(c.type){
        case 'mixFilter':
            return new MixFilterClip(that.logger,c);
        case 'source':
            return new SourceClip(that.logger,c);
        default:
            throw new Error('unknown clip type ' + c.type);
    }
};

Playlist.prototype.onSerialize = function () {
    var that = this;

    _.each(that.inner.sequences,function (seq) {
        seq.clips = seq.clips.map( function(c) {
            return unserializeClip.call(that,c);
        });
    });
};

Playlist.prototype.addListener = function(listener){
    var that = this;

    BroadcastEventEmitter.prototype.addListener.call(this,listener);
    _.each(that.inner.sequences,function (seq) {
        _.each(seq.clips,function(c){
            c.addListener(listener);
        });
    });
};

Playlist.prototype.removeListener = function(listener){
    BroadcastEventEmitter.prototype.removeListener.call(this,listener);
    _.each(that.inner.sequences,function (seq) {
        _.each(seq.clips,function(c){
            c.removeListener(listener);
        });
    });
};

Playlist.prototype.serializeFrom = function (stream,logger,cbDone){

    var playlistJSON = '';
    stream.on('data', function (chunk) {
        playlistJSON += chunk;
    });
    stream.on('error', function (err) {
        that.logger.warn('failed to read from file error: %s', err);
        cbDone(new Playlist());
    });
    stream.on('end', function () {
        stream.close();
        var playlist = undefined;
        try {
            playlist = JSON.parse(playlistJSON);
        } catch (err) {
            that.logger.warn('unable to unserialize playlist. data loss is inevitable!');
        }
        playlist = new Playlist(logger,playlist);
        cbDone(playlist);
    });
    stream.resume();
};

Playlist.prototype.getDiagnostics = function (opts) {
    var that = this,
        clipDuration = (opts && opts.clipDuration) ? opts.clipDuration : 10000;

    that.recalculateOffsetsAndDuration(0);

    var totalDuration = playlistUtils.sum(that.inner.durations),
        minClip = Math.floor((that.inner.firstClipTime - that.inner.segmentBaseTime) / clipDuration);

    var diag =  {
        unitMs: clipDuration,
        discontinuityMode:  that.inner.discontinuity,
        now:Math.floor((Date.now() - that.inner.segmentBaseTime) / clipDuration),
        window: {
            low: minClip,
            high: Math.floor(totalDuration / clipDuration) + minClip
        },
        windowDurationMs: totalDuration,
        presentationEnd: that.inner.presentationEnd,
        gaps: _.map(that.inner.gaps,function(g){
            return {
                at:Math.floor((g.gap-g.sz-that.inner.segmentBaseTime) / clipDuration),
                dur: (g.sz/clipDuration).toFixed(2)
            };
        })
    };

    if(opts && opts.displayPlaylist) {
        diag.playlist = that;
    }
    if(totalDuration && that.minMax) {
        var overallDuration = Math.max(0,that.minMax.max - that.minMax.min);
        if(overallDuration > totalDuration){
            diag.gapsMsec = overallDuration - totalDuration;
        }
    }
    return diag;
};

Playlist.prototype.collapseGap = function(from,to) {
    var that = this;
    if(from < to) {
        _.each(that.inner.sequences,function (seq) {
            _.each(seq.clips,function (c) {
                c.collapseGap(from, to);
            });
        });
        that.inner.gaps.push({gap:to,sz:to-from});
    }
};

// override
Playlist.prototype.toJSON = function(){
    var that = this;

    if(!that.minMax){
        return PlaylistItem.toJSON.call(that);
    }

    var obj = _.clone(that.inner);

    obj.sequences = _.filter(obj.sequences,function(seq){
        if(seq.clips.length) {
            var dtsRange = seq.clips[0].getDTSRange();
            return rangeOverlap.call(that.minMax,dtsRange);
        }
    });

    that.logger.debug("Playlist.toJSON %d valid sequences",obj.sequences.length);

    return obj;
};

Playlist.prototype.getClipFromFileInfo = function (fileInfo,eventListener) {
    var that = this;

    var clips = that.getClipListForFlavor(fileInfo.flavor);

    var lastClip = clips.length > 0 ? clips[clips.length - 1] : null;

    if( !lastClip/*
     || lastClip.type === 'source'
     || (lastClip.type === 'mixFilter'
     && (lastClip.sources[0].paths.length > that.playListLimits.maxChunksPerClip
     || lastClip.getDuration(that.logger) + fileInfo.videoDuration > that.playListLimits.maxClipDuration))*/
    ) {
        var newClip = new MixFilterClip(that.logger);
        newClip.addListener(eventListener);
        clips.push(newClip);
    }
    return clips[clips.length - 1];
};

module.exports = Playlist;

