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
function ConcatSource(loggerInfo, playlistObj, clipTime, track, chunkPath) {

    var tracks = chunkPath ? track : track.tracks;
    this.logger = loggerModule.getLogger("ConcatSource", loggerInfo + '[' + tracks + '] ');
    this.ptsStats = new playlistUtils.Stats();
    this.dtsJitter = 0;
    this.clipTime = clipTime;

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
    source.clipTime.addListener(playlistUtils.ClipEvents.value_changed,this);
}

util.inherits(SourceTimestampList,TimestampList);

SourceTimestampList.prototype.getClipTime = function(){
    return this.source.clipTime;
};

SourceTimestampList.prototype.validate = function(){
    var that = this;

    if(!TimestampList.prototype.validate.call(that)) {
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
        tracks:     that.inner.tracks
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

    that.logger.info('Remove Item(%j) %j', index, util.inspect(that.getItem(index)));

    if(!surpressEvent) {
        that.emit(playlistUtils.ClipEvents.clip_removed, that, index);
    }

    that.durationsMan.remove(index);

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
          totalDuration > that.playlist.playListLimits.manifestTimeWindowInMsec) {
            paths.push(that.inner.paths[0]);
            that.logger.info('checkExpires. Found clip path=%j dts=%j dur=%j', that.inner.paths[0],
                that.durationsMan.firstDTS[0],
                that.durationsMan.durations[0]);
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

    if(_.indexOf(that.inner.paths,filePath) > 0){
        that.logger.warn('Concat Clip - Duplicate clip %s', filePath);
        return;
    }

    var tuple = that.checkDiscontinuity(fileInfo,track),
        idx = tuple[0],
        firstDTS = tuple[1],
        discontinuity =  tuple[2];

    var duration = Math.max(0, Math.ceil(track.duration));

    if(idx < that.durationsMan.durations.length){
        that.inner.paths.splice(idx,0,filePath);
    } else {
        that.inner.lastEncoderDTS = Math.ceil(addWithOverflow(track.firstEncoderDTS + duration, track.wrapEncoderDTS));
        that.inner.paths.push(filePath);
    }

    firstDTS = Math.ceil(firstDTS || 0);
    that.durationsMan.insertAt(idx,firstDTS,duration,discontinuity);

    if( track.keyFrameDTS && track.keyFrameDTS.length) {
        var keyFrameDTS = _.filter(track.keyFrameDTS,function(dts){
            return dts < duration;
        });
        that.emit(playlistUtils.ClipEvents.key_frames_add, that, _.map(keyFrameDTS, function (dts) {
            return dts + this
        }, firstDTS));
    }

    that.logger.info('Concat Clip: Append clip = [%s]; Dts = [%d]; Enc_dts = [%d]; Duration = [%d]; Sig = [%s]',
        filePath, firstDTS,track.firstEncoderDTS.toFixed(0),duration,fileInfo.sig);

    if(playlistConfig.debug && !that.validate(playlistUtils.playlistConfig)){
        throw new Error('Debug validate failed');
    }
};

// r (range) designates gap between adjucent source clips
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

        that.logger.info('Split: Append clip = [%s]; Dts = [%d]; Duration = [%d]',
            item.paths, item.firstDTS, item.durations);

    });

    _.each( splitItems,function(duration){
        removeItem.call(that,firstThatIndex,true);
        that.inner.lastEncoderDTS -= duration;
    });

    newSrc.inner.offset = newSrc.durationsMan.firstDTS[0] - newSrc.clipTime;

    if (playlistConfig.debug && !that.validate(playlistUtils.playlistConfig)) {
        throw new Error('Debug validate failed');
    }

    if (playlistConfig.debug && !newSrc.validate(playlistUtils.playlistConfig)) {
        throw new Error('Debug validate failed');
    }

};

// check for gaps, reorder etc.
ConcatSource.prototype.checkDiscontinuity = function (fileInfo,track) {
    var that = this;

    var len = that.durationsMan.durations.length - 1,firstDTS;

    track.firstDTS =  Math.ceil(track.firstDTS);

    var discontinuity = false;

    if (len < 0) {
        // issue: no hint of when this file was created. give it a wild guess
        if (fileInfo.startTime === 0) {
            that.logger.warn('CheckDiscontinuity: Clip %s zero fileInfo.startTime.', track.path);
            throw new Error('ConcatSource error. zero fileInfo.startTime');
        } else {
            that.inner.refPTS = track.firstDTS;
            that.inner.refEncoderDTS = track.firstEncoderDTS;
            firstDTS = track.firstDTS;
        }
    } else {

        // this file does not have absolute time information, skip all measuring
        if (fileInfo.startTime === 0) {
            firstDTS = that.durationsMan.firstDTS[len] + that.durationsMan.durations[len];
        } else {

            firstDTS = track.firstDTS;

            var startIndex = _.sortedIndex(that.durationsMan.firstDTS,firstDTS) - 1,
                endIndex = _.sortedIndex(that.durationsMan.firstDTS,firstDTS+track.duration) - 1;

            if( endIndex < 0 ){
                that.logger.warn("CheckDiscontinuity clip %j out of boundaries",fileInfo.chunkName);
                throw new Error("Concat source: clip out of boundaries");
            }

            if( endIndex > 0 && startIndex != endIndex ){
                that.logger.warn("CheckDiscontinuity clip %j clip overlapping is not supported",fileInfo.chunkName);
                throw new Error("Concat source: clip out of boundaries");
            }

            len = startIndex;

            var lastDTS = that.durationsMan.firstDTS[len] + that.durationsMan.durations[len];

            var timestampDiff = Math.ceil(firstDTS - lastDTS),
                encDiff = addWithOverflow(track.firstEncoderDTS - that.inner.lastEncoderDTS,track.wrapEncoderDTS);

            //this is not a wrap, check for timestamp reset
            if(encDiff >= track.wrapEncoderDTS/2 ){
                encDiff = track.firstEncoderDTS - that.inner.lastEncoderDTS;
            }

            // diff b/w encoder timestamps can be due to either gap or encoder restart (timestamp reset)
            var encTimeVariance = Math.min(Math.abs(encDiff),Math.abs(timestampDiff-encDiff));

            // check for dts discontinuity
            if (encTimeVariance < playlistConfig.maxAllowedPTSDrift) {

                // calculate immediate value of drift
                var drift = encTimeVariance < Math.abs(timestampDiff) ? encTimeVariance : timestampDiff;

                that.ptsStats.addSample(drift);

                // reassign firstDTS in accordance with pts diff to avoid jitter
                if (that.inner.refPTS > 0) {
                    firstDTS = that.inner.refPTS + playlistUtils.addWithOverflow(track.firstEncoderDTS - that.inner.refEncoderDTS,
                            track.wrapEncoderDTS);
                }

                var deltaEnc = Math.ceil(track.firstEncoderDTS - that.inner.lastEncoderDTS);
                if (timestampDiff < playlistConfig.maxChunkGapSize && len >= 0 &&
                    that.durationsMan.durations[len] > timestampDiff + 1000 )  {
                    var log = Math.abs(timestampDiff) > 1000 ? that.logger.warn : that.logger.info;

                    that.dtsJitter += timestampDiff;
                    log.call(that.logger, 'CheckDiscontinuity: Slight time diff. Previous clip [%s] -> new clip [%s, %s] Overlap = [%d msec] Enc delta = [%d]; Avg = [%d] Stddev = [%d] Prev clip duration = [%d]; Acc drift = [%d]',
                        that.inner.paths[len],
                        fileInfo.path.substr(that.inner.basePath.length),
                        fileInfo.chunkName,
                        timestampDiff,
                        deltaEnc,
                        that.ptsStats.avg.toFixed(2),
                        that.ptsStats.stdDev.toFixed(2),
                        that.durationsMan.durations[len],
                        that.dtsJitter);
                }

            } else {
                that.logger.warn('CheckDiscontinuity: Encoder reset. Previous clip (%s,%d) -> New clip (%s,%d). Dts diff = [%d], Enc_diff = [%d]',
                    that.inner.paths[len],
                    lastDTS.toFixed(2),
                    fileInfo.path.substr(that.inner.basePath.length),
                    firstDTS,
                    (track.firstDTS - lastDTS).toFixed(2),
                    encDiff.toFixed(2));

                that.inner.refPTS = firstDTS;
                that.inner.refEncoderDTS = track.firstEncoderDTS;
                that.ptsStats.reset();
            }
            if( timestampDiff > playlistConfig.maxChunkGapSize ) {
                discontinuity = true;
                that.logger.warn('CheckDiscontinuity: Gap. Prev clip [%s] -> New clip [%s]. Gap = %d > maxChunkGapSize = %d',
                    that.inner.paths[len],
                    fileInfo.path.substr(that.inner.basePath.length),
                    timestampDiff,
                    playlistConfig.maxChunkGapSize);

                if(!playlistUtils.playlistConfig.ignoreGaps) {
                    that.emit(playlistUtils.ClipEvents.gap_limit_exceeded,that,{from: lastDTS, to: firstDTS});
                }
            }
        }
    }

    return [len+1,firstDTS,discontinuity];
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

ConcatSource.prototype.validate = function (opts) {
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

    if(!that.durationsMan.validate()){
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

    return PlaylistItem.prototype.validate.apply(that,arguments);
};

// remove media in the gap
ConcatSource.prototype.collapseGap = function (from,to) {
    var that = this;

    that.durationsMan.collapseGap(from,to);
};



ConcatSource.prototype.toJSON = function () {
    var that = this;
    if(!playlistConfig.humanReadablePass){
        return PlaylistItem.prototype.toJSON.call(that);
    } else {
        var firstDTS = that.inner.offset + that.playlist.inner.firstClipTime;
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
    return _.indexOf(this.inner.paths,fileName);
};

module.exports = ConcatSource;
