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

//ConcatSource
function ConcatSource(logger,track,chunkPath) {
    var that = this;

    that.ptsStats = new playlistUtils.Stats();
    that.dtsJitter = 0;
    that.totalDuration = 0;

    PlaylistItem.prototype.constructor.call(that,logger,chunkPath ? undefined : track);

    if(! Object.keys(that.inner).length) {
        that.inner.type = "concat";
        that.inner.tracks = track || 'v';
        that.inner.paths = [];
        that.inner.durations = [];
        that.inner.firstDTS = [];
        that.inner.firstEncoderDTS = [];
        that.inner.offset = 0;
        that.inner.expires = [];
        that.inner.basePath = chunkPath ? chunkPath.substr(0, chunkPath.lastIndexOf('/') + 1) : '';
        that.inner.sig = [];
        that.inner.scheduledForRemoval = [];
        that.inner.refPTS = -1;
        that.inner.refEncoderDTS = -1;
    }
}

util.inherits(ConcatSource,PlaylistItem);

var findInRemoved = function(item){
    return this == item.path;
};

var setDurationAt = function(index,val){
    var that = this;
    that.totalDuration -= that.inner.durations[index];
    that.inner.durations[index] = val;
    that.totalDuration += that.inner.durations[index];
};

var getDurationAt = function(index){
    var that = this;

    return that.inner.durations[index];
};

ConcatSource.prototype.getDTSRange = function() {
    var that = this;

    if ( that.inner.firstDTS.length) {
        return [that.inner.firstDTS[0], that.inner.firstDTS[0] + that.totalDuration];
    } else {
        return [Number.MIN_VALUE,Number.MAX_VALUE];
    }
};

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
    return {
        firstDTS: that.inner.firstDTS[index],
        firstEncoderDTS: that.inner.firstEncoderDTS[index],
        duration: that.inner.durations[index],
        path: that.inner.paths[index],
        sig: that.inner.sig[index],
        expires: that.inner.expires[index]
    };
};

var popClip = function() {
    var that = this;
    removeItem.call(that,0);
};

var removeItem = function(index) {
    var that = this;

    that.logger.info('MixFilterClip.removeItem. ', util.inspect(that.getItem(index)));

    scheduleClipRemoval.call(that,that.inner.paths[index], Date.now() + playlistConfig.waitTimeBeforeRemoval);
    if(that.inner.durations[index] > 0) {
        that.totalDuration -= that.inner.durations[index];
    }
    if(index === 0) {
        that.inner.expires.shift();
        that.inner.durations.shift();
        that.inner.paths.shift();
        that.inner.firstDTS.shift();
        that.inner.firstEncoderDTS.shift();
        that.inner.sig.shift();
    } else {
        that.inner.expires.splice(index,1);
        that.inner.durations.splice(index,1);
        that.inner.paths.splice(index,1);
        that.inner.firstDTS.splice(index,1);
        that.inner.firstEncoderDTS.splice(index,1);
        that.inner.sig.splice(index,1);
    }
};

ConcatSource.prototype.checkExpires = function (expires,maxChunkCount) {
    var that = this;
    if (expires) {
        while (that.inner.expires.length > 0) {
            if (that.inner.expires[0] === undefined || that.inner.expires[0] === null)
                break;
            if (that.inner.expires[0] + that.inner.durations[0] < expires) {
                that.logger.debug('MixFilterClip.checkExpires. found clip %s clip_expire=%d. expires=%d', that.inner.paths[0], that.inner.expires, expires);
                popClip.call(that);
            } else {
                break;
            }
        }
    }
    if (maxChunkCount) {
        while (that.inner.expires.length > maxChunkCount) {
            that.logger.debug('MixFilterClip.checkExpires. found clip %s clip_count=%d. > maxChunkCount=%d', that.inner.paths[0], that.inner.expires.length, maxChunkCount);
            popClip.call(that);
        }
    }

    var paths = [];
    while( that.inner.scheduledForRemoval.length && that.inner.scheduledForRemoval[0].expires <= expires) {
        paths.push(Path.join( that.inner.basePath,that.inner.scheduledForRemoval.shift().path));
    }
    return paths;
};

ConcatSource.prototype.updateOffset = function (firstClipTime) {
    var that = this;

    if (that.inner.firstDTS.length) {
        that.inner.offset = that.inner.firstDTS[0] - firstClipTime;
    }
};


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

    firstDTS = that.checkDiscontinuity(fileInfo,track);

    that.inner.sig.push(fileInfo.sig);
    var duration = Math.max(0,Math.ceil(track.duration));
    that.inner.durations.push(0);
    setDurationAt.call(that,that.inner.durations.length - 1,duration);
    that.inner.firstDTS.push(Math.ceil(firstDTS) || 0);
    that.inner.firstEncoderDTS.push(Math.ceil(track.firstEncoderDTS) || 0);

    that.logger.info('ConcatSource.concatClip(%d,%s): append clip=%s dts=%d enc_dts=%d dur=%d sig=%s',
        fileInfo.flavor,that.inner.tracks,filePath, firstDTS.toFixed(0),track.firstEncoderDTS.toFixed(0),duration,fileInfo.sig);


    if(that.inner.expires) {
        that.inner.expires.push(expires);
    }

    that.inner.paths.push(filePath);

    if(playlistConfig.debug && !that.validate(playlistUtils.playlistConfig)){
        throw new Error('debug validate failed');
    }
};


ConcatSource.prototype.checkDiscontinuity = function (fileInfo,track) {
    var that = this;

    var len = that.inner.durations.length - 1;

    if (len < 0) {
        if (fileInfo.startTime === 0) {
            return Date.now() - (track.firstDTS + track.duration);
        }
        that.inner.refPTS = track.firstDTS;
        that.inner.refEncoderDTS = track.firstEncoderDTS;
        return track.firstDTS;
    }

    var firstDTS, lastDTS = that.inner.firstDTS[len] + that.inner.durations[len];

    // this file does not have absolute time information, skip all measuring
    if (fileInfo.startTime === 0) {
        firstDTS = lastDTS;
    } else {

        firstDTS = track.firstDTS;

        // calculate pts corresponding to last file end
        var lastEncoderDTS = addWithOverflow(that.inner.firstEncoderDTS[len] + that.inner.durations[len],track.wrapEncoderDTS);

        var timestampDiff = firstDTS - lastDTS,
            encDiff = track.firstEncoderDTS-lastEncoderDTS;

        // check for pts wrap
        if(encDiff <= -track.wrapEncoderDTS / 2 && timestampDiff >= track.wrapEncoderDTS / 2) {
            encDiff += track.wrapEncoderDTS;
        }
        // calculate immediate value of drift
        var drift = timestampDiff - encDiff;

        // see if this (abs_time,pts) tuple can be used as reference
        if (Math.abs(drift) < playlistConfig.maxAllowedPTSDrift) {
            // dts discontinuity
            that.ptsStats.addSample(drift);

            if (that.ptsStats.hasEnoughSamples) {
                var stddev = that.ptsStats.stdDev;
                if (stddev <= 5 || 5 * stddev < drift) {
                    that.inner.refPTS = firstDTS;
                    that.inner.refEncoderDTS = track.firstEncoderDTS;
                    that.ptsStats.reset();
                }
            }
        } else {

            that.logger.warn('ConcatSource.checkDiscontinuity(%d,%s): previous clip (%s,%d) -> new clip (%s,%d) drift is too high=%d msec. dts diff=%d enc_diff=%d',
                fileInfo.flavor,
                that.inner.tracks,
                that.inner.paths[len],
                lastDTS.toFixed(2),
                fileInfo.path.substr(that.inner.basePath.length),
                firstDTS.toFixed(2),
                drift.toFixed(2),
                (track.firstDTS - lastDTS).toFixed(2),
                encDiff.toFixed(2));

            that.inner.refPTS = firstDTS;
            that.inner.refEncoderDTS = lastEncoderDTS = track.firstEncoderDTS;
            that.ptsStats.reset();
        }

        // reassign firstDTS in accordance with pts diff to avoid jitter
        if (that.inner.refPTS > 0) {
            firstDTS = that.inner.refPTS + playlistUtils.addWithOverflow(track.firstEncoderDTS - that.inner.refEncoderDTS, track.wrapEncoderDTS);
        }

        var overlap = Math.ceil(firstDTS - lastDTS), delatEnc = Math.ceil(track.firstEncoderDTS - lastEncoderDTS);
        if (overlap != 0) {
            var log = Math.abs(overlap) > 1000 ? that.logger.warn : that.logger.info;

            that.dtsJitter += overlap;
            log.call(that.logger,'ConcatSource.checkDiscontinuity(%d,%s): previous clip (%s) -> new clip (%s) overlap=%d msec. enc delta=%d. avg=%d stddev=%d prev clip duration=%d acc drift: %d',
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
            if( overlap > 0){
                setDurationAt.call(that,len, getDurationAt.call(that,len) + overlap);
            } else {
                for (var i = len; i > 0 && overlap < 0; i--) {
                    var prevD = getDurationAt.call(that,i);
                    setDurationAt.call(that,i, getDurationAt.call(that,i) + overlap);
                    overlap = prevD;
                }
            }
            overlap = 0;
        }

        if (overlap > playlistConfig.maxChunkGapSize) {
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
    }

    return firstDTS;
};

ConcatSource.prototype.onSerialize = function () {
    var that = this;
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
    if( calcD  !== td ){
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

module.exports = ConcatSource;
