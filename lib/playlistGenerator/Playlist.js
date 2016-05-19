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
*   durations:  (collection of int) total clip durations; actually it's alwais 1 long since we use MixFilterClip. along with firstClipTime describes playlist window.
* */
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
        // book-keeping information for playlist intenal use
        inner.flavor2SeqIndex = {};
        inner.gaps = [];

    }
}

util.inherits(Playlist,PlaylistItem);


var createSequence = function(flavor,seq){
    var that = this;

    return new Sequence(that.logger,that,seq,flavor);
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


    return PlaylistItem.prototype.validate.apply(that,arguments);
};

var rangeOverlap = function(dtsRange2){
    return this.min < dtsRange2.max && this.max > dtsRange2.min;
};

// calculate firstClipTime, update segmentBaseTime (if needed) and sequences clips offsets
Playlist.prototype.recalculateOffsetsAndDuration = function recalculateOffsetsAndDuration (index){
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

        that.inner.firstClipTime = Math.max(that.inner.firstClipTime,Math.ceil(retVal.min));

        // we must artifically bump up segmentBaseTime to keep packaged segment index continuity
        while(that.inner.gaps.length) {
            var gap = that.inner.gaps[0];
            if( that.inner.firstClipTime < gap.to )
               break;
            that.inner.segmentBaseTime += gap.to - gap.from;
            that.logger.warn("Playlist.recalculateOffsetsAndDuration updated segmentBaseTime=%s(%d) gap=%d",new Date(that.inner.segmentBaseTime),that.inner.segmentBaseTime,gap.to - gap.from);
            that.inner.gaps.shift();
        }

        that.inner.durations[index] =  Math.ceil(retVal.max-that.inner.firstClipTime);

        that.logger.info("Playlist.recalculateOffsetsAndDuration set firstClipTime=%s(%d)",new Date(that.inner.firstClipTime),that.inner.firstClipTime);

        that.emit(playlistUtils.ClipEvents.base_time_changed,that.inner.firstClipTime);
    }
    return retVal;
};



// PlaylistItem override used during serialization
Playlist.prototype.onUnserialize = function () {
    var that = this;

    that.inner.sequences = _.map(that.inner.sequences,function(seq){
        //flavor will be derived from seq object
        return createSequence.call(that,null,seq);
    });
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

    that.recalculateOffsetsAndDuration(0);

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
        gaps: _.map(that.inner.gaps,function(g){
            return {
                at:Math.floor((g.from-that.inner.segmentBaseTime) / clipDuration),
                dur: ((g.to-g.from)/clipDuration).toFixed(2)
            };
        })
    };

    var keys = Object.keys(that.inner.flavor2SeqIndex);
    if(keys.length > 0) {
        var total = diag.now - diag.window.low,
            range = that.minMax,
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


var gapOverlaps = function(g){
    return this.to > g.from && this.from < g.to;
};

// collapse gaps so that playlist don't contain overlapping media and gaps
Playlist.prototype.collapseGap = function(gap) {
    var that = this;
    if(gap.from < gap.to) {
        _.each(that.inner.sequences,function (seq) {
            seq.collapseGap(gap.from, gap.to);

        });
        var overlaps = _.filter(that.inner.gaps,gapOverlaps,gap);
        if(overlaps.length) {
            gap.from = Math.min(overlaps[0].from);
            gap.to = Math.max(overlaps[overlaps.length-1].to);
            that.inner.gaps = _.difference(that.inner.gaps,overlaps);
        }
        //remember gap for later. in order to keep segment index invariant when
        //firstClipTime bumps up to after gap we have to artifically update segmentBaseTime by gap amount
        that.inner.gaps.push(gap);

    }
};

// called when chunk reorder occurs
// compensate gaps in case a previous insertion operation created one in place of reordered chunk
Playlist.prototype.onReorder = function(chunk) {
    var that = this;
    if(chunk.from < chunk.to) {
        var overlaps = _.filter(that.inner.gaps,gapOverlaps,chunk);
        if(overlaps.length) {
            chunk.from = Math.min(overlaps[0].from);
            chunk.to = Math.max(overlaps[overlaps.length-1].to);
            overlaps[0].from = Math.max(overlaps[0].from,chunk.from);
            overlaps[overlaps.length - 1].from = Math.min(overlaps[overlaps.length - 1].to,chunk.to);
            if(overlaps[0].from < overlaps[0].to) {
                overlaps.shift();
            }
            if(overlaps.length && overlaps[overlaps.length - 1].from < overlaps[overlaps.length - 1].to){
                overlaps.splice(overlaps.length-1,1);
            }
            if(overlaps.length) {
                that.inner.gaps = _.difference(that.inner.gaps, overlaps);
            }
        }
    }
};

// used by JSON.sringify
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

// return clip approprate for appending a newly inserted chunk
Playlist.prototype.getClipFromFileInfo = function (fileInfo,eventListener) {
    var that = this;

    var clips = that.getSequenceForFlavor(fileInfo.flavor).clips;

    var lastClip = clips.length > 0 ? clips[clips.length - 1] : null;

    if( !lastClip/*
     || lastClip.type === 'source'
     || (lastClip.type === 'mixFilter'
     && (lastClip.sources[0].paths.length > that.playListLimits.maxChunksPerClip
     || lastClip.getDuration(that.logger) + fileInfo.videoDuration > that.playListLimits.maxClipDuration))*/
    ) {
        var newClip = new MixFilterClip(that.logger,that);
        var sequenceIndex = that.inner.flavor2SeqIndex[fileInfo.flavor];
        newClip.addListener(that.inner.sequences[sequenceIndex]);
        clips.push(newClip);
    }
    return clips[clips.length - 1];
};

module.exports = Playlist;

