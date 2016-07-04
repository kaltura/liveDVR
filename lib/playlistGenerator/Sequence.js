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
    }

    that.clips = that.inner.clips;
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

    var idx = 0;
    _.each(that.inner.clips,function(c){
        var videoSrcArr = _.filter(c.inner.sources,function(s){
            return s.isVideo;
        });
        _.each(videoSrcArr , function(videoSrc) {
            idx = videoSrc.initKeyFrameDurations(that.inner.keyFrameDurations,idx);
        });
    });
    playlistUtils.dbgAssert( idx === that.inner.keyFrameDurations.length );

    that.inner.scheduledForRemoval = new ObsoleteClipManager(that.loggerInfo,that.playlist,that.inner.scheduledForRemoval);
};

Sequence.prototype.doValidate = function(){
    var that = this;

    if(_.any(that.inner.clips,function(c) {
            return c.doValidate() != true;
        })){
        that.logger.warn('One of the clip validations failed');
        return false;
    }

    if(that.inner.keyFrameDurations.length > 0) {
        if (that.inner.firstKeyFrameOffset == Infinity) {
            that.logger.warn('that.inner.firstKeyFrameOffset == Infinity && that.inner.keyFrameDurations.length > 0');
            return false;
        }
        //TODO: add source kf validation
    }

    if(!that.inner.scheduledForRemoval.doValidate()){
        return false;
    }

     return true;
};

playlistConfig.keyFrameSearchOffsetMs = playlistConfig.keyFrameSearchOffsetMs || 1;

Sequence.prototype.getKeyFrameTimestamp = function(kf){
    return kf + playlistConfig.keyFrameSearchOffsetMs;
};


Sequence.prototype.handleEvent = function (type,arg) {
    var that = this;

    switch(type){
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

    _.each(that.inner.clips,function (c) {
        c.collapseGap(this.from, this.to);
    });

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

    if(that.inner.clips.length === 0) {
        return _.omit(that.inner,['keyFrameDurations','firstKeyFrameOffset']);
    } else {
        var videoSrc = _.map(that.inner.clips, function(c){
            var found =  _.filter(c.inner.sources, function (src) {
                return src.isVideo;
            });
            return found.length ? found[0] : undefined
        });
        _.compact(videoSrc);
        if(!videoSrc.length){
            return _.omit(that.inner,['keyFrameDurations','firstKeyFrameOffset']);
        }
        that.inner.firstKeyFrameOffset = videoSrc[0].inner.offset;
        that.inner.keyFrameDurations = [];
        _.each(videoSrc,function(s){
            s.appendkeyFrameDurations(that.inner.keyFrameDurations);
        });

        return PlaylistItem.prototype.toJSON.apply(that, arguments);
    }
};



module.exports = Sequence;
