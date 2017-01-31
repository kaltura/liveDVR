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
var ConcatSource = require('./ConcatSource');
var loggerModule = require('../../common/logger');
const ErrorUtils = require('./../utils/error-utils')
var playlistConfig = playlistUtils.playlistConfig;
const SearchIndex = require('./SearchIndex')

var createNewClip = function(index,c){
    var that = this;
    var clipTimeObj = c ? that.playlist.inner.clipTimes[index] : undefined;
    var durationObj = c ? that.playlist.inner.durations[index] : undefined;
    var type = c ? c.type : 'mixFilter';
    switch(type){
        case 'mixFilter':
            return new MixFilterClip(that.loggerInfo, index, that.playlist, that,  clipTimeObj, durationObj, c);
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
    that.searchIndex = new SearchIndex(that.loggerInfo);

    PlaylistItem.prototype.constructor.call(that,that.logger,playlistObj,inner);

    if(!this.isInitialized()) {
        that.inner = {
            id:flavorId,
            clips: [],
            bitrate: {
                v: 0,
                a: 0
            }
        };
    }
};

util.inherits(Sequence,PlaylistItem);

Object.defineProperty(Sequence.prototype , "clips", {
    get: function get_clips() {
        return this.inner.clips;
    }
});

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
};

Sequence.prototype.doValidate = function(){
    var that = this;

    if(_.any(that.inner.clips,function(c) {
            return c.doValidate() != true;
        })){
        that.logger.warn('One of the clip validations failed');
        return false;
    }

    if(that.inner.clips.length !== that.playlist.inner.durations.length) {
        that.logger.warn('that.inner.clips.length !== that.playlist.inner.durations.length %j !== %j',
            that.inner.clips.length , that.playlist.inner.durations.length);
        return false;
    }

     return true;
};

Sequence.prototype.handleEvent = function (type,arg) {
    var that = this;

    switch(type){
        case playlistUtils.ClipEvents.clip_removed:
            arguments[1] = that.inner.id;
            that.emit.apply(that,arguments);
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

    _.each(that.inner.clips,function (c) {
        c.collapseGap(this.from, this.to);
    });

};

Sequence.prototype.checkExpires = function (expires) {
    var that = this;

    // first calculate total track duration
    var trackDurations = {};
    _.each(that.clips,function(c){
        _.each(c.inner.sources,function(s){
            if(!trackDurations[s.inner.tracks]) {
                trackDurations[s.inner.tracks] = 0;
            }
            trackDurations[s.inner.tracks] += s.durationsMan.totalDuration;
        });
    });

    // iterate over clips' sources and check if there are expired chunks
    _.each(that.clips, function (c) {
        _.each(c.inner.sources, function (s) {

            if (trackDurations[s.inner.tracks]) {
                var before = s.durationsMan.totalDuration;
                if (before > 0) {
                    s.checkExpires(trackDurations[s.inner.tracks]);
                    var after = s.durationsMan.totalDuration;
                    if(after < before) {
                        //update remaining duration for this track
                        trackDurations[s.inner.tracks] -= before - after;
                    }

                    if(after > 0) {
                        //this will stop purge process for track <s.inner.tracks>
                        delete trackDurations[s.inner.tracks];
                    }
                }
                // else move on to next clip
            }
        });
    });

};

Sequence.prototype.checkMaxAllowedClips = function (maxClipsPerFlavor) {

    try {
        // calc number of clips that are empty and reduce from total
        let nonEmptyclips = _.filter(this.clips, clip => !clip.isEmpty());

        // check if number of non-emtpy clips passed maximum allowed
        if (nonEmptyclips.length > maxClipsPerFlavor) {
            this.logger.warn(`Max allowed clips exceeded. [total clips: ${this.clips.length}, max allowed: ${maxClipsPerFlavor}]`);

            _.chain(nonEmptyclips)
                .first(nonEmptyclips.length - maxClipsPerFlavor)
                .each( c => c.clearClip());
        }
    } catch (err) {
        this.logger.error(`checkMaxAllowedClips: failed to clear clips. Max allowed: ${maxClipsPerFlavor}. Error ${ErrorUtils.error2string(err)}`)
    }

}

Sequence.prototype.toJSON = function(){
    var that = this;

    var seqObj = PlaylistItem.prototype.toJSON.apply(that, arguments);

    // filter out clips whose duration <= 0
    var clips = _.filter(seqObj.clips,function(c,index){
        return that.playlist.inner.durations[index] > 0;
    });

    if(clips.length !== seqObj.clips.length) {
        seqObj = _.clone(seqObj);
        seqObj.clips = clips;
    }

    return seqObj;
};

Sequence.prototype.checkFileExists = function(fileName){
   return this.searchIndex.has(fileName);
};

module.exports = Sequence;
