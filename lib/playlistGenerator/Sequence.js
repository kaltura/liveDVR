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
    that.loggerInfo = loggerInfo + "[f-" + flavorId + "]";
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

Sequence.prototype.createAndAppendNewClip = function(){
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

    if( that.keyFramesMan.firstDTS.length ) {

        var videoSrc = _.find(that.inner.clips[0].inner.sources,function(src){
                return src.inner.tracks[0] === 'v';
        });
        if(!videoSrc) {
            that.logger.warn('!videoSrc');
            return false;
        }

        if( videoSrc.durationsMan.firstDTS[0] !== that.keyFramesMan.firstDTS[0] + keyFrameSearchOffsetMs ){
            that.logger.warn('videoSrc.durationsMan.firstDTS[0] !== that.inner.keyFramesMan.firstDTS[0]');
            return false;
        }

      //  videoSrc.durationsMan.updateOffset();
      //  that.keyFramesMan.updateOffset();

        if( videoSrc.durationsMan.offset !== that.keyFramesMan.offset + keyFrameSearchOffsetMs ){
            that.logger.warn('videoSrc.durationsMan.offset !==  that.inner.keyFramesMan.offset');
            return false;
        }
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

Sequence.prototype.checkExpires = function (expires) {
    var that = this;

    // first calculate available duration per source
    var trackDurations = {};
    _.each(that.clips,function(c){
        _.each(c.inner.sources,function(s){
            if(!trackDurations[s.inner.tracks]) {
                trackDurations[s.inner.tracks] = 0;
            }
            trackDurations[s.inner.tracks] += s.durationsMan.totalDuration;
        });
    });

    // iterate over sources and check if there are expired items
     _.each(that.clips,function(c){
        _.each(c.inner.sources,function(s){

            var before = s.durationsMan.totalDuration;
            var expired = s.checkExpires(expires,trackDurations[s.inner.tracks]);
            var after = s.durationsMan.totalDuration;
            //update remaining duration per this track
            trackDurations[s.inner.tracks] -= before - after;
            // only remove file if no source uses it...
            expired = _.filter(expired,function(file) {
                return _.every(c.inner.sources,function (s1) {
                    return s1.inner.paths.indexOf(file) < 0;
                });
            });
            if (expired.length) {
                _.each(expired,function(p){
                   that.inner.scheduledForRemoval.add(p);
                });
                that.emit(playlistUtils.ClipEvents.modified);
            }
        });
    });

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
