/*
 *   vod packager playlist implementation.
 *   for details see https://github.com/kaltura/nginx-vod-module
 * */

var    _ = require('underscore');
var util = require('util');
var playlistUtils = require('./playlistGen-utils');
var PlaylistItem = require('./PlaylistItem');
var BroadcastEventEmitter = require('./BroadcastEventEmitter');
var MixFilterClip = require('./MixFilterClip');
var Sequence = require('./Sequence');
var TimestampList = require('./TimestampList');
var GapManager = require('./GapManager');

/*
*   Playlist class.
*   implements playlist manifest with metadata required by vod packager to correctly and consistently
*   calculate media playlists and generate media chunks
*   unlike m3u it unifies both playlist and chunklist features.
*
*   properties:
*
*   playlistType :    (vod|live) type of manifest
*   discontinuity : (bool) mode at which packager relies on different heuristics to calculate playlist and media
*   segmentBaseTime : (absolute time ms)  used when discontinuity = false. playlist session start time, may span multiple restarts
*   firstClipTime   : (absolute time ms)  used when discontinuity = false. lower bound of live window, updated when window slides.
*   initialSegmentIndex : (int) used when discontinuity = true. as the base index
*   initialClipIndex    : (int) used when discontinuity = true. as lower window index
*   presentationEnd : (bool) flag indicating end of session (no data is going to be appeneded)
*   sequences : (collection of Clip) flavor collection containing MixFilterClip or/and SourceClip objects
*   durations:  (collection of int) total clip durations; actually it's always 1 long since we use MixFilterClip. along with firstClipTime describes playlist window.
* */
function Playlist(logger,serializationCtx) {

    PlaylistItem.prototype.constructor.call(this,logger,serializationCtx);

    var inner = this.inner;
    if(!Object.keys(inner).length) {
        inner.durations = [];
        inner.sequences = [];
        inner.playlistType = 'live';
        inner.segmentBaseTime = 0;
        inner.firstClipTime = 0;
        inner.initialSegmentIndex = 1;
        inner.initialClipIndex = 1;
        inner.discontinuity = false;
        // book-keeping information for playlist internal use
        inner.flavor2SeqIndex = {};
        inner.gaps = new GapManager(this.logger,this);
        inner.clipTime = [];

    }
}


util.inherits(Playlist,PlaylistItem);


var createSequence = function(flavor,seq){
    var that = this;

    var newSeq = new Sequence(that.logger,that,seq,flavor);
    newSeq.addListener(that);
    return newSeq;
};

// lookup flavor sequence and return last clip to append a chunk to
Playlist.prototype.getSequenceForFlavor = function (flavor) {
    var that = this;

    if(flavor === undefined){
        that.logger.info("Playlist.getSequenceForFlavor bad flavor=", flavor);
        return;
    }

    // flavor can be any identifier -> map to index in array of sequences
    var sequenceIndex = that.inner.flavor2SeqIndex[flavor];
    if(sequenceIndex === undefined){
        that.logger.info("Playlist.getSequenceForFlavor add new sequence for flavor", flavor);
        that.inner.flavor2SeqIndex[flavor] = sequenceIndex = Object.keys(that.inner.flavor2SeqIndex).length;
        that.inner.sequences.push(createSequence.call(that,flavor));
    } else {
        while (that.inner.sequences.length <= sequenceIndex) {
            that.inner.sequences.push(createSequence.call(that,flavor));
        }
    }
    return that.inner.sequences[sequenceIndex];
};

// PlaylistItem override. test for object state validity
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
        if(that.inner.durations.length !== seq.clips.length){
            that.logger.warn("Playlist.validate that.inner.durations.length !== seq.clips.length ");
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
                if( overallD - clipD > playlistUtils.playlistConfig.timestampToleranceMs ){
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

    if( !that.inner.gaps.validate() ){
        return false;
    }

    if( !Array.isArray(that.inner.clipTime)   ) {
        that.logger.warn("Playlist.validate !Array.isArray(that.inner.clipTime)");
        return false;
    }

    if( that.inner.clipTime.length !==  that.inner.durations.length  ) {
        that.logger.warn("Playlist.validate that.inner.clipTime.length !==  that.inner.durations.length");
        return false;
    }

    var idx = 0;
    if(_.some(that.inner.clipTime, function(clipTime,index){
            if( idx > 0 ){
                return that.inner.clipTime[idx]-that.inner.durations[idx] != that.inner.clipTime[idx-1];
            }
            idx++;
            return false;
        })) {
        that.logger.warn("Playlist.validate that.inner.clipTime[idx]-that.inner.durations[idx] != that.inner.clipTime[idx-1]");
        return false;
    }

    return PlaylistItem.prototype.validate.apply(that,arguments);
};

var rangeOverlap = function(dtsRange2){
    return this.min < dtsRange2.max && this.max > dtsRange2.min;
};

var recalculateOffsetsAndDurationInner = function(index){
    var that = this;

    var retVal = {min:Number.MIN_VALUE,max:Number.MAX_VALUE};

    // determine dts range

    // step # 1: fill out all clip ranges
    var ranges = _.map(that.inner.sequences,function(seq){
        if(seq.clips.length > index) {
            return seq.clips[index].getDTSRange();
        }
        return null;
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

        that.inner.clipTime[index] = Math.max(that.inner.clipTime[index], Math.ceil(retVal.min));

        var firstClipTimeChanged = false;
        if(index === 0) {
            firstClipTimeChanged = that.inner.firstClipTime !== that.inner.clipTime[index];
            that.inner.firstClipTime = that.inner.clipTime[index];
        }

        that.inner.gaps.update();

        that.logger.info("Playlist.recalculateOffsetsAndDuration(%d) set firstClipTime=%s(%d)",
            index,
            new Date(that.inner.clipTime[index]),
            that.inner.clipTime[index]);

        _.each(that.inner.sequences,function(seq){
            if(seq.clips.length > index) {
                 seq.clips[index].emit(playlistUtils.ClipEvents.base_time_changed,that.inner.clipTime[index]);
            }
        });

        if(firstClipTimeChanged) {
            that.emit(playlistUtils.ClipEvents.base_time_changed, that.inner.firstClipTime);
        }
    }
    return retVal;
};

// calculate firstClipTime, update segmentBaseTime (if needed) and sequences clips offsets
Playlist.prototype.recalculateOffsetsAndDuration = function recalculateOffsetsAndDuration (){
    var that = this;

    var retVal = {min:Number.MIN_VALUE,max:Number.MAX_VALUE};

    _.each(that.inner.durations,function(d,index) {
        var minMax = recalculateOffsetsAndDurationInner.call(that, index);
        if(minMax.min > Number.MIN_VALUE) {
            if (0 === index) {
                retVal.min = minMax.min;
            }
            if (that.inner.durations.length - 1 === index) {
                retVal.max = minMax.max;
            }
            that.inner.durations[index] = minMax.max - minMax.min;
        } else {
            that.inner.durations[index] = 0;
        }
    });

    return retVal;

};



// PlaylistItem override used during serialization
Playlist.prototype.onUnserialize = function () {
    var that = this;

    that.inner.sequences = _.map(that.inner.sequences,function(seq){
        //flavor will be derived from seq object
        return createSequence.call(that,null,seq);
    });

    that.inner.gaps = new GapManager(that.logger,that,that.inner.gaps);
};

//BroadcastEventEmitter overrides
Playlist.prototype.addListener = function(listener){
    var that = this;

    BroadcastEventEmitter.prototype.addListener.call(this,listener);
    _.each(that.inner.sequences,function (seq) {
        seq.addListener(listener);
    });
};

Playlist.prototype.removeListener = function(listener){
    BroadcastEventEmitter.prototype.removeListener.call(this,listener);
    _.each(that.inner.sequences,function (seq) {
        seq.removeListener(listener);
    });
};

// JSON serialization from disk/etc
Playlist.prototype.serializeFrom = function (playlistJSON,logger,cbDone){
    var playlist = undefined;
    try {
        playlist = JSON.parse(playlistJSON);
    } catch (err) {
        logger.warn('unable to unserialize playlist. data loss is inevitable!');
    }
    playlist = new Playlist(logger,playlist);
    cbDone(playlist);
};

// diagnostics info.

Playlist.prototype.getDiagnostics = function (opts) {
    var that = this,
        clipDuration = (opts && opts.clipDuration) ? opts.clipDuration : 10000;

    that.recalculateOffsetsAndDuration();

    var totalDuration = playlistUtils.sum(that.inner.durations);


    // current playlist state:
    // * segmentBaseTime - reference point for segment number calculation
    // * firstClipTime - live window lower bound
    // * we assume {now,segmentBaseTime,firstClipTime} are measured by identical clock (!weak assumption!)
    // * now - (firstClipTime+totalDuration + gapsMsec) = media not yet in the playlist

    /*        |segmentBaseTime   |firstClipTime                |firstClipTime+totalDuration     |now
        ------X------------------X------A-------------A--------X--------------------------------X-----------> t
                                        | gap1        |gap2
                    |<--offset-->|                                   |actual flavor duration    |now
     flavor N   ----X------------X-----------------------------------X--------------------------X-----------> t
    */

    var diag =  {
        unitMs: clipDuration,
        discontinuityMode:  that.inner.discontinuity,
        now:Math.floor((Date.now() - that.inner.segmentBaseTime) / clipDuration),
        window: {},
        windowDurationMs: totalDuration,
        gaps: that.inner.gaps.toHumanReadable(clipDuration)
    };

    var keys = Object.keys(that.inner.flavor2SeqIndex);
    if(keys.length > 0) {
        var range = that.minMax,
            min = Math.floor((range.min - that.inner.segmentBaseTime) / clipDuration),
            max = Math.floor((range.max - that.inner.segmentBaseTime) / clipDuration);
        diag.window['P'] = [min,max];

        _.each(keys, function (flv) {
            range = that.inner.sequences[that.inner.flavor2SeqIndex[flv]].clips[0].getDTSRange();
            min = Math.floor((range.min - that.inner.segmentBaseTime) / clipDuration);
            max = Math.floor((range.max - that.inner.segmentBaseTime) / clipDuration);
            diag.window['' + flv + ''] = [min,max];
        });
    }

    if(totalDuration && that.minMax) {
        var overallDuration = Math.max(0,that.minMax.max - that.minMax.min);
        if(overallDuration > totalDuration){
            diag.gapsMsec = overallDuration - totalDuration;
            diag.playbackWindow = that.minMax;
        }
    }
    return diag;
};

// collapse gaps so that playlist don't contain overlapping media and gaps
Playlist.prototype.collapseGap = function(gap) {
    var that = this;
    if(gap.from < gap.to) {
        _.each(that.inner.sequences,function (seq) {
            seq.collapseGap(gap.from, gap.to);

        });
        that.inner.gaps.collapseGap(gap);
    }
};

// called when chunk reorder occurs
// compensate gaps in case a previous insertion operation created one in place of reordered chunk
Playlist.prototype.onReorder = function(chunk) {
    var that = this;
    that.inner.gaps.removeRange(chunk);
};

// used by JSON.sringify
Playlist.prototype.toJSON = function(){
    var that = this;

    if(!that.minMax){
        return PlaylistItem.prototype.toJSON.call(that);
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

// return clip approprate for appending a newly inserted chunk
Playlist.prototype.getClipFromFileInfo = function (fileInfo) {
    var that = this;

    var seq = that.getSequenceForFlavor(fileInfo.flavor);
    var clips = seq.clips;

    var lastClip = clips.length > 0 ? clips[clips.length - 1] : null;

    if( !lastClip/*
     || lastClip.type === 'source'
     || (lastClip.type === 'mixFilter'
     && (lastClip.sources[0].paths.length > that.playListLimits.maxChunksPerClip
     || lastClip.getDuration(that.logger) + fileInfo.videoDuration > that.playListLimits.maxClipDuration))*/
    ) {
        var newClip = new MixFilterClip(that.logger,that,clips.length,seq);
        clips.push(newClip);
    }
    return clips[clips.length - 1];
};


Playlist.prototype.collectObsoleteClips = function () {
    var that = this;
    var collected = false;
    while (that.inner.durations.length) {

        var seqs = _.filter(that.inner.sequences, function (seq) {
            return seq.clips.length > 0;
        });

        if (_.every(seqs, function (seq) {
                return seq.clips.first.isEmpty();
            })) {
            _.each(seqs, function (seq) {
                seq.clips.shift();
                that.inner.clipTime.shift();
                that.inner.durations.shift();
                collected = true;
            });
        } else {
            break;
        }
    }
    return collected;
}

Playlist.prototype.handleEvent = function (type,arg) {
    var that = this;

    switch(type) {
        case playlistUtils.ClipEvents.clip_added:
            if( arg instanceof MixFilterClip){
                while(arg.clipIndex >= that.inner.clipTime.length){
                    that.inner.clipTime.push(0);
                }
                while(arg.clipIndex >= that.inner.durations.length){
                    that.inner.durations.push(0);
                }
            }
            break;
        default:
            that.emit.apply(arguments);
    };

};

module.exports = Playlist;

