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

var playlistConfig = playlistUtils.playlistConfig;

var ObsoleteClipManager = function (logger,playlistObj,inner){

    inner = _.isObject(inner) || { paths:[],offset:0,durations:[] };

    TimestampList.prototype.constructor.call(this,
        logger,
        playlistObj,
        inner,
        'offset',
        inner.durations,
        inner);
};

util.inherits(ObsoleteClipManager,TimestampList);

var findInRemoved = function(item){
    return this == item;
};

// schedule obsolete chunk for removal after it has been moved out of window
ObsoleteClipManager.prototype.add = function(path) {
    var that = this;

    var expires = that.playlist.getCurrentTime() + that.playlist.inner.dvrWindow;

    if (!_.any(that.inner.paths,findInRemoved,path)) {
        expires = expires || 0;
        if(expires) {
            TimestampList.prototype.append.call(that,expires);
            that.inner.paths.push(path);
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
        paths.push(that.inner.paths.shift());
        TimestampList.prototype.remove.call(that,0);
    }
    return paths;
};



// PlaylistItem override
ObsoleteClipManager.prototype.validate = function () {
    var that = this;

    if(!TimestampList.prototype.validate.call(that)){
        return false;
    }
    if(that.durations.length != that.inner.paths.length){
        that.logger.warn("ObsoleteClipManager.validate that.durations.length != that.paths.length");
        return false;
    }
    return true;
};

module.exports = ObsoleteClipManager;



