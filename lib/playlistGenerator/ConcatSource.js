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

function DtsUtils() {

}

DtsUtils.prototype.signOf = function(val){
    if(val === 0){
        return 0;
    }
    return val > 0 ? +1 : -1;
};

DtsUtils.prototype.maxEncoderDTSInMsec =  Math.ceil(Math.pow(2,33) / 90);

/*
 compares num1 to num2
 returns:
 1 if num1 > num2
 0 if num1 === num2
 -1 if num1 < num2
 */
DtsUtils.prototype.wrapCompare = function(num1,num2,tolerance){

    playlistUtils.dbgAssert(typeof num1 === 'number');
    playlistUtils.dbgAssert(typeof num2 === 'number');

    tolerance = tolerance || 0;

    var diff = addWithOverflow(num1 - num2, DtsUtils.prototype.maxEncoderDTSInMsec);

    if(diff > DtsUtils.prototype.maxEncoderDTSInMsec/2){
        return -1;
    }
    return DtsUtils.prototype.signOf(diff);
};

// Use a comparator function to figure out the smallest index at which
// an object should be inserted so as to maintain order. Uses binary search.
var sortedIndex = function(array, value, iteratee, context) {
    var low = 0, high = _.getLength(array);
    while (low < high) {
        var mid = Math.floor((low + high) / 2);
        if (iteratee.call(context,mid,value) < 0)
            low = mid + 1;
        else
            high = mid;
    }
    return low;
};


/*
 ConcatSource class.
 single source using multiple chunks of same media type (video|audio).
 aggregated by MixFilterClip class.
 */
function ConcatSource(loggerInfo, playlistObj, clipTime, track, chunkPath) {

    var tracks = chunkPath ? track : track.tracks;
    this.logger = loggerModule.getLogger("ConcatSource", loggerInfo.appendQuote(tracks));
    this.ptsStats = new playlistUtils.Stats();
    this.dtsJitter = 0;
    this.clipTime = clipTime;

    this.dtsCor = 0;
    this.dtsEncCor = 0;

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

        this.firstEncoderDTS = [];
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

    that.logger.info('Remove Item ', util.inspect(that.getItem(index)));

    if(!surpressEvent) {
        that.emit(playlistUtils.ClipEvents.clip_removed, that, index);
    }

    that.durationsMan.remove(index);
    that.firstEncoderDTS.splice(index,1);

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
        throw new BadClipError('Duplicate clip');
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

    that.firstEncoderDTS.splice(idx,0,track.firstEncoderDTS);

    if( track.keyFrameDTS && track.keyFrameDTS.length) {
        that.emit(playlistUtils.ClipEvents.key_frames_add, that, _.map(track.keyFrameDTS, function (dts) {
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

    var lastEncoderDTS = that.inner.lastEncoderDTS;
    newSrc.firstEncoderDTS = _.map(newSrc.inner.durations,function(d){
        return lastEncoderDTS += d;
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


//compareSemantics means: return -1, 0, 1
var wrapCompareStart = function(value){
    if(this === value){
        return 0;
    }
    return DtsUtils.prototype.wrapCompare(value,
        this.firstEncoderDTS,
        0);
};

var wrapCompareEnd = function(value){
    if(this === value){
        return 0;
    }
    return DtsUtils.prototype.wrapCompare(value,
        this.firstEncoderDTS + this.duration - playlistConfig.maxAllowedPTSDrift,
        0 );
};

var DTS_CMP_FLAGS = {
    monotonous: 0x0,
    gap: 0x1,
    reset: 0x2,
    overlap: 0x4
};

// retval: CMP_FLAGS
var runCompareDTS = function(cmp,track) {
    var that = this;

    //playlistUtils.dbgAssert( cmp.hiDTS - cmp.loDTS >= -playlistConfig.maxAllowedPTSDrift);

    var timestampDiff = Math.ceil(cmp.hiDTS - cmp.loDTS);

    var encDiff = Math.ceil(addWithOverflow(cmp.hiEncDTS - cmp.loEncDTS,track.wrapEncoderDTS));

    //this is not a wrap, check for timestamp reset
    if(encDiff >= track.wrapEncoderDTS/2 ){
        that.logger.warn("runCompareDTS encDiff >= track.wrapEncoderDTS/2.");
        encDiff -= track.wrapEncoderDTS;
    }



    // diff b/w encoder timestamps can be due to either gap or encoder restart (timestamp reset)
    var correlation = Math.min(Math.abs(encDiff),Math.abs(timestampDiff-encDiff));

    // check for dts discontinuity
    if (correlation < playlistConfig.maxAllowedPTSDrift * 2) {

        // calculate immediate value of drift
        var drift = timestampDiff - encDiff;

        that.ptsStats.addSample(drift);

        // reassign firstDTS in accordance with encoder dts diff to avoid jitter
        if (that.inner.refPTS > 0) {
            var encDist = playlistUtils.addWithOverflow(track.firstEncoderDTS - that.inner.refEncoderDTS,
                track.wrapEncoderDTS);
            if(encDist > track.wrapEncoderDTS/2){
                encDist -= track.wrapEncoderDTS;
            }
            cmp.resultFirstDTS = that.inner.refPTS + encDist;

            //update timestampDiff in case correlation b/w dts and encoder dts is waek...
            if(that.cmp.insertIndex < that.firstEncoderDTS.length) {
                cmp.loDTS = cmp.resultFirstDTS + track.duration;
            } else {
                cmp.hiDTS = cmp.resultFirstDTS;
            }
            timestampDiff = Math.ceil(cmp.hiDTS - cmp.loDTS);
        }
    } else {

        that.logger.warn('runCompareDTS: Encoder reset.  Dts diff = [%d], Enc_diff = [%d]',
            timestampDiff,
            encDiff);

        cmp.resultFirstDTS = track.firstDTS;

        return DTS_CMP_FLAGS.reset;
    }

    if(that.cmp.isDTSCor){
        that.dtsCor += timestampDiff;
    } else {
        that.dtsEncCor += encDiff;
    }

    if( timestampDiff > playlistConfig.maxChunkGapSize ) {

        that.logger.warn('CheckDiscontinuity: Gap.  clip [%s] ->  clip [%s]. Gap = %d > maxChunkGapSize = %d',
            cmp.loPath,
            cmp.hiPath,
            timestampDiff,
            playlistConfig.maxChunkGapSize);

        return DTS_CMP_FLAGS.gap;
    }

    return DTS_CMP_FLAGS.monotonous;
};

var compareDTS = function(track,inputPath,resultIndex,isDTSCor) {
    var that = this;

    var insertBefore = resultIndex < that.firstEncoderDTS.length;

    resultIndex = Math.min(Math.max(resultIndex, 0),that.firstEncoderDTS.length-1);

    var overlapCheck = wrapCompareStart.call(track,that.firstEncoderDTS[resultIndex] + that.durationsMan.durations[resultIndex] - playlistConfig.maxAllowedPTSDrift);

    if(insertBefore !== (overlapCheck >= 0)){
        return DTS_CMP_FLAGS.overlap;
    }

    that.cmp = that.cmp || {};

    that.cmp.insertIndex = resultIndex;
    if(insertBefore){
        that.cmp.loDTS = track.firstDTS + track.duration;
        that.cmp.hiDTS = that.durationsMan.firstDTS[resultIndex];
        that.cmp.loEncDTS = track.duration + track.firstEncoderDTS;
        that.cmp.hiEncDTS = that.firstEncoderDTS[resultIndex];
        that.cmp.loPath = inputPath;
        that.cmp.hiPath = that.inner.paths[resultIndex];
    } else {
        that.cmp.loDTS = that.durationsMan.firstDTS[resultIndex] + that.durationsMan.durations[resultIndex];
        that.cmp.hiDTS = track.firstDTS;
        that.cmp.loEncDTS = that.firstEncoderDTS[resultIndex] + that.durationsMan.durations[resultIndex];
        that.cmp.hiEncDTS = track.firstEncoderDTS;
        that.cmp.loPath = that.inner.paths[resultIndex];
        that.cmp.hiPath = inputPath;
    }

    that.cmp.isDTSCor = isDTSCor;

    return runCompareDTS.call(that, that.cmp,track);
};



// check for gaps, reorder etc.
ConcatSource.prototype.checkDiscontinuity = function (fileInfo,track) {
    var that = this;

    var resultIndex = that.durationsMan.durations.length - 1,firstDTS;

    track.firstDTS =  Math.ceil(track.firstDTS);

    var discontinuity = false;

    if (resultIndex < 0) {
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
            firstDTS = that.durationsMan.firstDTS[resultIndex] + that.durationsMan.durations[resultIndex];
        } else {

            resultIndex = _.sortedIndex(that.durationsMan.firstDTS,
                track.firstDTS + playlistConfig.maxAllowedPTSDrift);

            firstDTS = track.firstDTS;

            var retval = compareDTS.call(that,track,
                fileInfo.path.substr(that.inner.basePath.length),
                resultIndex,
                true );

            if(that.cmp) {
                firstDTS = that.cmp.resultFirstDTS;
            }

            // good correlation: 0.01% rule
            if(retval > DTS_CMP_FLAGS.monotonous){

                that.logger.warn("CheckDiscontinuity clip %j not a good correlation using dts, trying encoder dts",
                    fileInfo.chunkName,
                    resultIndex);

                var resultndex2 = _.sortedIndex(that.firstEncoderDTS,
                    track,
                    wrapCompareStart,
                    track);

                if(resultndex2 != resultIndex) {
                    var retval2 = compareDTS.call(that, track,
                        fileInfo.path.substr(that.inner.basePath.length),
                        resultndex2,
                        false);

                    // going with encoder dts correlates better that dts
                    if (retval2 < retval) {
                        retval = retval2;
                        resultIndex = resultndex2;
                        firstDTS = that.cmp.resultFirstDTS;
                    }
                }
            }

            if(retval & DTS_CMP_FLAGS.overlap){
                throw new BadClipError('chunks overlap -> not permitted');
            }
            if(retval & DTS_CMP_FLAGS.gap){
                that.emit(playlistUtils.ClipEvents.gap_limit_exceeded,that,{from: that.cmp.loDTS, to: that.cmp.hiDTS});
                discontinuity = true;
            }
            if(retval & DTS_CMP_FLAGS.reset){

                that.inner.refPTS = firstDTS;
                that.inner.refEncoderDTS = track.firstEncoderDTS;
                that.ptsStats.reset();

                that.dtsCor = that.dtsEncCor = 0;

                resultIndex = that.durationsMan.firstDTS.length;
                discontinuity = true;
                //TODO: update all firstDTS values backwards in case track.firstDTS has unexpectedly large difference
            }

            that.logger.info("CheckDiscontinuity clip %j dts cor index: %j dts enc cor idx: %s ",
                fileInfo.chunkName,
                that.dtsCor,that.dtsEncCor);
        }
    }

    return [resultIndex,firstDTS,discontinuity];
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

    var lastEncoderDTS = that.inner.lastEncoderDTS - playlistUtils.sum(that.inner.durations);
    that.firstEncoderDTS = _.map(that.inner.durations,function(d){
        return (lastEncoderDTS += d);
    });

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

    if( that.inner.paths.length !== that.firstEncoderDTS.length ){
        that.logger.warn("that.inner.paths.length !== that.firstEncoderDTS.length");
        return false;
    }

    if(_.any(that.firstEncoderDTS,function(dts,idx){
            if(idx === 0){
                return false;
            }
            return DtsUtils.prototype.wrapCompare(this.firstEncoderDTS[idx-1],dts) > 0;
        },that) ){
        that.logger.warn("that.firstEncoderDTS continuity check failed");
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

ConcatSource.prototype.validateGap = function (gap) {
    var that = this;

    var first = _.sortedIndex(that.durationsMan.firstDTS,gap.from),
        last = _.sortedIndex(that.durationsMan.firstDTS,gap.to);
    if(first >= last){
        return false;
    }
    if(first < 0 || last < 0 || first >= that.durationsMan.firstDTS.length){
        return false;
    }
    first = Math.max(first-1,0);
    return _.any(that.durationsMan.firstDTS.slice(first,last), function(dts,index){
        return this.durationsMan.firstDTS[index+1] - (this.durationsMan.firstDTS[index] + this.durationsMan.durations[index])
            >= playlistConfig.maxChunkGapSize;
    },that);
};

module.exports = ConcatSource;
