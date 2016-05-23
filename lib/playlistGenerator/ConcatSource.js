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
function ConcatSource(logger,playlistObj,clipIndex,track,chunkPath) {

    this.ptsStats = new playlistUtils.Stats();
    this.dtsJitter = 0;

    PlaylistItem.prototype.constructor.call(this,logger,playlistObj,chunkPath ? undefined : track);

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

    this.clipIndex = clipIndex;

}



function SourceTimestampList (source){

   TimestampList.prototype.constructor.call(this,source.logger,
     source.playlist,
     source.inner,
     'offset',
     source.inner.durations,
        TimestampList.prototype.editPolicy.update);
}


util.inherits(SourceTimestampList,TimestampList);

Object.defineProperty(SourceTimestampList.prototype , "clipTime", {
    get: function get_srcClipTime() {
        return this.playlist.inner.clipTime[this.clipIndex];
    }
});

var createTimestampList = function(){
    this.durationsMan = new SourceTimestampList(this);
};

util.inherits(ConcatSource,PlaylistItem);

ConcatSource.prototype.dataScheme = makeScheme();

// return playable range for this track
ConcatSource.prototype.getDTSRange = function() {
    var that = this;

    return that.durationsMan.getDTSRange();
};


ConcatSource.prototype.getItem = function(index) {
    var that = this;
    if(index >=  that.durationsMan.durations.length) {
        return {};
    }

    return _.reduce(Object.keys(ConcatSource.prototype.dataScheme),function(obj,key){
        obj[key] = that.inner[key][index];
        return obj;
    },{});

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

    that.logger.info('ConcatSource.removeItem(%s). ', that.inner.tracks,util.inspect(that.getItem(index)));

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
ConcatSource.prototype.checkExpires = function () {
    var that = this;
    var paths = [];
    if (that.playlist.playListLimits.manifestTimeWindow) {
        while (that.durationsMan.totalDuration > that.playlist.playListLimits.manifestTimeWindow) {
            paths.push(that.inner.paths[0]);
            that.logger.info('ConcatSource.checkExpires(%s).  found clip %s ',
                that.inner.tracks,that.inner.paths[0]);
            popClip.call(that);
        }
    }
    else if (that.playlist.playListLimits.maxClipCountPerPlaylist) {
        while (that.durationsMan.durations.length > that.playlist.playListLimits.maxClipCountPerPlaylist) {
            paths.push(that.inner.paths[0]);
            that.logger.info('ConcatSource.checkExpires(%s). found clip %s clip_count=%d. > maxChunkCount=%d', that.inner.tracks,
                that.inner.paths[0], that.durationsMan.durations.length, maxChunkCount);
            popClip.call(that);
        }
    }
    return paths;
};

// add chunk of media
ConcatSource.prototype.concatClip = function (fileInfo,track) {
    var that = this;

    var filePath = fileInfo.path;
    if (that.inner.basePath) {
        var offset = fileInfo.path.indexOf(that.inner.basePath);
        if (offset < 0) {
            that.logger.warn('clip=%s does not match basePath=%s', fileInfo.path, that.inner.basePath);
        } else {
            filePath = fileInfo.path.substr(offset + that.inner.basePath.length);
        }
    }

    if(_.indexOf(that.inner.paths,filePath) > 0){
        that.logger.warn('ConcatSource.prototype.concatClip duplicate clip %s', filePath);
        return;
    }

    var tuple = that.checkDiscontinuity(fileInfo,track),
        idx = tuple[0],
        firstDTS = tuple[1];

    var duration = Math.max(0, Math.ceil(track.duration));

    if(idx < that.durationsMan.durations.length){
        that.inner.paths.splice(idx,0,filePath);
    } else {
        that.inner.lastEncoderDTS = Math.ceil(addWithOverflow(track.firstEncoderDTS + duration, track.wrapEncoderDTS));
        that.inner.paths.push(filePath);
    }

    that.durationsMan.insertAt(idx,Math.ceil(firstDTS) || 0,duration);

    if(track.keyFrameDTS.length) {
        that.emit(playlistUtils.ClipEvents.key_frames_add, that, _.map(track.keyFrameDTS, function (dts) {
            return dts + firstDTS
        }, firstDTS));
    }

    that.logger.info('ConcatSource.concatClip(%d,%s): append clip=%s dts=%d enc_dts=%d dur=%d sig=%s',
        fileInfo.flavor,that.inner.tracks,filePath, firstDTS.toFixed(0),track.firstEncoderDTS.toFixed(0),duration,fileInfo.sig);

    if(playlistConfig.debug && !that.validate(playlistUtils.playlistConfig)){
        throw new Error('debug validate failed');
    }
};

// r (range) designates gap between adjucent source clips
// so clip A is going to create clip B at offset r.to - r.from just beyond it's high end
ConcatSource.prototype.split = function (newSrc,r) {
    var that = this;

    if(!r || r.from <= r.to ){
        throw new Error('ConcatSource.split wrong limitTime arg');
    }

    var lastThisIndex  = _.sortedIndex(that.firstDTS, r.from),
        firstThatIndex = _.sortedIndex(that.firstDTS, r.to);

    newSrc.inner.lastEncoderDTS = that.inner.lastEncoderDTS;

    // erase clips from *noone's land*
    _.each(that.inner.durations.slice(lastThisIndex,firstThatIndex),function(duration,index){
        removeItem.call(that,index);
        that.inner.lastEncoderDTS -= duration;
    });

    _.each( that.inner.durations.slice(firstThatIndex), function(duration,index) {

            var item = that.getItem(index);

             newSrc.inner.paths.push(item.paths);

             newSrc.durationsMan.insertAt(idx, item.firstDTS);

            that.logger.info('ConcatSource.split(%d,%s): append clip=%s dts=%d dur=%d ',
                fileInfo.flavor, that.inner.tracks, filePath, firstDTS.toFixed(0), duration);

            if (playlistConfig.debug && !that.validate(playlistUtils.playlistConfig)) {
                throw new Error('debug validate failed');
            }

            removeItem.call(that,index,true);
            that.inner.lastEncoderDTS -= duration;

    });
};

// check for gaps, reorder etc.
ConcatSource.prototype.checkDiscontinuity = function (fileInfo,track) {
    var that = this;

    var len = that.durationsMan.durations.length - 1,firstDTS;

    if (len < 0) {
        // issue: no hint of when this file was created. give it a wild guess
        if (fileInfo.startTime === 0) {
            that.logger.warn('ConcatSource.checkDiscontinuity(%d,%s): clip %s zero fileInfo.startTime.',
                fileInfo.flavor,
                that.inner.tracks,
                track.path);
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

            //check for reorder!
            while (len >= 0 && that.durationsMan.firstDTS[len] > firstDTS) {
                len--;
            }

            var lastDTS = that.durationsMan.firstDTS[len] + that.durationsMan.durations[len];

            var timestampDiff = firstDTS - lastDTS,
                encDiff = addWithOverflow(track.firstEncoderDTS - that.inner.lastEncoderDTS,track.wrapEncoderDTS);

            //this is not a wrap, check for timestamp reset
            if(encDiff >= track.wrapEncoderDTS/2 ){
                encDiff = track.firstEncoderDTS - that.inner.lastEncoderDTS;
            }

            // check for dts discontinuity
            if (Math.abs(encDiff) < playlistConfig.maxAllowedPTSDrift) {

                // calculate immediate value of drift
                var drift = timestampDiff - encDiff;

                //TODO: see if there is trend which can be employed to compensate the id3 tag timestamp jitter
                that.ptsStats.addSample(drift);

                // reassign firstDTS in accordance with pts diff to avoid jitter
                if (that.inner.refPTS > 0) {
                    firstDTS = that.inner.refPTS + playlistUtils.addWithOverflow(track.firstEncoderDTS - that.inner.refEncoderDTS, track.wrapEncoderDTS);
                }

                var overlap = Math.ceil(firstDTS - lastDTS), delatEnc = Math.ceil(track.firstEncoderDTS - that.inner.lastEncoderDTS);
                if (overlap < playlistConfig.maxChunkGapSize &&
                    that.durationsMan.durations[len] > overlap + 1000 )  {
                    var log = Math.abs(overlap) > 1000 ? that.logger.warn : that.logger.info;

                    that.dtsJitter += overlap;
                    log.call(that.logger, 'ConcatSource.checkDiscontinuity(%d,%s): previous clip (%s) -> new clip (%s,%s) overlap=%d msec. enc delta=%d. avg=%d stddev=%d prev clip duration=%d acc drift: %d',
                        fileInfo.flavor,
                        that.inner.tracks,
                        that.inner.paths[len],
                        fileInfo.path.substr(that.inner.basePath.length),
                        fileInfo.chunkName,
                        overlap,
                        delatEnc,
                        that.ptsStats.avg.toFixed(2),
                        that.ptsStats.stdDev.toFixed(2),
                        that.durationsMan.durations[len],
                        that.dtsJitter);
                    that.durationsMan.setDurationAt(len, that.durationsMan.durations[len] + overlap);
                } else {
                    that.logger.warn('ConcatSource.checkDiscontinuity(%d,%s): gap: prev clip (%s) -> new clip (%s) gap=%d > maxChunkGapSize=%d',
                        fileInfo.flavor,
                        that.inner.tracks,
                        that.inner.paths[len],
                        fileInfo.path.substr(that.inner.basePath.length),
                        overlap,
                        playlistConfig.maxChunkGapSize);

                    that.emit(playlistUtils.ClipEvents.gap_limit_exceeded,
                        {from: lastDTS, to: firstDTS});
                }

             } else {
                that.logger.warn('ConcatSource.checkDiscontinuity(%d,%s): previous clip (%s,%d) -> new clip (%s,%d)  dts diff=%d enc_diff=%d',
                    fileInfo.flavor,
                    that.inner.tracks,
                    that.inner.paths[len],
                    lastDTS.toFixed(2),
                    fileInfo.path.substr(that.inner.basePath.length),
                    firstDTS.toFixed(2),
                    (track.firstDTS - lastDTS).toFixed(2),
                    encDiff.toFixed(2));

                that.inner.refPTS = firstDTS;
                that.inner.refEncoderDTS = track.firstEncoderDTS;
                that.ptsStats.reset();
            }
        }
    }

    return [len+1,firstDTS];
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
        that.logger.warn("ConcatSource.validate tracks[0] === 'v' || tracks[0] === 'a') && type === concat");
        return false;
    }

    if( that.inner.offset === undefined ){
        that.logger.warn("that.inner.offset === undefined");
        return false;
    }

    if( that.inner.paths.length !== that.durationsMan.firstDTS.length && that.durationsMan.durations.length !== that.durationsMan.firstDTS.length  ){
        that.logger.warn("ConcatSource.validate durations.length !== firstDTS.length firstDTS.length");
        return false;
    }

    if(!that.durationsMan.validate()){
        return false;
    }

    if(!opts.skipPathCheck) {
        var nonexisting = [];
        _.each(that.inner.paths, function (path, index) {
            var filePath = that.inner.basePath ? Path.join(that.inner.basePath, path) : path;
            //TODO: make it async!
            var retVal = fs.existsSync(filePath);
            if (!retVal) {
                that.logger.warn("ConcatSource.validate path %s does not exists!", filePath);
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
