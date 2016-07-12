/**
 * Created by igors on 5/17/16.
 */

var    _ = require('underscore');
var util = require('util');
var playlistUtils = require('./playlistGen-utils');
var PlaylistItem = require('./PlaylistItem');
var Path = require('path');
var fs = require('fs');
var TimestampList = require('./TimestampList');
var loggerModule = require('../../common/logger');

var playlistConfig = playlistUtils.playlistConfig;

var ObsoleteClipManager = function (loggerInfo,playlistObj,inner){

    this.logger = loggerModule.getLogger("ObsoleteClipManager", loggerInfo);

    inner = _.isObject(inner) && Object.keys(inner).length ? inner : { paths:[],offset:0,durations:[] };

    TimestampList.prototype.constructor.call(this,
        this.logger,
        playlistObj,
        inner,
        'offset',
        inner.durations,
        inner);

    playlistObj.addListener(playlistUtils.ClipEvents.base_time_changed,this);
};

util.inherits(ObsoleteClipManager,TimestampList);

var findInRemoved = function(item){
    return this == item;
};

// schedule obsolete chunk for removal after it has been moved out of window
ObsoleteClipManager.prototype.add = function(path) {
    var that = this;


    var removeTimeout = playlistUtils.playlistConfig.overrideRemoveTimeout ||  Math.abs(that.playlist.inner.liveWindowDuration);
    var expires = that.playlist.getCurrentTime() + removeTimeout;

    that.logger.debug("Add new item %j expires at %j timeout %j",path, expires, removeTimeout);

    if (!_.any(that.inner.paths,findInRemoved,path)) {
        expires = expires || 0;
        if(expires) {
            that.inner.paths.push(path);
            TimestampList.prototype.append.call(that,expires);
        } else {
            // don't wait
            TimestampList.prototype.prepend.call(that,expires);
            that.inner.paths.unshift(path);
        }
    }
};

ObsoleteClipManager.prototype.checkExpires = function (expires) {
    var that = this;

    var paths = [];
    while( that.inner.paths.length && that.firstDTS[0] <= expires) {
        var rpath = that.inner.paths.shift();
        that.logger.debug("checkExpires. removing obsolete item %j",rpath);
        paths.push(rpath);
        TimestampList.prototype.remove.call(that,0);
    }
    return paths;
};



// PlaylistItem override
ObsoleteClipManager.prototype.doValidate = function () {
    var that = this;

    if(!TimestampList.prototype.doValidate.call(that)){
        return false;
    }
    if(that.durations.length != that.inner.paths.length){
        that.logger.warn("ObsoleteClipManager.doValidate that.durations.length != that.paths.length");
        return false;
    }
    return true;
};

ObsoleteClipManager.prototype.checkFileExists = function(fileName) {
    return _.indexOf(this.inner.paths,fileName) >= 0;
};


module.exports = ObsoleteClipManager;



