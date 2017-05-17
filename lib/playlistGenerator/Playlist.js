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
var path = require('path');
var hostname = require('../../common/utils/hostname');

var machineName = hostname.getLocalMachineFullHostname();

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
*   presentationEndTime : (int) expiry end time (UTC, milliseconds) after which packager is allowed to insert end of stream indicator
*   sequences : (collection of Clip) flavor collection containing MixFilterClip objects
*   durations:  (collection of int) total clip durations; actually it's always 1 long since we use MixFilterClip. along with firstClipTime describes playlist window.
* */
function Playlist(loggerInfo, serializationCtx, playlistType, playListFormat = 'live') {

    this.loggerInfo = loggerInfo + '[p-' + Playlist.prototype.playerId++ + ']' ;
    this.logger = loggerModule.getLogger("Playlist", this.loggerInfo);
    this.gaps = new GapPatcher(this.logger,this);
    this.cumulatedGaps = this.gap = 0;
    this.firstClipBaseTime = Infinity;
    this.playlistType = playlistType;
    this.playListFormat = playListFormat;
    this.logger.info("c-tor");

    PlaylistItem.prototype.constructor.call(this, this.logger, this,serializationCtx);

    var inner = this.inner;
    if(!this.isInitialized()) {
        inner.durations = [];
        inner.playlistType = playlistType;
        // segmentBaseTime is readonly, references some arbitrarily picked point in time, namely Sat, 01 Jan 2000 00:00:00 GMT
        // segmentBaseTime is shared by all playlists so that seamless failover may work
        inner.segmentBaseTime = inner.firstClipTime = 946684800000;
        inner.discontinuity = true;
        inner.clipTimes = [];
        inner.sequences = [];
        inner.initialClipIndex = 1;
        inner.firstClipStartOffset = 0;
    }
    // track when and were playlist was reloaded
    if (!inner.history) {
        inner.history = [];
    }
    if (inner.history.length ) {
        if( inner.history.last.host != machineName) {
            inner.history.push({host: machineName, time: new Date()});
        }
        var maxHilstoryLength = 100;
        if(inner.history.length > maxHilstoryLength ){
            inner.history.splice(0,inner.history.length-maxHilstoryLength);
        }
    } else {
        inner.history.push({host: machineName, time: new Date()});
    }

    this.updateGap();
}


util.inherits(Playlist,PlaylistItem);


Object.defineProperty(Playlist.prototype , "ptsReference", {
    get: function get_ptsReference() {
        if(!this.inner.reference) {
            this.inner.reference = {
                absolute: null,
                pts: null
            };
        }
        return this.inner.reference;
    }
});

Object.defineProperty(Playlist.prototype , "sequences", {
    get: function get_Sequences() {
        return this.inner.sequences;
    }
});

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
    var sequence = _.find(that.inner.sequences,function(seq){
        return seq.inner.id == flavor;
    });
    if(sequence === undefined){
        that.logger.info("Add sequence for flavor [%s]", flavor);
        sequence = createSequence.call(that,flavor);
        that.inner.sequences.push(sequence);
    }
    return sequence;
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
Playlist.prototype.doValidate = function playlist_doValidate(opts) {
    var that = this;

    if( (typeof that.inner.playlistType !== 'string') || ['live','vod'].indexOf(that.inner.playlistType) < 0){
        that.logger.warn("Invalid that.inner.playlistType %s", that.inner.playlistType);
        return false;
    }

    if( !IsNumber(that.inner.segmentBaseTime)){
        that.logger.warn("Invalid that.inner.segmentBaseTime type %s", that.inner.segmentBaseTime);
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
        if( seq.doValidate && !seq.doValidate(opts) ){
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

    if(!_.isNumber(that.firstClipBaseTime)){
        that.logger.warn("that.inner.firstClipBaseTime expected to be int");
        return false;
    }

    if(_.isFinite(that.firstClipBaseTime) && that.firstClipBaseTime < that.inner.segmentBaseTime){
        that.logger.warn("that.firstClipBaseTime < that.inner.segmentBaseTime");
        return false;
    }

    if(!_.isNumber(that.inner.firstClipStartOffset)){
        that.logger.warn("that.inner.firstClipStartOffset expected to be int");
        return false;
    }

    if(that.inner.firstClipStartOffset < 0){
        that.logger.warn("that.inner.firstClipStartOffset < 0");
        return false;
    }

    if( !Array.isArray(that.inner.clipTimes)   ) {
        that.logger.warn("!Array.isArray(that.inner.clipTimes)");
        return false;
    }

    if(!_.chain(that.inner.clipTimes)
            .map(clipTime => clipTime.value)
            .every(clipTime =>_.isNumber(clipTime) && _.isFinite(clipTime))
            .value())  {
        that.logger.warn("that.inner.clipTimes contain uninitialized value");
        return false;
    }

    if(that.inner.clipTimes.length ) {
        if (that.inner.clipTimes.first < that.inner.segmentBaseTime) {
            that.logger.warn("that.inner.clipTimes[0] <  that.inner.segmentBaseTime");
            return false;
        }
        if(_.isFinite(that.firstClipBaseTime)){
            if(that.inner.firstClipStartOffset !== that.inner.clipTimes.first - that.firstClipBaseTime){
                that.logger.warn("that.inner.firstClipStartOffset !== that.inner.clipTimes.first - that.firstClipBaseTime");
                return false;
            }
        }

    }

    if( that.inner.clipTimes.length !==  that.inner.durations.length  ) {
        that.logger.warn("that.inner.clipTime.length !==  that.inner.durations.length");
        return false;
    }

    if(_.some(that.inner.clipTimes, (clipTime,index) => {
            if( index > 0 ){
                return _.isFinite(that.inner.clipTimes[index]) && that.inner.clipTimes[index-1] + that.inner.durations[index-1] > that.inner.clipTimes[index];
            }
            return false;
        })) {
        that.logger.warn("that.inner.clipTimes[idx]-that.inner.durations[idx-1] >= that.inner.clipTimes[idx-1]");
        return false;
    }

    if( !that.gaps.doValidate() ){
        return false;
    }

    if( that.playListLimits && that.playListLimits.manifestTimeWindowInMsec &&
        3 * that.playListLimits.manifestTimeWindowInMsec < that.totalDuration ){
        that.logger.warn("that.playListLimits.manifestTimeWindowInMsec <  that.totalDuration. (%d < %d)",
            that.playListLimits.manifestTimeWindowInMsec , that.totalDuration );
        return false;
    }

    if(that.inner.sequences.length > 1 && that.inner.clipTimes.length > 0){
        _.each(that.inner.clipTimes, function(ct,index){

            var srcInfos =_.reduce(that.inner.sequences, function(val,seq){
                return val.concat(seq.clips[index].inner.sources);
            },[]);

            var videos = _.filter(srcInfos,function(i){
                return i.isVideo;
            }), audios = _.filter(srcInfos,function(i){
                return !i.isVideo;
            });



            if( _.any(videos,function(v){
                    return v.inner.offset < 0;
                })) {
                that.logger.warn("v.offset < 0");
                return false;
            }

            if( _.any(audios,function(a){
                    return a.inner.offset < 0;
                })) {
                that.logger.warn("v.offset < 0;");
                return false;
            }

            // all but injest(s)
            if(_.any(videos.slice(1),function(a,index){
                    return videos[1].inner.offset !== a.inner.offset;
                }) ){
                that.logger.warn("videos offsets! %j",util.inspect(_.map(videos,function(a){
                    return a.inner.offset;
                })));
                return false;
            }

            //check if all audios match incl. injest
            if(_.any(audios,function(a,index){
                    return audios[0].inner.offset !== a.inner.offset;
                }) ){
                that.logger.warn("audio offsets! %j",_.map(audios,function(a){
                    return a.inner.offset;
                }));
                return false;
            }
        });

    }

    if( !_.isFinite(that.cumulatedGaps) ){
        that.logger.warn("!playlistUtils.validateNumber(that.cumulatedGaps %j", that.cumulatedGaps);
        return false;
    }

    if( that.cumulatedGaps < 0 ){
        that.logger.warn("that.cumulatedGaps < 0" );
        return false;
    }

    if( !_.isNumber(that.inner.firstClipTime) ){
        that.logger.warn("typeof that.inner.firstClipTime !== 'number'");
        return false;
    }

    if( that.inner.firstClipTime < that.inner.segmentBaseTime ){
        that.logger.warn("that.inner.firstClipTime < that.inner.segmentBaseTime");
        return false;
    }

    if( that.inner.clipTimes.length && that.inner.firstClipTime !== that.inner.clipTimes.first - that.cumulatedGaps ){
        that.logger.warn("that.inner.firstClipTime !== that.inner.clipTimes[0] - that.cumulatedGaps %j !== %j - %j",
            that.inner.firstClipTime, that.inner.clipTimes.first , that.cumulatedGaps );
        return false;
    }

    return PlaylistItem.prototype.doValidate.apply(that,arguments);
};



var calcClipStartTimeAndDuration = function(index){
    var that = this;

    var retVal = new TimeRange();

    // determine dts range

    // step # 1: fill out all clip ranges
    var ranges = _.map(that.inner.sequences,(seq)=> {
        if(seq.clips.length > index) {
            return seq.clips[index].getDTSRange();
        }
        return retVal;
    });

    if(_.every(ranges,function(r){
            return !r.valid;
        })){
        return retVal;
    }

    // step # 2: check all ranges overlap
    if(_.size(ranges) > 0) {
        retVal.min = retVal.max = _.min(ranges,(r) => r.valid ? r.min : Number.MAX_VALUE).min;
        if(_.every(ranges,(r) => ranges[0].overlaps(r))){
            retVal.max = _.min(ranges,function(r){return r.max;}).max;
        }
    }

    if(retVal.valid) {

        that.inner.clipTimes[index].value = retVal.min;
        that.inner.durations[index].value = retVal.max - that.inner.clipTimes[index];

        // special case for first clip
        if (index === 0 && that.inner.durations[index] > 0) {
            let firstClipTime = retVal.min - that.cumulatedGaps;
            if(firstClipTime != that.inner.firstClipTime) {
                that.inner.firstClipTime = firstClipTime;
                that.emit(playlistUtils.ClipEvents.base_time_changed, firstClipTime);
            }
           if( !_.isFinite(that.firstClipBaseTime) ) {
                that.firstClipBaseTime = that.inner.clipTimes[index].valueOf();
            }
            that.inner.firstClipStartOffset =  that.inner.clipTimes[index].valueOf() - that.firstClipBaseTime;
        }
    }

    that.logger.info("Recalculate Offsets And Duration(%d). Set clipTime: %s (%d). duration: %d firstClipStartOffset = %d",
        index,
        new Date(that.inner.clipTimes[index]),
        that.inner.clipTimes[index],
        that.inner.durations[index],
        that.inner.firstClipStartOffset);

    return retVal;
};

var invalidRangeError = new Error('invalid time range');

// calculate firstClipTime, update segmentBaseTime (if needed) and sequences clips offsets
Playlist.prototype.recalculateOffsetsAndDuration = function recalculateOffsetsAndDuration (){
    var that = this;

    that.logger.trace('recalculateOffsetsAndDuration');

    that.gaps.update();

    var retVal = new TimeRange();

    var minMaxInfos = _.map(that.inner.durations, (d, index) => {
        this.inner.durations[index].value = 0;
        return calcClipStartTimeAndDuration.call(this,index);
    });

    if(minMaxInfos.length && _.every(minMaxInfos,r=>r.valid)) {
        retVal.min = minMaxInfos.first.min;
        retVal.max = minMaxInfos.last.max;
    }

    that.updateGap();

    return retVal;

};

// PlaylistItem override used during serialization
Playlist.prototype.onUnserialize = function () {
    var that = this;

    that.inner.clipTimes = _.map(that.inner.clipTimes,function(ct){
        return new ValueHolder(ct);
    });
    that.inner.durations = _.map(that.inner.durations,function(d){
        return new ValueHolder(d);
    });
    that.inner.sequences = _.map(that.inner.sequences,function(seq){
        //flavor will be derived from seq object
        return createSequence.call(that,null,seq);
    });

    if(that.inner.clipTimes.length) {
        that.cumulatedGaps = that.inner.clipTimes.first -  that.inner.firstClipTime;
        that.firstClipBaseTime = that.inner.clipTimes.first - that.inner.firstClipStartOffset;
    }

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
Playlist.prototype.serializeFrom = function (playlistJSON,loggerInfo,cbDone,reportError, playListFormat){
    var playlist = undefined;
    try {
        playlist = JSON.parse(playlistJSON);
        playlist = new Playlist(loggerInfo, playlist, undefined, playListFormat);
    } catch (err) {
        loggerModule.getLogger("Playlist.serializeFrom", loggerInfo + " ").warn('Unable to un-serialize playlist. Data loss is inevitable!');
        if(reportError) {
           playlist = err;
        } else {
           playlist = new Playlist(loggerInfo, undefined, undefined, playListFormat);
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
        gaps: that.gaps.toHumanReadable(clipDuration)
    };

    if(that.minMax) {
        var range = that.minMax,
            min = Math.floor((range.min - that.inner.segmentBaseTime) / clipDuration),
            max = Math.floor((range.max - that.inner.segmentBaseTime) / clipDuration);
        diag.window['P'] = [min,max];

        _.each(that.inner.sequences, function (seq) {
            range = seq.clips[0].getDTSRange();
            min = Math.floor((range.min - that.inner.segmentBaseTime) / clipDuration);
            max = Math.floor((range.max - that.inner.segmentBaseTime) / clipDuration);
            diag.window['' + seq.inner.id + ''] = [min,max];
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
        that.gaps.collapseGap(gap);
    }
};

var filterByDuration = function (v, index) {
    return this.inner.durations[index] > 0;
};

// used by JSON.sringify
Playlist.prototype.toJSON = function() {
    var that = this;

    if (!that.minMax) {
        return PlaylistItem.prototype.toJSON.call(that);
    }

    var obj = _.clone(that.inner);

    // durations can have 0 values during transition period
    // when some sequences have emptied their clip[0] while others not.
    if(obj.durations.length > 0) {
       obj.durations = _.filter(obj.durations, function (d, index) {
            return d > 0;
        });

        // special case of clips with 0 duration
        if (obj.durations.length < that.inner.durations.length) {
            obj.clipTimes = _.filter(obj.clipTimes, filterByDuration, that);
        }
    }

    that.logger.debug("toJSON: total sequences: %d, total clips: %d", obj.sequences.length, obj.clipTimes.length);

    return obj;
};

Playlist.prototype.updateGap = function () {
    var that = this;

    if (that.playlist.inner.clipTimes.length > 1) {
        that.playlist.gap = that.inner.clipTimes[1] - that.inner.clipTimes[0] - that.inner.durations[0];
    }
};

// return clip approprate for appending a newly inserted chunk
Playlist.prototype.insertChunk = function (fileInfo) {
    var that = this;

    var seq = that.getSequenceForFlavor(fileInfo.flavor);

    var chunkName = path.basename(fileInfo.path);

    if(chunkName && !seq.checkFileExists(chunkName)) {

        if (seq.clips.length === 0) {
            seq.createAndAppendNewClip();
        }

        seq.clips.last.insert(fileInfo);

        return true;
    }
    return false;
};

Playlist.prototype.checkAddClipTime = function(seq){
    var that = this;

    while(seq.clips.length >= that.inner.clipTimes.length){
        that.logger.info("checkAddClipTime. sequence %j length=%j append new clip",
            seq.inner.id,
            seq.clips.length);
        that.inner.clipTimes.push(new ValueHolder(Infinity));
    }
    while(seq.clips.length >= that.inner.durations.length){
        that.inner.durations.push(new ValueHolder(0));
    }
    return that.inner.clipTimes.last;
};

Playlist.prototype.isModified = function(){
    var that = this;

    var playlist = that.inner;

    if (playlist.durations.length > 0) {

        that.collectObsoleteClips();

        var minMax = that.recalculateOffsetsAndDuration();

        if( !minMax || !minMax.valid ){
            return false;
        }

        if( minMax == that.minMax ){
            return false;
        }

        // only update manifest if all downloaders have contributed to max
        if ( that.minMax && minMax.max === that.minMax.max ) {
            return false;
        }

        that.logger.trace("playlist modified: %j vs %j",minMax.max,that.minMax ? that.minMax.max : 0);

        that.minMax = minMax;

        return true;
    }
    return false;
};

Playlist.prototype.collectObsoleteClips = function () {
    var that = this;

    while (that.inner.durations.length > 1) {

        var seqs = _.filter(that.inner.sequences, function (seq) {
            return seq.clips.length > 0;
        });

        if (_.any(seqs, function (seq) {
                return seq.inner.clips.first.isEmpty();
            })) {
            _.each(seqs, function (seq) {

                that.logger.info("collectObsoleteClips remove empty clip seq=(%j) clips_count=%j", seq.inner.id, seq.clips.length);

                that.cumulatedGaps += that.gap;
                that.gap = 0;
                seq.inner.clips.first.clearClip();
                seq.inner.clips.shift();
            });

            if( that.inner.initialClipIndex ) {
                that.inner.initialClipIndex++;
                // make sure gap is updated in case there are multiple empty clips
                // to be removed
                that.updateGap();
            }

            that.playlist.firstClipBaseTime = Infinity;
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

Playlist.prototype.checkFileExists = function(fileName){
    var that = this;

    return _.any(that.inner.sequences,function(seq){
        return seq.checkFileExists(fileName);
    });
};

Playlist.prototype.updateEncodedBitrate = function(flavor, encodedBitrate) {
    let seq = this.getSequenceForFlavor(flavor);

    if (encodedBitrate && seq) {
        seq.inner.bitrate.v = encodedBitrate.videoBitrate;
        seq.inner.bitrate.a = encodedBitrate.audioBitrate;
    }
};

Playlist.prototype.updateSequenceLanguage = function(flavor, language) {
  let seq = this.getSequenceForFlavor(flavor);

  if (seq && language !== "") {
      seq.inner.language = language;
  }
};

module.exports = Playlist;