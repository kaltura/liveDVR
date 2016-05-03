/*
 *   vod packager playlist implementation.
 *   for details see https://github.com/kaltura/nginx-vod-module
 * */

var    _ = require('underscore');
var util = require('util');
var playlistUtils = require('./playlistGenrator-utils');
var PlaylistItem = require('./PlaylistItem');
var Path = require('path');
var fs = require('fs');

var playlistConfig = playlistUtils.playlistConfig;

var deepCloneObject = function(source) {
    var dest = {};
    var values = _.map(source, _.clone);
    var i = 0;
    _.each(Object.keys(source),function(key){
        var cur = this[key] = values[i++];
        if(_.isObject(cur) && !_.isArray(cur)) {
            this[key] = cloneObject(cur);
        }
    },dest);
    return dest;
};

/*
    ConcatSource class.
    single source using multiple chunks of same media type (video|audio).
    aggregated by MixFilterClip class.
 */
function ConcatSource(logger,track,chunkPath) {

    this.ptsStats = new playlistUtils.Stats();
    this.dtsJitter = 0;
    this.totalDuration = 0;

    PlaylistItem.prototype.constructor.call(this,logger,chunkPath ? undefined : track);

    if(! Object.keys(this.inner).length) {

        this.inner = deepCloneObject(ConcatSource.prototype.dataScheme);

        this.inner.type = "concat";
        this.inner.tracks = track || 'v';
        this.inner.basePath = chunkPath ? chunkPath.substr(0, chunkPath.lastIndexOf('/') + 1) : '';
        this.inner.scheduledForRemoval = [];
        this.inner.refPTS = -1;
        this.inner.refEncoderDTS = -1;
        this.inner.offset = 0;
    }
}

util.inherits(ConcatSource,PlaylistItem);

var findInRemoved = function(item){
    return this == item.path;
};

var setDurationAt = function(index,val){
    var that = this;
    val = Math.ceil(val);
    that.totalDuration -= that.inner.durations[index];
    that.inner.durations[index] = val;
    that.totalDuration += val;
};

var getDurationAt = function(index){
    var that = this;

    return that.inner.durations[index];
};


ConcatSource.prototype.dataScheme = {
    expires:[],
    durations:[],
    paths: [],
    firstDTS: [],
    firstEncoderDTS:[],
    keyFrameDTS:[],
    sig:[]
};
// return playable range for this track
ConcatSource.prototype.getDTSRange = function() {
    var that = this;

    if ( that.inner.firstDTS.length) {
        return [that.inner.firstDTS[0], that.inner.firstDTS[0] + that.totalDuration];
    } else {
        return [Number.MIN_VALUE,Number.MAX_VALUE];
    }
};

// schedule obsolete chunk for removal after it has been moved out of window
var scheduleClipRemoval = function(path,expires) {
    var that = this;

    if (!_.any(that.inner.scheduledForRemoval,findInRemoved,path)) {
        expires = expires || 0;
        if(expires) {
            that.inner.scheduledForRemoval.push({
                path: path,
                expires: expires
            });
        } else {
            // don't wait
           that.inner.scheduledForRemoval.unshift({
                path: path,
                expires:expires
            });
        }
    }
};

ConcatSource.prototype.getItem = function(index) {
    var that = this;
    if(index >=  that.inner.durations.length) {
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

var removeItem = function(index) {
    var that = this;

    that.logger.info('ConcatSource.removeItem(%s). ', that.inner.tracks,util.inspect(that.getItem(index)));

    scheduleClipRemoval.call(that,that.inner.paths[index], Date.now() + playlistConfig.waitTimeBeforeRemoval);
    if(that.inner.durations[index] > 0) {
        that.totalDuration -= that.inner.durations[index];
    }
    if(index === 0) {
        _.each(Object.keys(ConcatSource.prototype.dataScheme),function(key){
            this[key].shift();
        }, that.inner);
    } else {
        _.each(Object.keys(ConcatSource.prototype.dataScheme),function(key){
            this[key].splice(index,1);
        }, that.inner);
    }
};

// check live window low boundary
ConcatSource.prototype.checkExpires = function (expires,maxChunkCount) {
    var that = this;
    if (expires) {
        while (that.inner.expires.length > 0) {
            if (that.inner.expires[0] === undefined || that.inner.expires[0] === null)
                break;
            if (that.inner.expires[0] + that.inner.durations[0] < expires) {
                that.logger.info('ConcatSource.checkExpires(%s).  found clip %s clip_expire=%d. expires=%d', that.inner.tracks,that.inner.paths[0], that.inner.expires, expires);
                popClip.call(that);
            } else {
                break;
            }
        }
    }
    if (maxChunkCount) {
        while (that.inner.durations.length > maxChunkCount) {
            that.logger.info('ConcatSource.checkExpires(%s). found clip %s clip_count=%d. > maxChunkCount=%d', that.inner.tracks,
                that.inner.paths[0], that.inner.durations.length, maxChunkCount);
            popClip.call(that);
        }
    }

    var paths = [];
    while( that.inner.scheduledForRemoval.length && that.inner.scheduledForRemoval[0].expires <= expires) {
        paths.push(Path.join( that.inner.basePath,that.inner.scheduledForRemoval.shift().path));
    }
    return paths;
};

// recalculate offset used by packager to indicate where live window starts
ConcatSource.prototype.updateOffset = function (firstClipTime) {
    var that = this;

    if (that.inner.firstDTS.length) {
        that.inner.offset = that.inner.firstDTS[0] - firstClipTime;
    }
};

// add chunk of media
ConcatSource.prototype.concatClip = function (fileInfo,track,expires) {
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

    var existingIdx = _.indexOf(that.inner.sig,fileInfo.sig);
    if( existingIdx >= 0 ){
        that.logger.warn('ConcatSource.concatClip(%d,%s). signature already exists in the file list', fileInfo.flavor,fileInfo.path);
        if(Path.join(that.inner.basePath,that.inner.paths[existingIdx]) !== fileInfo.path) {
            that.logger.warn('ConcatSource.concatClip(%d,%s). remove duplicate item', fileInfo.flavor,fileInfo.path);
            scheduleClipRemoval.call(that, filePath);
        }
        return;
    }

    var tuple = that.checkDiscontinuity(fileInfo,track),
        idx = tuple[0],
        firstDTS = tuple[1];

    var duration = Math.max(0, Math.ceil(track.duration));

    if(idx < that.inner.durations.length){
        that.inner.sig.splice(idx,0,fileInfo.sig);
        that.inner.durations.splice(idx,0,0);
        that.inner.firstDTS.splice(idx,0,Math.ceil(firstDTS) || 0);
        that.inner.firstEncoderDTS.splice(idx,0,Math.ceil(track.firstEncoderDTS) || 0);
        that.inner.expires.splice(idx,0,expires);
        that.inner.paths.splice(idx,0,filePath);
        that.inner.keyFrameDTS.splice(idx,0,track.keyFrameDTS);

        that.emit(playlistUtils.ClipEvents.chunk_reorder,{from: firstDTS, to: firstDTS+duration});
    } else {
        that.inner.sig.push(fileInfo.sig);
        that.inner.durations.push(0);
        that.inner.firstDTS.push(Math.ceil(firstDTS) || 0);
        that.inner.firstEncoderDTS.push(Math.ceil(track.firstEncoderDTS) || 0);
        that.inner.expires.push(expires);
        that.inner.paths.push(filePath);
        that.inner.keyFrameDTS.push(track.keyFrameDTS);
    }
    setDurationAt.call(that, idx, duration);

    that.logger.info('ConcatSource.concatClip(%d,%s): append clip=%s dts=%d enc_dts=%d dur=%d sig=%s',
        fileInfo.flavor,that.inner.tracks,filePath, firstDTS.toFixed(0),track.firstEncoderDTS.toFixed(0),duration,fileInfo.sig);

    if(playlistConfig.debug && !that.validate(playlistUtils.playlistConfig)){
        throw new Error('debug validate failed');
    }
};

// check for gaps, reorder etc.
ConcatSource.prototype.checkDiscontinuity = function (fileInfo,track) {
    var that = this;

    var len = that.inner.durations.length - 1,firstDTS;

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
            firstDTS = that.inner.firstDTS[len] + that.inner.durations[len];
        } else {

            firstDTS = track.firstDTS;

            //check for reorder!
            while (len >= 0 && that.inner.firstDTS[len] > firstDTS) {
                len--;
            }

            var lastDTS = that.inner.firstDTS[len] + that.inner.durations[len];

            // calculate pts corresponding to last file end
            var lastEncoderDTS = addWithOverflow(that.inner.firstEncoderDTS[len] + that.inner.durations[len], track.wrapEncoderDTS);

            var timestampDiff = firstDTS - lastDTS,
                encDiff = addWithOverflow(track.firstEncoderDTS - lastEncoderDTS,track.wrapEncoderDTS);

            //this is not a wrap, check for timestamp reset
            if(encDiff >= track.wrapEncoderDTS/2 ){
                encDiff = track.firstEncoderDTS - lastEncoderDTS;
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

                var overlap = Math.ceil(firstDTS - lastDTS), delatEnc = Math.ceil(track.firstEncoderDTS - lastEncoderDTS);
                if (overlap < playlistConfig.maxChunkGapSize) {
                    var log = Math.abs(overlap) > 1000 ? that.logger.warn : that.logger.info;

                    that.dtsJitter += overlap;
                    log.call(that.logger, 'ConcatSource.checkDiscontinuity(%d,%s): previous clip (%s) -> new clip (%s) overlap=%d msec. enc delta=%d. avg=%d stddev=%d prev clip duration=%d acc drift: %d',
                        fileInfo.flavor,
                        that.inner.tracks,
                        that.inner.paths[len],
                        fileInfo.path.substr(that.inner.basePath.length),
                        overlap,
                        delatEnc,
                        that.ptsStats.avg.toFixed(2),
                        that.ptsStats.stdDev.toFixed(2),
                        that.inner.durations[len],
                        that.dtsJitter);
                    setDurationAt.call(that, len, that.inner.durations[len] + overlap);
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
                that.inner.refEncoderDTS = lastEncoderDTS = track.firstEncoderDTS;
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
        that.inner.durations = _.map(that.inner.items,function(item){
            return item.duration;
        });
        that.inner.paths = _.map(that.inner.items,function(item){
            return item.path;
        });
        that.inner.firstDTS = _.map(that.inner.items,function(item){
            return item.firstDTS;
        });
        that.inner.firstEncoderDTS = _.map(that.inner.items,function(item){
            return item.firstEncoderDTS;
        });
        that.inner.expires = _.map(that.inner.items,function(item){
            return item.expires;
        });
        that.inner.sig = _.map(that.inner.items,function(item){
            return item.sig;
        });
        delete that.inner.items;
    }
    that.totalDuration = playlistUtils.sum(that.inner.durations);
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

    if( that.inner.paths.length !== that.inner.firstDTS.length && that.inner.durations.length !== that.inner.firstDTS.length && that.inner.firstDTS.length !== that.inner.expires.length ){
        that.logger.warn("ConcatSource.validate durations.length !== firstDTS.length firstDTS.length && !== expires.length");
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
    if( !_.every(that.inner.durations, function(d){
            return d >= 0;
        }) ) {
        that.logger.warn("ConcatSource.validate  duration > 0 failed");
        return false;
    }

    var td = that.totalDuration,
        calcD = playlistUtils.sum(that.inner.durations);
    if( Math.abs(calcD - td) > playlistUtils.playlistConfig.timestampToleranceMs ){
        that.logger.warn("ConcatSource.validate  that.inner.durations.reduce( sum,0)  !== that.totalDuration");
        if(opts && opts.recover) {
            that.totalDuration = calcD;
            return true;
        } else {
            return false;
        }
    }

    return true;
};

// remove media in the gap
ConcatSource.prototype.collapseGap = function (from,to) {
    var that = this;

    _.each(that.inner.firstDTS,function(firstDTS,index){
        var lastDTS =  firstDTS  + getDurationAt.call(that,index);
        if(firstDTS < to && lastDTS > from){
            var section = Math.min(lastDTS,to) - Math.max(firstDTS,from);
            that.inner.firstDTS[index] += section;
            setDurationAt.call(that,index, getDurationAt.call(that,index) - section);
        }
    });
};

ConcatSource.prototype.toJSON = function () {
    var that = this;
   if(!playlistConfig.humanReadablePass){
       return PlaylistItem.prototype.toJSON.call(that);
   } else {
       return {
            type: that.inner.type,
            tracks: that.inner.tracks,
            items: _.map(that.inner.durations,function(d,index){
                return this.getItem(index)
            },that)
       };
   }
};

module.exports = ConcatSource;
