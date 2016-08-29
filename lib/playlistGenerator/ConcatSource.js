/*
 *   vod packager playlist implementation.
 *   for details see https://github.com/kaltura/nginx-vod-module
 * */

var    _ = require('underscore');
var util = require('util');
var playlistUtils = require('./playlistGen-utils');
var PlaylistItem = require('./PlaylistItem');
var Path = require('path');
var fs = require('fs');
var TimestampList = require('./TimestampList');
var loggerModule = require('../../common/logger');


var playlistConfig = playlistUtils.playlistConfig;

var makeScheme = function() {
    return {
        durations:[],
        paths: [],
        lastEncoderDTS:0
    };
};

/*
 ConcatSource class.
 single source using multiple chunks of same media type (video|audio).
 aggregated by MixFilterClip class.
 */
function ConcatSource(loggerInfo, playlistObj, parentObj, track, chunkPath) {

    var tracks = chunkPath ? track : track.tracks;
    this.logger = loggerModule.getLogger("ConcatSource", loggerInfo + '[' + tracks + '] ');
    this.ptsStats = new playlistUtils.Stats();
    this.dtsJitter = 0;
    this.clip = parentObj;
    this.keyFrameDurations = [];

    PlaylistItem.prototype.constructor.call(this, this.logger, playlistObj, chunkPath ? undefined : track);

    if(! Object.keys(this.inner).length) {

        this.inner = makeScheme();

        this.inner.type = "concat";
        this.inner.tracks = track || 'v';
        this.inner.basePath = chunkPath ? chunkPath.substr(0, chunkPath.lastIndexOf('/') + 1) : '';
        this.inner.refPTS = -1;
        this.inner.refEncoderDTS = -1;
        this.inner.offset = 0;

        createTimestampList.call(this);
    }

}

function SourceTimestampList (source){

    this.source = source;
    TimestampList.prototype.constructor.call(this,source.logger,
        source.playlist,
        source.inner,
        'offset',
        source.inner.durations,
        TimestampList.prototype.editPolicy.update);
    source.clip.clipTime.addListener(playlistUtils.ClipEvents.value_changed,this);
}

util.inherits(SourceTimestampList,TimestampList);

SourceTimestampList.prototype.getClipTime = function(){
    return this.source.clip.clipTime;
};

SourceTimestampList.prototype.doValidate = function(){
    var that = this;

    if(!TimestampList.prototype.doValidate.call(that)) {
        return false;
    }

    if(that.firstDTS.length && that.offset + that.clipTime !== that.firstDTS[0]){
        that.logger.warn('that.offset + that.clipTime !== that.firstDTS[0]');
        return false;
    }
    return true;
};

var createTimestampList = function(){
    this.durationsMan = new SourceTimestampList(this);
};

util.inherits(ConcatSource,PlaylistItem);

ConcatSource.prototype.dataScheme = makeScheme();

// return playable range for this track
ConcatSource.prototype.getDTSRange = function() {
    var that = this;
    var retval = that.durationsMan.getDTSRange();
    // this.logger.debug("getDTSRange. %j",retval);
    return retval;
};

ConcatSource.prototype.getItem = function(index) {
    var that = this;
    if(index < 0 || index >=  that.durationsMan.durations.length) {
        return {};
    }
    return {
        durations:   that.durationsMan.durations[index],
        paths:      that.inner.paths[index],
        firstDTS:   that.durationsMan.firstDTS[index],
        tracks:     that.inner.tracks,
        keyFrames:  that.keyFrameDurations[index]
    };
};

var popClip = function() {
    var that = this;
    removeItem.call(that,0);
};

var allKeysButDurations = _.filter(Object.keys(ConcatSource.prototype.dataScheme),function(key){
    return key !== 'durations' && key !== 'lastEncoderDTS';
});

var removeItem = function(index,surpressEvent) {
    var that = this;

    that.logger.trace('Remove Item(%j) %j', index, that.getItem(index));

    if(!surpressEvent) {
        that.emit(playlistUtils.ClipEvents.clip_removed, that, index);
    }

    that.durationsMan.remove(index);
    that.keyFrameDurations.splice(index,1);

    if(index === 0) {
        _.each(allKeysButDurations,function(key){
            this[key].shift();
        }, that.inner);
    } else {
        _.each(allKeysButDurations,function(key){
            this[key].splice(index,1);
        }, that.inner);
    }

};

// check live window low boundary
ConcatSource.prototype.checkExpires = function (clock,totalDuration) {
    var that = this;
    var paths = [];
    if (that.playlist.playListLimits.manifestTimeWindowInMsec) {
        totalDuration = totalDuration || that.durationsMan.totalDuration;

        while (that.durationsMan.totalDuration > 0 &&
        totalDuration - that.durationsMan.durations[0] > that.playlist.playListLimits.manifestTimeWindowInMsec) {
            paths.push(that.inner.paths[0]);
            that.logger.trace('checkExpires. Found clip path=%j dts=%j dur=%j totalDuration=%j', that.inner.paths[0],
                that.durationsMan.firstDTS[0],
                that.durationsMan.durations[0],
                totalDuration);
            totalDuration -= that.durationsMan.durations[0];
            popClip.call(that);
        }
    }
    else if (that.playlist.playListLimits.maxClipCountPerPlaylist) {
        while (that.durationsMan.durations.length > that.playlist.playListLimits.maxClipCountPerPlaylist) {
            paths.push(that.inner.paths[0]);
            that.logger.info('checkExpires. Found clip %s, clip_count = %d', that.inner.paths[0], that.durationsMan.durations.length);
            popClip.call(that);
        }
    }
    return paths;
};

// add chunk of media
ConcatSource.prototype.concatClip = function (fileInfo,track) {
    var that = this;

    //firstEncoderDTS passes in as a double, but is used as an int
    track.firstEncoderDTS = Math.ceil(track.firstEncoderDTS);

    var filePath = fileInfo.path;
    if (that.inner.basePath) {
        var offset = fileInfo.path.indexOf(that.inner.basePath);
        if (offset < 0) {
            that.logger.warn('Clip %s does not match basePath: %s', fileInfo.path, that.inner.basePath);
        } else {
            filePath = fileInfo.path.substr(offset + that.inner.basePath.length);
        }
    }

    var result = that.checkDiscontinuity(fileInfo,track);

    var duration = Math.max(0, Math.ceil(track.duration));

    that.inner.lastEncoderDTS = Math.ceil(addWithOverflow(track.firstEncoderDTS + duration, track.wrapEncoderDTS));
    that.inner.paths.push(filePath);

    firstDTS = Math.ceil(result.firstDTS || 0);
    var oldDuration = 0;
    if(that.durationsMan.durations.length && !result.discontinuity){
        oldDuration = that.durationsMan.durations.last;
    }
    that.durationsMan.insertAt(that.durationsMan.durations.length,result.firstDTS,duration,result.discontinuity);

    var keyFrameDurations = [];

    if( track.keyFrameDTS && track.keyFrameDTS.length) {
        var keyFrameDTS = _.filter(track.keyFrameDTS,function(dts) {
            return dts < duration;
        });

        keyFrameDTS.push(duration);

        _.each(keyFrameDTS,function(dts,index){
            if(index > 0){
                var kfd = Math.floor(dts - keyFrameDTS[index-1]);
                if(kfd > 0) {
                    keyFrameDurations.push(kfd);
                }
            }
        });
        if(oldDuration > 0 && that.keyFrameDurations.length ){
            playlistUtils.dbgAssert(that.durationsMan.durations.length > 1);
            var correction = that.durationsMan.durations[that.durationsMan.durations.length-2] - oldDuration;
            var kfdl = that.keyFrameDurations.last;
            while( kfdl.length && correction ){
                kfdl.last += correction;
                if(kfdl.last <= 0) {
                    correction = kfdl.last;
                    kfdl.splice(kfdl.length-1,1);
                } else {
                    break;
                }
            }
        }
        that.keyFrameDurations.push(keyFrameDurations);
    }

    that.logger.info('concatClip: chunk=[%s , Dts=%d , Enc_dts=%d , Duration=%d , Sig=%s kf=%j]',
        filePath,
        result.firstDTS,
        Math.floor(track.firstEncoderDTS),
        duration,
        fileInfo.sig,
        keyFrameDurations);

    if(!that.validate()){
        throw new Error('Debug validate failed');
    }
};

// r (range) designates gap between adjacent source clips
// so clip A is going to create clip B at offset r.to - r.from just beyond it's high end
ConcatSource.prototype.split = function (newSrc,r) {
    var that = this;

    if(!r || r.from >= r.to ){
        throw new Error('Split error: Wrong limitTime arg');
    }

    var lastThisIndex  = _.sortedIndex(that.durationsMan.firstDTS, r.from),
        firstThatIndex = _.sortedIndex(that.durationsMan.firstDTS, r.to);

    newSrc.inner.lastEncoderDTS = that.inner.lastEncoderDTS;
    newSrc.inner.refEncoderDTS = that.inner.refEncoderDTS;
    newSrc.inner.refPTS = that.inner.refPTS;

    // erase clips from *noone's land*
    // update duration of a last item before gap if needed
    if(lastThisIndex > 0){
        playlistUtils.dbgAssert(that.durationsMan.firstDTS[lastThisIndex-1] <= r.from);

        var updatedDuration = Math.min( Math.max(0,r.from - that.durationsMan.firstDTS[lastThisIndex-1]),
            that.durationsMan.durations[lastThisIndex-1]);

        if(updatedDuration <= 0){
            lastThisIndex--;
        } else {
            that.durationsMan.setDurationAt(lastThisIndex-1,updatedDuration);
        }

        that.logger.debug("split %j-%j len=%j",lastThisIndex,firstThatIndex,that.durationsMan.firstDTS.length);
    }

    _.each(that.inner.durations.slice(lastThisIndex,firstThatIndex),function(duration){
        removeItem.call(that,lastThisIndex);
        that.inner.lastEncoderDTS -= duration;
        firstThatIndex--;
    });

    var splitItems =  _.tail(that.inner.durations,firstThatIndex);
    // transfer items from old source to new one
    _.each( splitItems, function(duration,index) {

        index += firstThatIndex;

        var item = that.getItem(index);

        newSrc.inner.paths.push(item.paths);

        newSrc.durationsMan.append(item.firstDTS,item.durations);

        if(item.keyFrames) {
            newSrc.keyFrameDurations.push(item.keyFrames);
        }

        that.logger.info('split: Append clip = [%s]; Dts = [%d]; Duration = [%d]',
            item.paths, item.firstDTS, item.durations);

    });

    _.each( splitItems,function(duration){
        removeItem.call(that,firstThatIndex,true);
        that.inner.lastEncoderDTS -= duration;
    });

    newSrc.inner.offset = newSrc.durationsMan.firstDTS[0] - newSrc.clip.clipTime;

    if (!that.validate()) {
        throw new Error('split: validate failed');
    }

    if (!newSrc.validate()) {
        throw new Error('split: new source validate failed');
    }

};


var dtsDistance = function(a,b,wrap){
    var diff = addWithOverflow(a - b,wrap);

    //this is not a wrap, check for timestamp reset
    if(diff >= wrap/2 ){
        diff = a - b;
    }
    return diff;
};

var checkGap = function (timestampDiff,fileInfo){
    var that = this;
    if( timestampDiff > playlistConfig.maxChunkGapSize ) {
        that.logger.warn('CheckDiscontinuity: Gap. Prev clip [%s] -> New clip [%s]. Gap = %d > maxChunkGapSize = %d',
            that.inner.paths.last,
            fileInfo.path.substr(that.inner.basePath.length),
            timestampDiff,
            playlistConfig.maxChunkGapSize);

      return true;
    }
    return false;
};

var checkOverlap = function(firstDTS,lastDTS){
    var that = this;
    if (lastDTS - playlistUtils.playlistConfig.maxAllowedPTSDrift > firstDTS) {
        that.logger.warn("checkOverlap. overlap not supported : %j",lastDTS-firstDTS);
        throw new playlistUtils.BadClipError(playlistUtils.ClipErrors.overlapUnsup);
    }
}

var checkClipStartTime = function(fileInfo){
    var that = this;

    if (fileInfo.startTime === 0) {
        that.logger.warn("checkClipStartTime. fileInfo.startTime === 0");
        throw new playlistUtils.BadClipError(playlistUtils.ClipErrors.undefStartTime);
    }
};

// check for gaps, reorder etc.
ConcatSource.prototype.checkDiscontinuity = function (fileInfo,track) {
    var that = this;

    var firstDTS,discontinuity = false;

    track.firstDTS =  Math.ceil(track.firstDTS);

    if (that.durationsMan.durations.length ===  0) {
        checkClipStartTime.call(that,fileInfo);

        that.inner.refPTS = track.firstDTS;
        that.inner.refEncoderDTS = track.firstEncoderDTS;
        firstDTS = track.firstDTS;
    } else {
        var lastDTS = that.durationsMan.firstDTS.last + that.durationsMan.durations.last;
        // this file does not have absolute time information, skip all measuring
        if (fileInfo.startTime === 0) {
            firstDTS = lastDTS;
        } else  {
            firstDTS = track.firstDTS;
        }

        // check for good correlation between timestamp and encoder dts
        var timestampDiff = Math.ceil(firstDTS - lastDTS),
            encDiff = dtsDistance(track.firstEncoderDTS, that.inner.lastEncoderDTS,track.wrapEncoderDTS);

        // either encoder diff is small or timestamp to encoder dts correlation is good
        var correlation = Math.min( Math.abs(encDiff), Math.abs(timestampDiff-encDiff) );

        // check for dts discontinuity
        if (correlation < playlistConfig.maxAllowedPTSDrift) {

            // calculate immediate value of drift
            that.ptsStats.addSample(correlation);

            // reassign firstDTS in accordance with pts diff to avoid noise
            if (that.inner.refPTS > 0) {
                // prevent wrap issues
                while(firstDTS - that.inner.refPTS >= track.wrapEncoderDTS / 2){
                    that.inner.refPTS += track.wrapEncoderDTS / 2;
                    that.inner.refEncoderDTS = addWithOverflow(that.inner.refEncoderDTS + track.wrapEncoderDTS / 2,track.wrapEncoderDTS);
                }
                firstDTS = that.inner.refPTS + dtsDistance(track.firstEncoderDTS, that.inner.refEncoderDTS,track.wrapEncoderDTS);
            }

            checkOverlap.call(that,firstDTS,lastDTS);

            if (timestampDiff < playlistConfig.maxChunkGapSize )  {
                var log = Math.abs(encDiff) > 1000 ? that.logger.warn : (Math.abs(encDiff) > 20 ? that.logger.info : that.logger.trace);

                if(that.dtsJitter === 0){
                    that.dtsJitter = Math.floor(( 6 * that.dtsJitter + 10 * timestampDiff ) / 16 );
                } else {
                    that.dtsJitter = timestampDiff;
                }
                log.call(that.logger, 'CheckDiscontinuity: Slight time diff. Previous clip [%s] -> new clip [%s, %s] ts delta = [%d msec] Enc delta = [%d]; Avg = [%d] Stddev = [%d] Prev clip duration = [%d]; Acc drift = [%d]',
                    that.inner.paths.last,
                    fileInfo.path.substr(that.inner.basePath.length),
                    fileInfo.chunkName,
                    timestampDiff,
                    encDiff,
                    Math.floor(that.ptsStats.avg),
                    Math.floor(that.ptsStats.stdDev),
                    that.durationsMan.durations.last,
                    that.dtsJitter);
            }
            // go with encDiff as it is more precise
            timestampDiff = encDiff;
        } else {
            checkClipStartTime.call(that,fileInfo);

            checkOverlap.call(that,firstDTS,lastDTS);

            that.logger.warn('CheckDiscontinuity: Encoder reset. Previous clip (%s,%d) -> New clip (%s,%d). Dts diff = [%d], Enc_diff = [%d]',
                that.inner.paths.last,
                Math.floor(lastDTS),
                fileInfo.path.substr(that.inner.basePath.length),
                firstDTS,
                Math.floor(track.firstDTS - lastDTS),
                Math.floor(encDiff));

            that.inner.refPTS = firstDTS;
            that.inner.refEncoderDTS = track.firstEncoderDTS;
            that.ptsStats.reset();
        }

        if(checkGap.call(that,timestampDiff,fileInfo)){
            discontinuity = true;
            that.emit(playlistUtils.ClipEvents.gap_limit_exceeded,that,{from: lastDTS, to: firstDTS});
        }
    }
    return {
        firstDTS: firstDTS,
        discontinuity: discontinuity};
};

// PlaylistItem override
ConcatSource.prototype.onUnserialize = function () {
    var that = this;
    if(playlistConfig.humanReadablePass){
        that.durationsMan.durations = _.map(that.inner.items,function(item){
            return item.duration;
        });
        that.inner.paths = _.map(that.inner.items,function(item){
            return item.path;
        });
        delete that.inner.items;
    }

    createTimestampList.call(this);

};

ConcatSource.prototype.doValidate = function (opts) {
    var that = this;

    opts = opts || {};

    if( typeof that.inner.tracks !== 'string' || (that.inner.tracks[0] !== 'v' && that.inner.tracks[0] !== 'a' && that.inner.type !== 'concat') )  {
        that.logger.warn("tracks[0] === 'v' || tracks[0] === 'a') && type === concat");
        return false;
    }

    if( that.inner.offset === undefined ){
        that.logger.warn("that.inner.offset === undefined");
        return false;
    }

    if( that.inner.paths.length !== that.durationsMan.firstDTS.length && that.durationsMan.durations.length !== that.durationsMan.firstDTS.length  ){
        that.logger.warn("durations.length !== firstDTS.length firstDTS.length");
        return false;
    }

    if(!that.durationsMan.doValidate()){
        return false;
    }

    opts.skipPathCheck = opts.skipPathCheck || playlistUtils.playlistConfig.skipPathCheck;

    if(!opts.skipPathCheck) {
        var nonexisting = [];
        _.each(that.inner.paths, function (path, index) {
            var filePath = that.inner.basePath ? Path.join(that.inner.basePath, path) : path;
            //TODO: make it async!
            var retVal = fs.existsSync(filePath);
            if (!retVal) {
                that.logger.warn("Validation problem. Path %s does not exists!", filePath);
                nonexisting.push(index);
            }
        });

        if (nonexisting.length) {
            that.logger.warn("!fs.existsSync(path);");
            if (opts && opts.recover) {
                _.each(nonexisting, function (index) {
                    removeItem.call(that, index);
                });
                return true;
            } else {
                return false;
            }
        }
    }

    if(that.inner.durations.length > 0 && !that.getDTSRange().valid) {
        //that.logger.warn("that.inner.durations.length > 0 && !that.getDTSRange().valid");
        return false;
    }

    return PlaylistItem.prototype.doValidate.apply(that,arguments);
};

// remove media in the gap
ConcatSource.prototype.collapseGap = function (from,to) {
    var that = this;

    that.durationsMan.collapseGap(from,to);
};



ConcatSource.prototype.toJSON = function () {
    var that = this;
    if(!playlistConfig.humanReadablePass || !that.playlist.inner.clipTimes.length){
        return PlaylistItem.prototype.toJSON.call(that);
    } else {
        var firstDTS = that.inner.offset + that.playlist.inner.clipTimes[0];
        var retVal = {
            type: that.inner.type,
            tracks: that.inner.tracks,
            items: _.map(that.durationsMan.durations,function(d,index){
                var it = this.getItem(index);
                it.firstDTS = firstDTS;
                firstDTS += d;
                return it;
            },that)
        };
        that.emit(playlistUtils.ClipEvents.humanReadablePass,that,retVal);
        return retVal;
    }
};

ConcatSource.prototype.checkFileExists = function(fileName) {
    if( _.indexOf(this.inner.paths,fileName) >= 0) {
        return true;
    }
    return false;
};


Object.defineProperty(ConcatSource.prototype , "isVideo", {
    get: function get_isVideo() {
        return this.inner.tracks[0] === 'v';
    }
});

Object.defineProperty(ConcatSource.prototype , "KeyFrameDurations", {
    get: function get_keyFrameDurations() {
        var that = this;

        delete that.inner.lastKeyFrameDuration;

        var result = [];
        _.each(that.keyFrameDurations,function(kfd,index){
            // do not pass along last gop duration
            if(index === that.keyFrameDurations.length - 1){
                that.inner.lastKeyFrameDuration = kfd.last;
                kfd = kfd.slice(0,kfd.length-1);
            }
            _.each(kfd,function(d){
                    result.push(d);
            });
        });

        return result;
    },
    set: function set_keyFrameDurations(keyFrameDurations) {
        var that = this;

        playlistUtils.dbgAssert(keyFrameDurations && keyFrameDurations.length > 0);

        var idx = 0, idxDurations = 0;
        _.every(that.inner.durations, function (d, index) {
            idxDurations = index + 1;
            var idxlast = idx;

            for (;idx < keyFrameDurations.length && d > 0; idx++) {
                d -= keyFrameDurations[idx];
            }
            playlistUtils.dbgAssert(idx > idxlast);
            if (idx > idxlast) {
                that.keyFrameDurations.push(keyFrameDurations.slice(idxlast, idx));
            }
            // last gop is never passed along so make it up
            if (idx > 0 && idx === keyFrameDurations.length) {
                playlistUtils.dbgAssert(!_.isUndefined(that.inner.lastKeyFrameDuration) && that.inner.lastKeyFrameDuration === d);
                if(that.inner.lastKeyFrameDuration){
                    that.keyFrameDurations.last.push(that.inner.lastKeyFrameDuration);
                    delete that.inner.lastKeyFrameDuration;
                }
            }
            return idx > idxlast;
        });
        playlistUtils.dbgAssert( idx === keyFrameDurations.length);
        playlistUtils.dbgAssert( idxDurations === that.inner.durations.length );
    }
});



module.exports = ConcatSource;
