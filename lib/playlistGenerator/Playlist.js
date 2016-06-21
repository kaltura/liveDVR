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
var GapPatcher = require('./GapPatcher');
var loggerModule = require('../../common/logger');
var ValueHolder = require('./ValueHolder');
var TimeRange = playlistUtils.TimeRange;
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
*   presentationEndTime : (int) expiry end time (UTC, milliseconds) after which packager is allowed to insert end of stream indicator
*   sequences : (collection of Clip) flavor collection containing MixFilterClip or/and SourceClip objects
*   durations:  (collection of int) total clip durations; actually it's always 1 long since we use MixFilterClip. along with firstClipTime describes playlist window.
* */
function Playlist(loggerInfo, serializationCtx) {

    this.loggerInfo = loggerInfo + '[p-' + Playlist.prototype.playerId++ + ']' ;
    this.logger = loggerModule.getLogger("Playlist", this.loggerInfo);
    PlaylistItem.prototype.constructor.call(this, this.logger, this,serializationCtx);

    var inner = this.inner;
    if(!Object.keys(inner).length) {
        inner.durations = [];
        inner.sequences = [];
        inner.playlistType = 'live';
        inner.segmentBaseTime = 0;
        inner.firstClipTime = 0;
        inner.initialSegmentIndex = 1;
        inner.initialClipIndex = 1;
        inner.discontinuity = playlistUtils.playlistConfig.discontinuityMode;
        // book-keeping information for playlist internal use
        inner.flavor2SeqIndex = {};
        inner.gaps = new GapPatcher(this.logger,this);
        inner.clipTimes = [];

    }
}


util.inherits(Playlist,PlaylistItem);

Playlist.prototype.playerId = 1;

Object.defineProperty(Playlist.prototype , "totalDuration", {
    get: function get_totalDuration() {
        return playlistUtils.sum(this.inner.durations);
    }
});

var createSequence = function(flavor,seq){
    var that = this;

    var newSeq = new Sequence(that.loggerInfo, that, seq, flavor);
    newSeq.addListener(that);
    return newSeq;
};

// lookup flavor sequence and return last clip to append a chunk to
Playlist.prototype.getSequenceForFlavor = function (flavor) {
    var that = this;

    if(flavor === undefined){
        that.logger.warn("Flavor [%s] is undefined. Cannot retrieve sequence for it", flavor);
        return;
    }

    // flavor can be any identifier -> map to index in array of sequences
    var sequenceIndex = that.inner.flavor2SeqIndex[flavor];
    if(sequenceIndex === undefined){
        that.logger.info("Add sequence for flavor [%s]", flavor);
        that.inner.flavor2SeqIndex[flavor] = sequenceIndex = Object.keys(that.inner.flavor2SeqIndex).length;
        that.inner.sequences.push(createSequence.call(that,flavor));
    } else {
        while (that.inner.sequences.length <= sequenceIndex) {
            that.inner.sequences.push(createSequence.call(that,flavor));
        }
    }
    return that.inner.sequences[sequenceIndex];
};

var IsNumber = function(n){
    if(typeof n === 'number'){
        return true;
    }
    if(n instanceof ValueHolder && typeof n.value === 'number'){
        return true;
    }
    return false;
};

// PlaylistItem override. test for object state validity
Playlist.prototype.validate = function validate(opts) {
    var that = this;

    if( (typeof that.inner.playlistType !== 'string') || ['live','vod'].indexOf(that.inner.playlistType) < 0){
        that.logger.warn("Invalid that.inner.playlistType %s", that.inner.playlistType);
        return false;
    }

    if(  !IsNumber(that.inner.firstClipTime) ){
        that.logger.warn("Invalid that.inner.firstClipTime type %s", that.inner.firstClipTime);
        return false;
    }

    if( !IsNumber(that.inner.segmentBaseTime)){
        that.logger.warn("Invalid that.inner.segmentBaseTime type %s", that.inner.segmentBaseTime);
        return false;
    }

    if( !IsNumber(that.inner.initialClipIndex)){
        that.logger.warn("Invalid that.inner.initialClipIndex type %s", that.inner.initialClipIndex);
        return false;
    }

    if( !Array.isArray(that.inner.durations) ){
        that.logger.warn("!that.inner.durations || typeof that.inner.durations !== 'Array'");
        return false;
    }

    if( !_.every(that.inner.durations,function(d){
            return d >= 0;
        })  )  {
        that.logger.warn("that.inner.duration < 0");
        return false;
    }

    if( !Array.isArray(that.inner.sequences)   ) {
        that.logger.warn("!that.inner.sequences || typeof that.inner.sequences !== 'Array'");
        return false;
    }

    if( !_.every( that.inner.sequences, function(seq) {
        if( !_.isArray(seq.clips) ) {
            that.logger.warn("!seq.clips instanceof Array ");
            return false;
        }
        if(that.inner.durations.length !== seq.clips.length){
            that.logger.warn("that.inner.durations.length !== seq.clips.length");
            return false;
        }
        if( seq.validate && !seq.validate(opts) ){
            return false;
        }
        return true;
    })) {
        return false;
    }

    // true for single flavor only
    if( that.inner.sequences.length === 1) {
        if (!_.every(that.inner.sequences[0].clips, function (clip, index) {
                var clipD = clip.getTotalDuration(),
                    overallD = that.inner.durations[index];
                if (overallD - clipD > playlistUtils.playlistConfig.timestampToleranceMs) {
                    that.logger.warn("Clip [%d] internal duration = %d != overall duration = %d", index, overallD, clipD);
                    return false;
                }
                return true;
            })) {
            return false;
        }
    }

    if(that.inner.firstClipTime <  that.inner.segmentBaseTime)  {
        that.logger.warn("that.inner.firstClipTime <  that.inner.segmentBaseTime");
        return false;
    }

    if( !that.inner.gaps.validate() ){
        return false;
    }

    if( !Array.isArray(that.inner.clipTimes)   ) {
        that.logger.warn("!Array.isArray(that.inner.clipTimes)");
        return false;
    }

    if( that.inner.clipTimes.length !==  that.inner.durations.length  ) {
        that.logger.warn("that.inner.clipTime.length !==  that.inner.durations.length");
        return false;
    }

    if(_.some(that.inner.clipTimes, function(clipTime,index){
            if( index > 0 ){
                return that.inner.clipTimes[index-1] + that.inner.durations[index-1] > that.inner.clipTimes[index];
            }
            return false;
        })) {
        that.logger.warn("that.inner.clipTimes[idx]-that.inner.durations[idx-1] >= that.inner.clipTimes[idx-1]");
        return false;
    }

    if( that.playListLimits && that.playListLimits.manifestTimeWindowInMsec &&
        that.playListLimits.manifestTimeWindowInMsec < that.totalDuration ){
        that.logger.warn("that.playListLimits.manifestTimeWindowInMsec < that.totalDuration. (%d < %d)",
            that.playListLimits.manifestTimeWindowInMsec , that.totalDuration );
        return false;
    }

    return PlaylistItem.prototype.validate.apply(that,arguments);
};

var rangeOverlap = function(dtsRange2){
    return this.min < dtsRange2.max && this.max > dtsRange2.min;
};

var calcClipStartTimeAndDuration = function(index){
    var that = this;

    var retVal = new TimeRange();

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

    if(retVal.valid) {

        that.inner.durations[index] = retVal.max - retVal.min;

        if( that.inner.clipTimes[index].value != retVal.min) {
            that.inner.clipTimes[index].value = retVal.min;
            that.logger.info("Recalculate Offsets And Duration(%d). Set clipTime: %s (%d). duration: %d",
                index,
                new Date(that.inner.clipTimes[index]),
                that.inner.clipTimes[index],
                that.inner.durations[index]);

            // special case for first clip
            if (index === 0) {
                var firstClipTime = that.inner.clipTimes[index].value;

                if (that.inner.firstClipTime !== firstClipTime) {
                    that.inner.firstClipTime = firstClipTime;
                    //first time ever
                    if (that.inner.segmentBaseTime === 0) {
                        that.inner.segmentBaseTime = firstClipTime;
                    }
                    if (that.inner.discontinuity) {
                        var nextSegmentIndex = Math.floor((that.inner.firstClipTime - that.inner.segmentBaseTime) / playlistUtils.playlistConfig.segmentDuration) + 1;
                        playlistUtils.dbgAssert(that.inner.initialSegmentIndex <= nextSegmentIndex);
                        that.inner.initialSegmentIndex = nextSegmentIndex;
                    }
                    that.emit(playlistUtils.ClipEvents.base_time_changed, that.inner.firstClipTime);
                }
            }
        }
    }
    return retVal;
};

var invalidRangeError = new Error('invalid time range');

// calculate firstClipTime, update segmentBaseTime (if needed) and sequences clips offsets
Playlist.prototype.recalculateOffsetsAndDuration = function recalculateOffsetsAndDuration (){
    var that = this;

    that.logger.debug('recalculateOffsetsAndDuration');

    that.inner.gaps.update();

    var retVal = new TimeRange();

    var minMaxInfos = _.map(that.inner.durations, function (d, index){
        this.inner.durations[index] = 0;
        return calcClipStartTimeAndDuration.call(this,index);
    },that).filter(function(minMax){
        return minMax.valid;
    });

    if(minMaxInfos.length) {
        retVal.min = minMaxInfos.first.min;
        retVal.max = minMaxInfos.last.max;
    }

    return retVal;

};

// PlaylistItem override used during serialization
Playlist.prototype.onUnserialize = function () {
    var that = this;

    that.inner.clipTimes = _.map(that.inner.clipTimes,function(ct){
        return new ValueHolder(ct);
    });
    that.inner.sequences = _.map(that.inner.sequences,function(seq){
        //flavor will be derived from seq object
        return createSequence.call(that,null,seq);
    });
    that.inner.gaps = new GapPatcher(that.logger,that,that.inner.gaps);

    that.recalculateOffsetsAndDuration();
};

//BroadcastEventEmitter overrides
Playlist.prototype.addListener = function(arg0){
    var that = this;

    var args = arguments;

    BroadcastEventEmitter.prototype.addListener.apply(this,args);
    // do not allow subscribing to named groups except this object
    if (typeof arg0 !== 'string') {
        _.each(that.inner.sequences, function (seq) {
            seq.addListener.apply(seq, args);
        });
    }
};

Playlist.prototype.removeListener = function(listener){
    BroadcastEventEmitter.prototype.removeListener.call(this,listener);
    _.each(that.inner.sequences,function (seq) {
        seq.removeListener(listener);
    });
};

// JSON serialization from disk/etc
Playlist.prototype.serializeFrom = function (playlistJSON,loggerInfo,cbDone){
    var playlist = undefined;
    try {
        playlist = JSON.parse(playlistJSON);
        playlist = new Playlist(loggerInfo,playlist);
    } catch (err) {
        loggerModule.getLogger("Playlist.serializeFrom", loggerInfo + " ").warn('Unable to un-serialize playlist. Data loss is inevitable!');
        if(cbDone){
            playlist = new Playlist(loggerInfo);
        }
    }
    if(cbDone){
        cbDone(playlist);
    }
};

// diagnostics info.

Playlist.prototype.getDiagnostics = function (opts) {
    var that = this,
        clipDuration = (opts && opts.clipDuration) ? opts.clipDuration : 10000;

    that.recalculateOffsetsAndDuration();

    var totalDuration = that.totalDuration;


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
    if(that.minMax && keys.length > 0) {
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

    that.logger.debug("toJSON: %d valid sequences", obj.sequences.length);

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
        seq.appendNewClip();
    }
    return clips[clips.length - 1];
};

Playlist.prototype.checkAddClipTime = function(seq){
    var that = this;

    while(seq.clips.length >= that.inner.clipTimes.length){
        that.logger.info("checkAddClipTime(%j) sequence length=%j append new clip",
            seq.inner.flavor,
            seq.clips.length);
        that.inner.clipTimes.push(new ValueHolder(0));
    }
    while(seq.clips.length >= that.inner.durations.length){
        that.inner.durations.push(0);
    }
    return that.inner.clipTimes.last;
};

Playlist.prototype.isModified = function(){
    var that = this;

    var playlist = that.inner;

    if(!playlist.durations.length ){
        return true;
    }

    if (playlist.durations.length > 0) {
        var minMax = that.recalculateOffsetsAndDuration();

        if( minMax == that.minMax ){
            return false;
        }

        // only update manifest if all downloaders have contributed to max
        if ( that.minMax && minMax.max === that.minMax.max ) {
            return false;
        }

        that.collectObsoleteClips();

        minMax = that.recalculateOffsetsAndDuration();

        that.minMax = minMax;
    }
    return true;
};

Playlist.prototype.collectObsoleteClips = function () {
    var that = this;

    while (that.inner.durations.length) {

        var seqs = _.filter(that.inner.sequences, function (seq) {
            return seq.clips.length > 0;
        });

        if (_.every(seqs, function (seq) {
                return seq.inner.clips.first.isEmpty();
            })) {
            _.each(seqs, function (seq) {

                that.logger.warn("collectObsoleteClips remove (%j) seq len=%j adding clipTime", seq.inner.flavor, seq.clips.length);

                seq.inner.clips.shift();

            });

            that.inner.clipTimes.shift();
            that.inner.durations.shift();

            playlistUtils.dbgAssert(that.inner.durations.length === that.inner.clipTimes.length);

            _.each(seqs,function(seq){
                playlistUtils.dbgAssert(seq.inner.clips.length === that.inner.clipTimes.length);
            });

        } else {
            break;
        }
    }
};

Playlist.prototype.handleEvent = function (type,arg) {
    var that = this;

    switch(type) {
        case playlistUtils.ClipEvents.item_disposed:
            that.removeListener(arg);
        default:
            that.emit.apply(that,arguments);
    }

};

module.exports = Playlist;