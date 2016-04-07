/**
 * Created by igors on 3/21/16.
 */
var fs   = require('fs'),
    util = require('util'),
    Path = require('path'),
    logger = require('../logger/logger')(module),
    config = require('./../../common/Configuration'),
     _ = require('underscore');

var sum = function(a,b){
    return a+b;
};

var Warn = logger.warn.bind(logger),
    Info = logger.info.bind(logger),
    Error = logger.error.bind(logger),
    Debug = logger.debug.bind(logger);

var unserializeClip = function unserializeClip(c){
    switch(c.type){
        case 'mixFilter':
            return unserializeObject(new MixFilterClip(),c);
        case 'source':
            return unserializeObject(new SourceClip(),c);
        default:
            throw new Error('unknown clip type ' + c.type);
    }
};
var unserializeObject = function unserializeObject(obj,from){

    for(var prop in obj ){
        if(typeof obj[prop] !== 'function') {
            if (from.hasOwnProperty(prop)) {
                var value = from[prop];
                if (value === undefined) {
                    throw new Error('unserializeObject: property value not initialized: ' + prop);
                }
                obj[prop] = value;
            } else {
                throw new Error('unserializeObject: implied property does not exist: ' + prop);
            }
        }
    }
    obj.onSerialize();
    var opts = {recover:true};
    if(!obj.validate(opts)){
        throw new Error('unserializeObject: object validation failed');
    }
    return obj;
};

function BroadcastEventEmitter(){
}

BroadcastEventEmitter.prototype.addListener = function(listener){
    this.getListener = function () {
        return listener;
    };
};

BroadcastEventEmitter.prototype.removeListener = function(){
    delete this.getListener;
};

BroadcastEventEmitter.prototype.emit = function(type,arg){
    this.getListener()(type,arg);
};

var palylistConfig = {
    debug : config.get('debug') || true,
    waitTimeBeforeRemoval : config.get('chunkWaitTimeBeforeRemove') || 100000,
    maxChunkGapSize : config.get('maxChunkGapSize') || Number.MAX_VALUE,
    useAudio : config.get('useAudio') || true,
    maxAllowedPTSDrift: config.get('maxAllowedPTSDrift') || 1000
};

// simple statistics
function Stats(ws){
    this.window = new Array(ws || 1000);
    this.reset();
}


Stats.prototype = {
    get hasEnoughSamples () {
        return this.counter > 3;
    },
    get stdDev () {
        var c = this.counter;
        return c > 1 ? Math.sqrt((this.sumSqr * c + this.sum * this.sum ) / (c * (c - 1))) : Number.NaN;
    },
    get avg () {
        return this.counter > 0 ? this.sum / this.counter : Number.NaN;
    },
    get counter(){
        if(this.end >= this.head){
            return this.end - this.head;
        } else {
            return this.end + this.window.length - this.head;
        }
    },
    get windowSize(){
        return this.window.length;
    }
};


Stats.prototype.addSample = function(s){
    var that = this;

    that.sum += s;
    that.sumSqr += s * s;
    that.end = (that.end + 1) % that.windowSize;
    if(that.end == that.head){
        var sd = that.window[that.head];
        that.sum -= sd;
        that.sumSqr -= sd * sd;
        that.head = (that.head + 1) % that.windowSize;
    }
    that.window[that.end] = s;
    return that;
};

Stats.prototype.reset = function () {
    this.sum = 0;
    this.sumSqr = 0;
    for (var i = 0; i < this.window.length; i++){
        this.window[i] = 0;
    }
    this.head = this.end = 0;
    return this;
};

/*
 *   Playlist implementation:
 * */

function ConcatSourceState(){
    this.ptsStats = new Stats();
    this.dtsJitter = 0;
    this.totalDuration = 0;
}

ConcatSourceState.prototype.ConcatEvents = {
    gap_limit_exceeded:'gap-limit-exceeded'
};

//ConcatSource
function ConcatSource(track,chunkPath) {
    var that = this;

    BroadcastEventEmitter.prototype.constructor.call(that);

    var sourceState = new ConcatSourceState(this);

    Object.defineProperty(this, 'state', {
        enumerable: false,
        get: function () {
            return sourceState;
        }
    });

    that.type = "concat";
    that.tracks = track || 'v';
    that.paths = [];
    that.durations = [];
    that.firstDTS = [];
    that.firstEncoderDTS = [];
    that.offset = 0;
    that.expires = [];
    that.basePath = chunkPath ? chunkPath.substr(0, chunkPath.lastIndexOf('/') + 1) : '';
    that.sig = [];
    that.scheduledForRemoval = [];
    that.refPTS = -1;
    that.refEncoderDTS = -1;
}

util.inherits(ConcatSource,BroadcastEventEmitter);

var findInRemoved = function(item){
    return this == item.path;
};

ConcatSource.prototype.setDurationAt = function(index,val){
    var that = this;
    that.state.totalDuration -= that.durations[index];
    that.durations[index] = val;
    that.state.totalDuration += that.durations[index];
};

ConcatSource.prototype.getDurationAt = function(index){
    var that = this;

    return that.durations[index];
};

ConcatSource.prototype.scheduleClipRemoval = function(path,expires) {
    var that = this;

    if (false === that.scheduledForRemoval.some(findInRemoved,path)) {
        expires = expires || 0;
        if(expires) {
            that.scheduledForRemoval.push({
                path: path,
                expires: expires
            });
        } else {
            // don't wait
            that.scheduledForRemoval.unshift({
                path: path,
                expires:expires
            });
        }
    }
};

ConcatSource.prototype.getItem = function(index) {
    var that = this;
    if(index >=  that.durations.length) {
        return {};
    }
    return {
        firstDTS: that.firstDTS[index],
        firstEncoderDTS: that.firstEncoderDTS[index],
        duration: that.durations[index],
        path: that.paths[index],
        sig: that.sig[index],
        expires: that.expires[index]
    };
};

ConcatSource.prototype.popClip = function() {
    var that = this;
    that.removeItem(0);
};

ConcatSource.prototype.removeItem = function(index) {
    var that = this;

    logger.info('MixFilterClip.removeItem. ', util.inspect(that.getItem(index)));

    that.scheduleClipRemoval(that.paths[index], Date.now() + palylistConfig.waitTimeBeforeRemoval);
    if(that.durations[index] > 0) {
        that.state.totalDuration -= that.durations[index];
    }
    if(index === 0) {
        that.expires.shift();
        that.durations.shift();
        that.paths.shift();
        that.firstDTS.shift();
        that.firstEncoderDTS.shift();
        that.sig.shift();
    } else {
        that.expires.splice(index,1);
        that.durations.splice(index,1);
        that.paths.splice(index,1);
        that.firstDTS.splice(index,1);
        that.firstEncoderDTS.splice(index,1);
        that.sig.splice(index,1);
    }
};

ConcatSource.prototype.checkExpires = function (expires,maxChunkCount) {
    var that = this;
    if (expires) {
        while (that.expires.length > 0) {
            if (that.expires[0] === undefined || that.expires[0] === null)
                break;
            if (that.expires[0] + that.durations[0] < expires) {
                logger.debug('MixFilterClip.checkExpires. found clip %s clip_expire=%d. expires=%d', that.paths[0], that.expires, expires);
                that.popClip();
            } else {
                break;
            }
        }
    }
    if (maxChunkCount) {
        while (that.expires.length > maxChunkCount) {
            logger.debug('MixFilterClip.checkExpires. found clip %s clip_count=%d. > maxChunkCount=%d', that.paths[0], that.expires.length, maxChunkCount);
            that.popClip();
        }
    }

    var paths = [];
    while( that.scheduledForRemoval.length && that.scheduledForRemoval[0].expires <= expires) {
        paths.push(that.scheduledForRemoval[0].path);
        that.scheduledForRemoval.shift();
    }
    return paths;
};

ConcatSource.prototype.updateOffset = function (firstClipTime) {
    var that = this;

    if (that.firstDTS.length) {
        that.offset = that.firstDTS[0] - firstClipTime;
    }
};

var checkSignature = function(sig){
    return this.sig === sig;
};



ConcatSource.prototype.concatClip = function (fileInfo,track,expires) {
    var that = this;

    var filePath = fileInfo.path;
    if (that.basePath) {
        var offset = fileInfo.path.indexOf(that.basePath);
        if (offset < 0) {
            logger.warn('clip=%s does not match basePath=%s', fileInfo.path, that.basePath);
        } else {
            filePath = fileInfo.path.substr(offset + that.basePath.length);
        }
    }

    if(that.sig.some(checkSignature,fileInfo)){
        logger.warn('ConcatSource.concatClip(%d,%s). signature already exists in the file list', fileInfo.flavor,fileInfo.path);
        that.scheduleClipRemoval(filePath);
        return;
    }

    firstDTS = that.checkDiscontinuity(fileInfo,track);

    that.sig.push(fileInfo.sig);
    var duration = Math.max(0,Math.ceil(track.duration));
    that.durations.push(0);
    that.setDurationAt(that.durations.length - 1,duration);
    that.firstDTS.push(Math.ceil(track.firstDTS) || 0);
    that.firstEncoderDTS.push(Math.ceil(track.firstEncoderDTS) || 0);

    logger.info('ConcatSource.concatClip(%d,%s): append clip=%s dts=%d enc_dts=%d dur=%d sig=%s',
        fileInfo.flavor,that.tracks,filePath, track.firstDTS.toFixed(0),track.firstEncoderDTS.toFixed(0),duration,fileInfo.sig);


    if(that.expires) {
        that.expires.push(expires);
    }

    that.paths.push(filePath);

    if(palylistConfig.debug && !that.validate()){
        throw new Error('debug validate failed');
    }
};

module.exports.addWithOverflow = addWithOverflow = function(a,b,c) {
    if(c === undefined){
        return (a +b) % b;
    }
    return (a + b + c) %c;
}

ConcatSource.prototype.checkDiscontinuity = function (fileInfo,track) {
    var that = this;

    var len = that.durations.length - 1;

    if (len < 0) {
        if (fileInfo.startTime === 0) {
            return Date.now() - (track.firstDTS + track.duration);
        }
        that.refPTS = track.firstDTS;
        that.refEncoderDTS = track.firstEncoderDTS;
        return track.firstDTS;
    }

    var firstDTS, lastDTS = that.firstDTS[len] + that.durations[len];

    // this file does not have absolute time information, skip all measuring
    if (fileInfo.startTime === 0) {
        firstDTS = lastDTS;
    } else {

        firstDTS = track.firstDTS;

        // calculate pts corresponding to last file end
        var lastEncoderDTS = addWithOverflow(that.firstEncoderDTS[len] + that.durations[len],track.wrapEncoderDTS);

        var timestampDiff = firstDTS - lastDTS,
            encDiff = track.firstEncoderDTS-lastEncoderDTS;

        // check for pts wrap
        if(encDiff <= -track.wrapEncoderDTS / 2 && timestampDiff >= track.wrapEncoderDTS / 2) {
            encDiff += track.wrapEncoderDTS;
        }
        // calculate immediate value of drift
        var drift = timestampDiff - encDiff;

        // see if this (abs_time,pts) tuple can be used as reference
        if (Math.abs(drift) < palylistConfig.maxAllowedPTSDrift) {
            // dts discontinuity
            that.state.ptsStats.addSample(drift);

            if (that.state.ptsStats.hasEnoughSamples) {
                var stddev = that.state.ptsStats.stdDev;
                if (stddev <= 5 || 5 * stddev < drift) {
                    that.refPTS = firstDTS;
                    that.refEncoderDTS = track.firstEncoderDTS;
                    that.state.ptsStats.reset();
                }
            }
        } else {

            logger.warn('ConcatSource.checkDiscontinuity(%d,%s): previous clip (%s,%d) -> new clip (%s,%d) drift is too high=%d msec. dts diff=%d enc_diff=%d',
                fileInfo.flavor,
                that.tracks,
                that.paths[len],
                lastDTS.toFixed(2),
                fileInfo.path.substr(that.basePath.length),
                firstDTS.toFixed(2),
                drift.toFixed(2),
                (track.firstDTS - lastDTS).toFixed(2),
                encDiff.toFixed(2));

            that.refPTS = firstDTS;
            that.refEncoderDTS = lastEncoderDTS = track.firstEncoderDTS;
            that.state.ptsStats.reset();
        }

        // reassign firstDTS in accordance with pts diff to avoid jitter
        if (that.refPTS > 0) {
            firstDTS = that.refPTS + addWithOverflow(track.firstEncoderDTS - that.refEncoderDTS, track.wrapEncoderDTS);
        }

        var overlap = Math.ceil(firstDTS - lastDTS), delatEnc = Math.ceil(track.firstEncoderDTS - lastEncoderDTS);
        if (overlap != 0) {
            var log = Math.abs(overlap) > 1000 ? Warn : Info;

            that.state.dtsJitter += overlap;
            log('ConcatSource.checkDiscontinuity(%d,%s): previous clip (%s) -> new clip (%s) overlap=%d msec. enc delta=%d. avg=%d stddev=%d prev clip duration=%d acc drift: %d',
                fileInfo.flavor,
                that.tracks,
                that.paths[len],
                fileInfo.path.substr(that.basePath.length),
                overlap,
                delatEnc,
                that.state.ptsStats.avg.toFixed(2),
                that.state.ptsStats.stdDev.toFixed(2),
                that.durations[len],
                that.state.dtsJitter);
            if( overlap > 0){
                that.setDurationAt(len, that.getDurationAt(len) + overlap);
            } else {
                for (var i = len; i > 0 && overlap < 0; i--) {
                    var prevD = that.getDurationAt(i);
                    that.setDurationAt(i, that.getDurationAt(i) + overlap);
                    overlap = prevD;
                }
            }
            overlap = 0;
        }

        if (overlap > palylistConfig.maxChunkGapSize) {
            logger.warn('ConcatSource.checkDiscontinuity(%d,%s): gap: prev clip (%s) -> new clip (%s) gap=%d > maxChunkGapSize=%d',
                fileInfo.flavor,
                that.tracks,
                that.paths[len],
                fileInfo.path.substr(that.basePath.length),
                overlap,
                palylistConfig.maxChunkGapSize);

            that.emit(ConcatSourceState.prototype.ConcatEvents.gap_limit_exceeded,
                {from: lastDTS, to: firstDTS});
        }
    }

    return firstDTS;
};

ConcatSource.prototype.onSerialize = function () {
    var that = this;
    that.state.totalDuration = that.durations.reduce(sum, 0);
};

ConcatSource.prototype.validate = function (opts) {
    var that = this;

    if( typeof that.tracks !== 'string' || (that.tracks[0] !== 'v' && that.tracks[0] !== 'a' && that.type !== 'concat') )  {
        logger.warn("ConcatSource.validate tracks[0] === 'v' || tracks[0] === 'a') && type === concat");
        return false;
    }

    if( that.offset === undefined ){
        logger.warn("that.offset === undefined");
        return false;
    }

    if( that.paths.length !== that.firstDTS.length && that.durations.length !== that.firstDTS.length && that.firstDTS.length !== that.expires.length ){
        logger.warn("ConcatSource.validate durations.length !== firstDTS.length firstDTS.length && !== expires.length");
        return false;
    }

    var nonexisting =[];
    _.each(that.paths, function(path,index){
        var filePath = that.basePath ? Path.join(that.basePath,path) : path;
        //TODO: make it async!
        var retVal = fs.existsSync(filePath);
        if(!retVal){
            logger.warn("ConcatSource.validate path %s does not exists!",filePath);
            nonexisting.push(index);
        }
    });

    if( nonexisting.length) {
        logger.warn("!fs.existsSync(path);");
        if(opts && opts.recover) {
            _.each(nonexisting,function (index) {
                that.removeItem(index);
            });
            return true;
        } else {
            return false;
        }
    }
    if( !_.every(that.durations, function(d){
            return d >= 0;
        }) ) {
        logger.warn("ConcatSource.validate  duration > 0 failed");
        return false;
    }

    var td = that.state.totalDuration,
        calcD = _.reduce(that.durations,sum,0);
    if( calcD  !== td ){
        logger.warn("ConcatSource.validate  that.durations.reduce( sum,0)  !== that.state.totalDuration");
        if(opts && opts.recover) {
            that.state.totalDuration = calcD;
            return true;
        } else {
            return false;
        }
    }

    return true;
};

ConcatSource.prototype.collapseGap = function (from,to) {
    var that = this;

    _.each(that.firstDTS,function(firstDTS,index){
        var lastDTS =  firstDTS  + that.getDurationAt(index);
        if(firstDTS < to && lastDTS > from){
            var section = Math.min(lastDTS,to) - Math.max(firstDTS,from);
            that.firstDTS[index] += section;
            that.setDurationAt(index, that.getDurationAt(index) - section);
        }
    });
};

//MixFilterClip
function MixFilterClip() {

    BroadcastEventEmitter.prototype.constructor.call(this);
    if(!util.isArray(this.sources)) {
        this.type = "mixFilter";
        this.sources = [];
    }
}

MixFilterClip.prototype = {
    get clipCount () {
        return this.sources ? this.sources[0].durations.length : 0;
    }
};

util.inherits(MixFilterClip,BroadcastEventEmitter);

MixFilterClip.prototype.validate = function validate(opts) {
    var that = this;

    if(that.basePath && !fs.existsSync(that.basePath)){
        logger.warn("that.basePath && !fs.existsSync(that.basePath)" + that.basePath);
        return false;
    }

    if(that.type !== "mixFilter") {
        logger.warn('type !== "mixFilter"');
        return false;
    }

    if( that.sources.length === 0 || that.sources.length > 2 ) {
        logger.warn('sources.length === 0 || sources.length > 2');
        return false;
    }

    return that.sources.every(function(s){
        return s.validate(opts);
    });
};


MixFilterClip.prototype.validateInput = function(fileInfo){
    if(!fileInfo){
        logger.warn('MixFilterClip.validateInput bad fileInfo');
        return false;
    }

    if(!fileInfo.flavor){
        logger.warn('MixFilterClip.validateInput bad fileInfo.flavor');
        return false;
    }

    if(!fileInfo.sig || typeof fileInfo.sig !== 'string'){
        logger.warn('MixFilterClip.validateInput bad fileInfo.sig');
        return false;
    }

    if(!fileInfo.video &&  !fileInfo.audio){
        logger.warn('MixFilterClip.validateInput !fileInfo.video &&  !fileInfo.audio');
        return false;
    }

    if(fileInfo.video) {
        if (typeof fileInfo.video.firstDTS !== 'number') {
            logger.warn("MixFilterClip.validateInput typeof fileInfo.video.firstDTS !== 'number'");
            return false;
        }

        if (typeof fileInfo.video.firstEncoderDTS !== 'number') {
            logger.warn("'MixFilterClip.validateInput typeof fileInfo.video.firstEncoderDTS !== 'number'");
            return false;
        }

        if (typeof fileInfo.video.duration !== 'number') {
            logger.warn("MixFilterClip.validateInput typeof fileInfo.video.duration !== 'number'");
            return false;
        }
        if (fileInfo.video.duration <= 0) {
            logger.warn('MixFilterClip.validateInput fileInfo.video.duration  <= 0');
            return false;
        }
    }

    if(fileInfo.audio) {
        if (typeof fileInfo.audio.firstDTS !== 'number') {
            logger.warn("MixFilterClip.validateInput typeof fileInfo.audio.firstDTS !== 'number'");
            return false;
        }

        if (typeof fileInfo.audio.firstEncoderDTS !== 'number') {
            logger.warn("'MixFilterClip.validateInput typeof fileInfo.audio.firstEncoderDTS !== 'number'");
            return false;
        }

        if (typeof fileInfo.audio.duration !== 'number') {
            logger.warn("MixFilterClip.validateInput typeof fileInfo.audio.duration !== 'number'");
            return false;
        }
        if (fileInfo.audio.duration <= 0) {
            logger.warn('MixFilterClip.validateInput fileInfo.audio.duration  <= 0');
            return false;
        }
    }
    return true;
};

MixFilterClip.prototype.insert = function (fileInfo,expires) {
    var that = this;

    if(!that.validateInput(fileInfo)){
        throw new Error('bad input fileInfo');
    }

    if(fileInfo.video && that.sources.length < 2 && that.sources.every( function(s){
            return s.tracks[0] !== 'v';
        })){
        that.sources.push(new ConcatSource("v1",fileInfo.path));
        if(palylistConfig.useAudio && fileInfo.audio){
            that.sources.push(new ConcatSource("a1",fileInfo.path));
        }

        _.each(this.sources,function(s){
            s.addListener(that.getListener());
        });
    }


    for( var idx = 0; idx < that.sources.length; idx++ ) {
        var src = that.sources[idx];

        var track;

        switch (src.tracks[0]) {
            case 'v':
                track = fileInfo.video;
                break;
            case 'a':
                track = fileInfo.audio;
                break;
            default:
                throw new Error('unsupported trak type ' + src.tracks);
                break;
        }

        logger.debug('MixFilterClip.insert. clip=%s track=%s duration=%d. first_dts=%d enc_dts=%d expires=%s',
            fileInfo.path,src.tracks,track.duration,track.firstDTS,track.firstEncoderDTS,expires);

        if( track.duration <= 0 ) {
            logger.warn('MixFilterClip.insert: bad duration: %d clip: (%s)',track.duration,fileInfo.path);
            throw new Error('bad clip duration <= 0');
        }

        src.concatClip(fileInfo,track,expires);
    }
    return this;
};

MixFilterClip.prototype.checkExpires = function (expires,maxChunkCount){
    var that = this;

    var paths = [];

    logger.debug('MixFilterClip.checkExpires. expires=%d',expires);

    _.each(this.sources,function (s) {
        var p = s.checkExpires(expires,maxChunkCount);
        p = _.filter(p,function(file) {
            return _.every(that.sources,function (s1) {
                return s1.paths.indexOf(file) < 0;
            });
        });
        paths = paths.concat(p);
    });
    return paths;
};

MixFilterClip.prototype.getDTSRange = function(){
    var that = this;

    var minDTS = Number.MIN_VALUE, maxDTS = Number.MAX_VALUE;

    _.each(that.sources,function(s) {
        if ( s.firstDTS.length) {
            minDTS = Math.max(s.firstDTS[0],minDTS);
            maxDTS = Math.min(s.firstDTS[0] + s.state.totalDuration,maxDTS);
        }
    });

    logger.debug('MixFilterClip.getDTSRange. min=%d max=%d',minDTS,maxDTS);

    return { min: minDTS, max: maxDTS};
};

MixFilterClip.prototype.getTotalDuration = function(){
    var that = this;

    var range = that.getDTSRange();
    if(range.min ===  Number.MIN_VALUE){
        return 0;
    }
    return range.max - range.min;
};

MixFilterClip.prototype.isEmpty = function(){
    var that = this;
    return that.sources[0].durations.length === 0;
};

MixFilterClip.prototype.updateOffset = function(firstClipTime){
    var that = this;
    _.each(that.sources,function(s) {
        s.updateOffset(firstClipTime);
    });
};

MixFilterClip.prototype.onSerialize = function () {
    this.sources = this.sources.map(function(s){
        return unserializeObject(new ConcatSource(),s);
    });
};

MixFilterClip.prototype.handleClipEvent = function (type,arg) {
};

MixFilterClip.prototype.collapseGap = function (from,to) {
    _.each(this.sources,function(s){
        s.collapseGap(from,to);
    });
};

MixFilterClip.prototype.addListener = function(listener){
    BroadcastEventEmitter.prototype.addListener.call(this,listener);

    _.each(this.sources,function(s){
        s.addListener(listener);
    });
};

MixFilterClip.prototype.removeListener = function(listener){
    BroadcastEventEmitter.prototype.removeListener.call(this,listener);
};


function SourceClip() {
    if( typeof this.type === 'string' ) {
        this.type = "source";
        this.path = '';
        this.expires = 0;
    }
    return this;
}

SourceClip.prototype = {
    get clipCount () {
        return 1;
    }
};

SourceClip.prototype.insert = function (fileInfo,expires) {
    var that = this;

    that.path = fileInfo.path;
    that.expires = expires;
    that.getTotalDuration = function(){
        return fileInfo.videoDuration;
    };
    that.getDTSRange = function(){
        return { min:Math.min(fileInfo.videoFirstDTS,fileInfo.audioDTS),
            max: Math.max(fileInfo.videoFirstDTS+fileInfo.videoDuration,fileInfo.audioFirstDTS+fileInfo.audioDuration)
        };
    }
};

SourceClip.prototype.validate = function validate(){

};

SourceClip.prototype.checkExpires = function (expires) {
    var that = this;

    if(that.expires !== undefined && expires >= that.expires){
        var retVal = [that.path];
        that.path = null;
        return retVal;
    }
};

SourceClip.prototype.isEmpty = function(){
    return !this.path;
};

SourceClip.prototype.updateOffset = function(firstClipTime){
};

SourceClip.prototype.collapseGap = function (from,to) {
};
SourceClip.prototype.onSerialize = function () {
};


function Playlist() {

    BroadcastEventEmitter.constructor.call(this);

    this.durations = [0];
    this.sequences = [];
    this.playlistType = 'live';
    this.segmentBaseTime = 0;
    this.firstClipTime = 0;
    this.initialSegmentIndex = 1;
    this.initialClipIndex = 1;
    this.discontinuity= false;
    this.flavor2SeqIndex = {};
}

util.inherits(Playlist,BroadcastEventEmitter);

Playlist.prototype.getClipListForFlavor = function (flavor) {
    var that = this;

    if(flavor === undefined){
        logger.info("Playlist.getClipListForFlavor bad flavor=", flavor);
        return;
    }

    // sequenceId can be any identifier -> map to index in array of sequences
    if(that.flavor2SeqIndex[flavor] === undefined){
        logger.info("Playlist.getClipListForFlavor add new sequence for flavor", flavor);
        that.flavor2SeqIndex[flavor] = Object.keys(that.flavor2SeqIndex).length;
        that.sequences.push({clips:[]});
    }

    var sequenceIndex = that.flavor2SeqIndex[flavor];
    return that.sequences[sequenceIndex].clips;
};

Playlist.prototype.validate = function validate(opts) {
    var that = this;

    if( (typeof that.playlistType !== 'string') || ['live','vod'].indexOf(that.playlistType) < 0){
        logger.warn("Playlist.validate invalid that.playlistType", that.playlistType);
        return false;
    }

    if( (typeof that.firstClipTime !== 'number')){
        logger.warn("Playlist.validate invalid that.firstClipTime type", that.firstClipTime);
        return false;
    }

    if( (typeof that.segmentBaseTime !== 'number')){
        logger.warn("Playlist.validate invalid that.segmentBaseTime type", that.segmentBaseTime);
        return false;
    }

    if( (typeof that.initialClipIndex !== 'number')){
        logger.warn("Playlist.validate invalid that.initialClipIndex type", that.initialClipIndex);
        return false;
    }

    if( (typeof that.initialClipIndex !== 'number')){
        logger.warn("invalid that.initialClipIndex type", that.initialClipIndex);
        return false;
    }

    if( !Array.isArray(that.durations) ){
        logger.warn("Playlist.validate !that.durations || typeof that.durations !== 'Array'");
        return false;
    }

    if( !_.every(that.durations,function(d){
            return d >= 0;
        })  )  {
        logger.warn("Playlist.validate that.duration < 0");
        return false;
    }

    if( !Array.isArray(that.sequences)   ) {
        logger.warn("Playlist.validate !that.sequences || typeof that.sequences !== 'Array'");
        return false;
    }

    for( var i in that.sequences) {
        var seq = that.sequences[i];
        if( !Array.isArray(seq.clips) ) {
            logger.warn("Playlist.validate !seq.clips !seq.clips instanceof Array ");
            return false;
        }
        if( seq.validate && !seq.validate(opts) ){
            return false;
        }
    }

    if( !_.every(that.sequences,function(seq){
            for( var i in seq.clips ) {
                var clip = seq.clips[i];
                var clipD = clip.getTotalDuration(),
                    overallD = that.durations[i];
                if(  clipD < overallD ){
                    return false;
                }
            }
            return true;
        } ) ) {
        logger.warn("Playlist.validate duration is greater than the sum of the durations array ");
        return false;
    }

    if(that.firstClipTime <  that.segmentBaseTime)  {
        logger.warn("Playlist.validate that.firstClipTime <  that.segmentBaseTime");
        return false;
    }

    return true;
};

Playlist.prototype.recalculateOffsetsAndDuration = function recalculateOffsetsAndDuration (index){
    var that = this;

    var minDTS = Number.MIN_VALUE,
        maxDTS = Number.MAX_VALUE;

    // determine dts range
    _.each(that.sequences,function(seq){
        if(seq.clips.length > index) {
            var dtsRange = seq.clips[index].getDTSRange();
            minDTS = Math.max(dtsRange.min, minDTS);
            maxDTS = Math.min(maxDTS, dtsRange.max);
        }
    });
    if(minDTS > Number.MIN_VALUE) {

        that.firstClipTime = Math.max(that.firstClipTime,Math.ceil(minDTS));
        that.durations[index] =  Math.ceil(maxDTS-that.firstClipTime);

        var date = new Date(that.firstClipTime);
        logger.info("Playlist.recalculateOffsetsAndDuration set firstClipTime=",date);

        _.each(that.sequences,function(seq) {
            seq.clips.forEach(function(c) {
                c.updateOffset(that.firstClipTime);
            });
        });
        return {min:minDTS,max:maxDTS};
    }
};

Playlist.prototype.onSerialize = function () {
    var that = this;

    _.each(that.sequences,function (seq) {
        seq.clips = seq.clips.map( function(c) {
            return unserializeClip(c);
        });
    });
};

Playlist.prototype.addListener = function(listener){
    var that = this;

    BroadcastEventEmitter.prototype.addListener.call(this,listener);
    _.each(that.sequences,function (seq) {
        _.each(seq.clips,function(c){
            c.addListener(listener);
        });
    });
};

Playlist.prototype.removeListener = function(listener){
    BroadcastEventEmitter.prototype.removeListener.call(this,listener);
    _.each(that.sequences,function (seq) {
        _.each(seq.clips,function(c){
            c.removeListener(listener);
        });
    });
};

Playlist.prototype.serializeFrom = function (stream,cbDone){
    var that = this;

    var playlistJSON = '';
    stream.on('data', function (chunk) {
        playlistJSON += chunk;
    });
    stream.on('end', function () {
        stream.close();
        var pl = that;
        try {
            var playlist = JSON.parse(playlistJSON);
            unserializeObject(that,playlist);
        } catch (err) {
            logger.warn('unable to unserialize playlist. data loss is inevitable!');
            pl = new Playlist();
        }
        cbDone(pl);
    });
    stream.resume();
};

Playlist.prototype.getDiagnostics = function (opts) {
    var that = this,
        clipDuration = (opts && opts.clipDuration) ? opts.clipDuration : 10000;

    that.recalculateOffsetsAndDuration();

    var totalDuration = that.durations.reduce(sum,0),
        minClip = Math.floor((that.firstClipTime - that.segmentBaseTime) / clipDuration);

    var diag =  {
        unitMs: clipDuration,
        discontinuityMode:  that.discontinuity,
        now:Math.floor((Date.now() - that.segmentBaseTime) / clipDuration),
        window: {
            low: minClip,
            high: Math.floor(totalDuration / clipDuration) + minClip,
        },
        windowDurationMs: totalDuration
    };

    if(opts && opts.displayPlaylist) {
        diag.playlist = that;
    }
    if(totalDuration && that.minMax) {
        var overallDuration = Math.max(0,that.minMax.max - that.minMax.min);
        if(overallDuration > totalDuration){
            diag.gapsMsec = overallDuration - totalDuration;
        }
    }
    return diag;
};

Playlist.prototype.collapseGap = function(from,to) {
    var that = this;
    if(from < to) {
        _.each(that.sequences,function (seq) {
            _.each(seq.clips,function (c) {
                c.collapseGap(from, to);
            });
        });
        //TODO: when packager is ready remove following line
        //that.firstClipTime += to - from;
        logger.warn('Playlist.collapseGap. that.firstClipTime=%s',new Date(that.firstClipTime));
    }
};

module.exports.MixFilterClip = MixFilterClip;
module.exports.SourceClip = SourceClip;
module.exports.Playlist = Playlist;
module.exports.ClipEvents = ConcatSourceState.prototype.ConcatEvents;
module.exports.Stats = Stats;

