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
var TimestampList = require('./TimestampList');
var ObsoleteClipManager = require('./ObsoleteClipManager');
var ConcatSource = require('./ConcatSource');
var loggerModule = require('../../common/logger');

var playlistConfig = playlistUtils.playlistConfig;

var createNewClip = function(index,c){
    var that = this;
    var clipTimeObj = c ? that.playlist.inner.clipTimes[index] : undefined;
    var type = c ? c.type : 'mixFilter';
    switch(type){
        case 'mixFilter':
            return new MixFilterClip(that.loggerInfo, index, that.playlist, that,  clipTimeObj, c);
        case 'source':
            return new SourceClip(that.logger, that.playlist, clipTimeObj, c);
        default:
            throw new Error('unknown clip type ' + c.type);
    }
};

var unserializeClip = function (index,c){
   return createNewClip.call(this,index,c);
};

/*
 Sequence class.
 vod-packager implementation of flavor
 */
var Sequence = function (loggerInfo, playlistObj, inner, flavorId) {
    var that = this;

    flavorId = inner ? inner.id : flavorId;
    that.loggerInfo = loggerInfo.appendQuote(flavorId,'f');
    that.logger = loggerModule.getLogger("Sequence", that.loggerInfo);

    PlaylistItem.prototype.constructor.call(that,that.logger,playlistObj,inner);

    if(!_.isObject(inner) || !Object.keys(inner).length) {
        that.inner = {
            clips:[],
            // key frame information
            // this should be held by clip Source however it is is managed here
            // for faster access by vod-packager
            keyFrameDurations:[], // list of key frame distances
            firstKeyFrameOffset:Infinity, //relative to firstClipTime,
            scheduledForRemoval: new ObsoleteClipManager(that.loggerInfo,playlistObj),
            id:flavorId
        };

        createTimestampList.call(that);
    }

    that.clips = that.inner.clips;
};

var createTimestampList = function(){
    var that = this;

    that.inner.keyFrameDurations = that.inner.keyFrameDurations || [];
    if(!that.inner.firstKeyFrameOffset){
        that.inner.firstKeyFrameOffset = 0;
    }

    that.keyFramesMan = new TimestampList(that.logger,
        that.playlist,
        that.inner,
        'firstKeyFrameOffset',
        that.inner.keyFrameDurations,
        TimestampList.prototype.editPolicy.cutaway);

    that.playlist.addListener(playlistUtils.ClipEvents.base_time_changed,that.keyFramesMan);
};

util.inherits(Sequence,PlaylistItem);

Sequence.prototype.appendNewClip = function(){
    var that = this;

    var newClip = createNewClip.call(that,that.inner.clips.length);
    that.inner.clips.push(newClip);

    return newClip;
};

Sequence.prototype.onUnserialize = function(){
    var that = this;

    that.inner.clips = _.map(that.inner.clips,function(c,index) {
        return unserializeClip.call(that,index,c);
    },that);

    createTimestampList.call(that);

    that.inner.scheduledForRemoval = new ObsoleteClipManager(that.loggerInfo,that.playlist,that.inner.scheduledForRemoval);
};

Sequence.prototype.validate = function(){
    var that = this;

    if(_.any(that.inner.clips,function(c) {
            return c.validate() != true;
        })){
        that.logger.warn('One of the clip validations failed');
        return false;
    }

    if(that.inner.keyFrameDurations.length > 0) {
        if (that.inner.firstKeyFrameOffset == Infinity) {
            that.logger.warn('that.inner.firstKeyFrameOffset == Infinity && that.inner.keyFrameDurations.length > 0');
            return false;
        }

        if(!that.keyFramesMan.validate()){
            return false;
        }
    }

    if(!that.inner.scheduledForRemoval.validate()){
        return false;
    }

     return true;
};

var keyFrameSearchOffsetMs = playlistConfig.keyFrameSearchOffsetMs || 2;

Sequence.prototype.getKeyFrameTimestamp = function(kf){
    return kf + keyFrameSearchOffsetMs;
};

var mergeKeyFrames = function(src,keyFrames){
    var that = this;

    that.logger.debug("Merge key frames: KeyFrames = [%d]; FirstDTS = [%d]; KeyFrameDurations = [%d]", keyFrames.length,
        that.keyFramesMan.firstDTS.length, that.inner.keyFrameDurations.length);
    
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

    // offset key frames to point slightly in the future in order to miss them while looking forward
    keyFrames = _.map(keyFrames,function(kf){
        return Math.floor(kf - keyFrameSearchOffsetMs);
    });

    that.keyFramesMan.insertRange(keyFrames);

    if( playlistConfig.debug && !that.validate() ){
        throw new Error('Failed to validate Sequence object');
    }
};

var mapKeyFramesToConcatSource = function(realObj,obj) {
    var that = this;

    if( obj.type === 'concat') {
        if (obj.tracks[0] === 'v') {
            var kfIndex = 0;
            _.each(obj.items, function (it) {
                it.keyFrames = [];
                while (kfIndex < that.keyFramesMan.firstDTS.length) {
                    var lastKeyDTSOffset = Sequence.prototype.getKeyFrameTimestamp(that.keyFramesMan.firstDTS[kfIndex]) - it.firstDTS;
                    if (lastKeyDTSOffset < it.durations) {
                        kfIndex++;
                        if(lastKeyDTSOffset >= 0 ) {
                            it.keyFrames.push(lastKeyDTSOffset);
                        }
                    } else {
                        break;
                    }
                }
            });
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
                idx = arguments[2];
            if( src instanceof ConcatSource && src.inner.tracks[0] === 'v' ) {
                 var from = src.durationsMan.firstDTS[idx],
                      to = from + src.durationsMan.durations[idx];
                 that.keyFramesMan.removeRange(from - keyFrameSearchOffsetMs, to - keyFrameSearchOffsetMs);
            }
            break;
        case playlistUtils.ClipEvents.humanReadablePass:
            var realObj = arg,
                obj = arguments[2];
            mapKeyFramesToConcatSource.call(that,realObj,obj);
            break;
        case playlistUtils.ClipEvents.item_disposed:
            that.removeListener(arguments[1]);
            //fallthrough
        default:
            //forward
            that.emit.apply(that,arguments);
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

    var actual = that.keyFramesMan.collapseGap(from,to);

    _.each(that.inner.clips,function (c) {
        c.collapseGap(this.from, this.to);
    },actual);


};

var checkClipExpired =  function(clip) {
    var args = this;

    // nothing to do
    if(args[2] <= 0){
        return;
    }

    var that =  args[0];

    var trashBin = that.inner.scheduledForRemoval;
    var clipDuration = clip.availableDuration;
    var expired = clip.checkExpires.apply(clip,Array.prototype.slice.call(args,1));

    if (expired.length) {
        args[2] -= clipDuration - clip.availableDuration;
        _.each(expired,function(p){
            trashBin.add(p);
        });
        that.emit(playlistUtils.ClipEvents.modified);
        return true;
    } else {
        return false;
    }
};


Sequence.prototype.checkExpires = function (/*clock,totalDuration*/) {
    var that = this;

    // calculate total clip duration - may differ from value passed in by playlist
    // since different sources may have different amount of media
    var totalDuration = 0;
    for( var clipIndex = 0; clipIndex < that.clips.length; clipIndex++){
        totalDuration += that.clips[clipIndex].availableDuration;
    }
    arguments[1] = totalDuration;
    Array.prototype.unshift.call(arguments,this);
    _.every( that.clips,checkClipExpired,arguments);
    Array.prototype.shift.call(arguments);

    return that.inner.scheduledForRemoval.checkExpires.apply(that.inner.scheduledForRemoval,arguments);
};

Sequence.prototype.toJSON = function(){
    var that = this;

    if(that.inner.keyFrameDurations.length === 0) {
        return _.omit(that.inner,['keyFrameDurations','firstKeyFrameOffset']);
    } else {
        return PlaylistItem.prototype.toJSON.apply(that, arguments);
    }
};



module.exports = Sequence;
