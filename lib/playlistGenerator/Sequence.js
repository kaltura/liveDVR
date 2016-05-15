/**
 * Created by igors on 5/10/16.
 *
 *   vod packager playlist implementation.
 *   for details see https://github.com/kaltura/nginx-vod-module
 */

var    _ = require('underscore');
var util = require('util');
var playlistUtils = require('./playlistGen-utils');
var PlaylistItem = require('./PlaylistItem');
var MixFilterClip = require('./MixFilterClip');
var SourceClip = require('./SourceClip');
var BroadcastEventEmitter = require('./BroadcastEventEmitter');
var assert = require('assert');

var playlistConfig = playlistUtils.playlistConfig;

var unserializeClip = function (c){
    var that = this;
    switch(c.type){
        case 'mixFilter':
            return new MixFilterClip(that.logger,c);
        case 'source':
            return new SourceClip(that.logger,c);
        default:
            throw new Error('unknown clip type ' + c.type);
    }
};

/*
 Sequence class.
 vod-packager implementation of flavor
 */
var Sequence = function (logger,playlistObj,inner) {
    var that = this;

    that.logger = logger;
    that.playlist = playlistObj;
    that.keyFrameDurationsAux = [];

    PlaylistItem.prototype.constructor.call(that,logger,inner);

    if(!_.isObject(inner) || !Object.keys(inner).length) {
        that.inner = {
            clips:[],
            // key frame information
            // this should be held by clip Source however it is is managed here
            // for faster access by vod-packager
            keyFrameDurations:[], // list of key frame distances
            firstKeyFrameOffset:Infinity //relative to firstClipTime
        };
    }

    that.clips = that.inner.clips;
}

util.inherits(Sequence,PlaylistItem);

Sequence.prototype.onUnserialize = function(){
    var that = this;

    that.inner.clips = _.map(that.inner.clips,function(c) {
        return unserializeClip.call(that,c);
    },that);

    if(that.inner.firstKeyFrameOffset != Infinity) {
        var keyFrameDTS = that.inner.firstKeyFrameOffset + that.playlist.inner.firstClipTime;
        that.keyFrameDurationsAux.push(keyFrameDTS);
        _.each(that.inner.keyFrameDurations, function(kfd){
            keyFrameDTS += kfd;
            that.keyFrameDurationsAux.push(keyFrameDTS);
            keyFrameDTS += kfd;
        });
    }
};

Sequence.prototype.validate = function(){
    var that = this;

    if(_.any(that.inner.clips,function(c) {
            return c.validate() != true;
        })){
        that.logger.warn('Sequence.validate. one of clip validation failed');
        return false;
    }

    if(that.inner.keyFrameDurations.length > 0) {
        if (that.inner.firstKeyFrameOffset == Infinity) {
            that.logger.warn('Sequence.validate. that.inner.firstKeyFrameOffset == Infinity && that.inner.keyFrameDurations.length > 0');
            return false;
        }
        if(_.any(that.inner.keyFrameDurations,function(kfd){
            return kfd <= 0;
        })){
            that.logger.warn('Sequence.validate. keyFrameDurations are bad');
            return false;
        }

        if(that.inner.keyFrameDurations.length != that.keyFrameDurationsAux.length - 1) {
            that.logger.warn('Sequence.validate. that.inner.keyFrameDurations.length != that.keyFrameDurationsAux.length');
            return false;
        }

        if(_.any(that.keyFrameDurationsAux,function(dts,index){
                if(index > 0) {
                    var d = that.keyFrameDurationsAux[index] - that.keyFrameDurationsAux[index - 1],
                        d1 = that.inner.keyFrameDurations[index - 1];
                    if (d != d1) {
                        that.logger.warn('Sequence.validate. (that.inner.keyFrameDurations[%d] = %d) != (that.keyFrameDurationsAux[%d] - that.keyFrameDurationsAux[%d] = %d)',
                            index - 1,d1,index,index - 1,d);
                        return true;
                    }
                }
                return false;
            })) {
            return false;
        }
    }

    return true;
};

// *splice*es array of items
var spliceArray = function(arrObj,startingIndex,itemsArr) {
    _.each(itemsArr,function(it){
        arrObj.splice(startingIndex++,0,it);
    });
}

var mergeKeyFrames = function(src,keyFrames){
    var that = this;

    that.logger.warn("mergeKeyFrames. keyFrames=%d keyFrameDurationsAux=%d keyFrameDurations=%d",keyFrames.length,
        that.keyFrameDurationsAux.length , that.inner.keyFrameDurations.length);

    assert(that.inner.keyFrameDurations.length === 0 || that.keyFrameDurationsAux.length === that.inner.keyFrameDurations.length + 1);

    // convert keyframe DTS times to array of frame durations
    var minKeyFrameDistance = playlistConfig.minKeyFrameDistance || 2000,
        nexFrameDTS = keyFrames[0];

    // filter out key frames
    keyFrames = _.filter(keyFrames,function(keyFrameDTS){
        if(nexFrameDTS > keyFrameDTS) {
            return false;
        }
        nexFrameDTS += minKeyFrameDistance;
        return true;
    });

    var insertIndex = 0;
    if(that.keyFrameDurationsAux.length ){
        insertIndex = _.sortedIndex(that.keyFrameDurationsAux, keyFrames[0]);
    }

    spliceArray(that.keyFrameDurationsAux,insertIndex,keyFrames);

    keyFrames = _.map(keyFrames,function(kf,index){
            //adjacent frames
            if(index > 0 ){
                return kf - keyFrames[index - 1];
            } else if(insertIndex > 0) {
                // derive duration of first frame in this array from previous frame
                return kf - that.keyFrameDurationsAux[insertIndex-1];
            } else {
                // the very first frame, it's duration is aligned on DTS of the key frame
                return 0;
            }
        });
    if(that.inner.keyFrameDurations.length == 0){
        keyFrames.shift();
    }

    spliceArray(that.inner.keyFrameDurations,insertIndex,keyFrames);

    that.inner.firstKeyFrameOffset = that.keyFrameDurationsAux[0] - that.playlist.inner.firstClipTime;

    if( playlistConfig.debug && !that.validate() ){
        throw new Error('failed to validate Sequence object -> bug');
    }
};

/*
 *   remove range of key frames
 *   range is based on time interval being removed either due to clip removal or gap collapse
 * */
var removeKeyFrames = function(from,to){
    var that = this;

    that.logger.warn("removeKeyFrames. %j-%j keyFrameDurationsAux=%d keyFrameDurations=%d",from,to,that.keyFrameDurationsAux.length , that.inner.keyFrameDurations.length);

    if(that.inner.keyFrameDurations.length) {

        assert(that.keyFrameDurationsAux.length == that.inner.keyFrameDurations.length + 1);

        //find indices for the input range
        var startIndex = _.sortedIndex(that.keyFrameDurationsAux,from),
            lastIndex = _.sortedIndex(that.keyFrameDurationsAux,to);

        var timeRange = to - from;

        from -= that.keyFrameDurationsAux[startIndex];
        to -= that.keyFrameDurationsAux[lastIndex];

        // calculate resulting frame distance
        var leftOver = from + to;

        // join fractured frames leftovers
        if(leftOver > 0) {
            that.inner.keyFrameDurations[startIndex] = leftOver;
            startIndex++;
        }

        if(lastIndex > startIndex) {

            that.keyFrameDurationsAux.splice(startIndex, lastIndex - startIndex);
            that.inner.keyFrameDurations.splice(startIndex, lastIndex - startIndex);

            // shift ensuing frames backwards to compensate for gap
            lastIndex -= lastIndex - startIndex;

            if (lastIndex > 0) {
                var a = _.rest(that.keyFrameDurationsAux, lastIndex);
                _.each(a, function (val, index) {
                    a[index] -= timeRange;
                });
            }
        }

        assert(that.keyFrameDurationsAux.length == that.inner.keyFrameDurations.length + 1);

        if( playlistConfig.debug && !that.validate() ){
            throw new Error('failed to validate Sequence object -> bug');
        }
   }
};

Sequence.prototype.handleEvent = function (type,arg) {
    var that = this;

    switch(type){
        case playlistUtils.ClipEvents.key_frames_add:
            mergeKeyFrames.call(that,arg,arguments[2]);
            break;
        case playlistUtils.ClipEvents.clip_removed:
            var src = arg,
                idx = arguments[2],
                from = src.inner.firstDTS[idx],
                to = from + src.inner.durations[idx];
            removeKeyFrames.call(that,from,to);
            break;
        default:
            //forward
            that.emit.apply(arguments);
            break;
    }
};


Sequence.prototype.addListener = function(listener){
    var that = this;

    BroadcastEventEmitter.prototype.addListener.call(this,listener);

    _.each(this.inner.clips,function(c){
        c.addListener(that);
    });
};

Sequence.prototype.removeListener = function(listener){
    var that = this;

    BroadcastEventEmitter.prototype.removeListener.call(this,listener);

    _.each(this.inner.clips,function(c){
        c.removeListener(that);
    });
};

Sequence.prototype.collapseGap = function (from,to) {
    var that = this;

    _.each(that.inner.clips,function (c) {
        c.collapseGap(from, to);
    });

    removeKeyFrames.call(that,from,to);
};

Sequence.prototype.updateOffset = function(firstClipTime){
    var that = this;

    _.each(that.inner.clips,function(c) {
        c.updateOffset(firstClipTime);
    });

    if(that.keyFrameDurationsAux.length) {
        that.inner.firstKeyFrameOffset = that.keyFrameDurationsAux[0] - firstClipTime;
    }
};

module.exports = Sequence;
