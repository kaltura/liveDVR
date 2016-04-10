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

function Playlist(serializationCtx) {

    PlaylistItem.prototype.constructor.call(this,serializationCtx);

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
    }
}

util.inherits(Playlist,PlaylistItem);

Playlist.prototype.getClipListForFlavor = function (flavor) {
    var that = this;

    if(flavor === undefined){
        playlistUtils.Info("Playlist.getClipListForFlavor bad flavor=", flavor);
        return;
    }

    // sequenceId can be any identifier -> map to index in array of sequences
    if(that.inner.flavor2SeqIndex[flavor] === undefined){
        playlistUtils.Info("Playlist.getClipListForFlavor add new sequence for flavor", flavor);
        that.inner.flavor2SeqIndex[flavor] = Object.keys(that.inner.flavor2SeqIndex).length;
        that.inner.sequences.push({clips:[]});
    }

    var sequenceIndex = that.inner.flavor2SeqIndex[flavor];
    return that.inner.sequences[sequenceIndex].clips;
};

Playlist.prototype.validate = function validate(opts) {
    var that = this;

    if( (typeof that.inner.playlistType !== 'string') || ['live','vod'].indexOf(that.inner.playlistType) < 0){
        playlistUtils.Warn("Playlist.validate invalid that.inner.playlistType", that.inner.playlistType);
        return false;
    }

    if( (typeof that.inner.firstClipTime !== 'number')){
        playlistUtils.Warn("Playlist.validate invalid that.inner.firstClipTime type", that.inner.firstClipTime);
        return false;
    }

    if( (typeof that.inner.segmentBaseTime !== 'number')){
        playlistUtils.Warn("Playlist.validate invalid that.inner.segmentBaseTime type", that.inner.segmentBaseTime);
        return false;
    }

    if( (typeof that.inner.initialClipIndex !== 'number')){
        playlistUtils.Warn("Playlist.validate invalid that.inner.initialClipIndex type", that.inner.initialClipIndex);
        return false;
    }

    if( (typeof that.inner.initialClipIndex !== 'number')){
        playlistUtils.Warn("invalid that.inner.initialClipIndex type", that.inner.initialClipIndex);
        return false;
    }

    if( !Array.isArray(that.inner.durations) ){
        playlistUtils.Warn("Playlist.validate !that.inner.durations || typeof that.inner.durations !== 'Array'");
        return false;
    }

    if( !_.every(that.inner.durations,function(d){
            return d >= 0;
        })  )  {
        playlistUtils.Warn("Playlist.validate that.inner.duration < 0");
        return false;
    }

    if( !Array.isArray(that.inner.sequences)   ) {
        playlistUtils.Warn("Playlist.validate !that.inner.sequences || typeof that.inner.sequences !== 'Array'");
        return false;
    }

    for( var i in that.inner.sequences) {
        var seq = that.inner.sequences[i];
        if( !Array.isArray(seq.clips) ) {
            playlistUtils.Warn("Playlist.validate !seq.clips !seq.clips instanceof Array ");
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
                if(  clipD < overallD ){
                    return false;
                }
            }
            return true;
        } ) ) {
        playlistUtils.Warn("Playlist.validate duration is greater than the sum of the durations array ");
        return false;
    }

    if(that.inner.firstClipTime <  that.inner.segmentBaseTime)  {
        playlistUtils.Warn("Playlist.validate that.inner.firstClipTime <  that.inner.segmentBaseTime");
        return false;
    }

    return true;
};

Playlist.prototype.recalculateOffsetsAndDuration = function recalculateOffsetsAndDuration (index){
    var that = this;

    var minDTS = Number.MIN_VALUE,
        maxDTS = Number.MAX_VALUE;

    // determine dts range
    _.each(that.inner.sequences,function(seq){
        if(seq.clips.length > index) {
            var dtsRange = seq.clips[index].getDTSRange();
            minDTS = Math.max(dtsRange.min, minDTS);
            maxDTS = Math.min(maxDTS, dtsRange.max);
        }
    });
    if(minDTS > Number.MIN_VALUE) {

        that.inner.firstClipTime = Math.max(that.inner.firstClipTime,Math.ceil(minDTS));
        that.inner.durations[index] =  Math.ceil(maxDTS-that.inner.firstClipTime);

        var date = new Date(that.inner.firstClipTime);
        playlistUtils.Info("Playlist.recalculateOffsetsAndDuration set firstClipTime=",date);

        _.each(that.inner.sequences,function(seq) {
            seq.clips.forEach(function(c) {
                c.updateOffset(that.inner.firstClipTime);
            });
        });
        return {min:minDTS,max:maxDTS};
    }
};

var unserializeClip = function (c){
    switch(c.type){
        case 'mixFilter':
            return new MixFilterClip(c);
        case 'source':
            return new SourceClip(c);
        default:
            throw new Error('unknown clip type ' + c.type);
    }
};

Playlist.prototype.onSerialize = function () {
    var that = this;

    _.each(that.inner.sequences,function (seq) {
        seq.clips = seq.clips.map( function(c) {
            return unserializeClip(c);
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

Playlist.prototype.serializeFrom = function (stream,cbDone){

    var playlistJSON = '';
    stream.on('data', function (chunk) {
        playlistJSON += chunk;
    });
    stream.on('error', function (err) {
        playlistUtils.Warn('failed to read from file error: %s', err);
        cbDone(new Playlist());
    });
    stream.on('end', function () {
        stream.close();
        var plalylist = null;
        try {
            var playlist = JSON.parse(playlistJSON);
            plalylist = new Playlist(playlist);
        } catch (err) {
            playlistUtils.Warn('unable to unserialize playlist. data loss is inevitable!');
            plalylist = new Playlist();
        }
        cbDone(plalylist);
    });
    stream.resume();
};

Playlist.prototype.getDiagnostics = function (opts) {
    var that = this,
        clipDuration = (opts && opts.clipDuration) ? opts.clipDuration : 10000;

    that.recalculateOffsetsAndDuration();

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
        windowDurationMs: totalDuration
    };

    if(opts && opts.displayPlaylist) {
        diag.playlist = that;
    }
    if(totalDuration && that.inner.minMax) {
        var overallDuration = Math.max(0,that.inner.minMax.max - that.inner.minMax.min);
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
        //TODO: when packager is ready remove following line
        //that.inner.firstClipTime += to - from;
        playlistUtils.Warn('Playlist.collapseGap. that.inner.firstClipTime=%s',new Date(that.inner.firstClipTime));
    }
};

module.exports = Playlist;

