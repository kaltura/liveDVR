var    _ = require('underscore');
var util = require('util');
var BroadcastEventEmitter = require('./BroadcastEventEmitter');
var playlistUtils = require('./playlistGen-utils');

/*
    base class for playlist items
    provides interface used to serialize to and from JSON string
    and validation method
* */

function PlaylistItem(logger, playlistObj, inner) {

    BroadcastEventEmitter.prototype.constructor.call(this);

    this.inner = inner || {};
    this.logger = logger;
    this.playlist = playlistObj;

    if(inner){
        this.onUnserialize();
        if(!this.validate()){
            throw new Error('serialization error');
        }
    }
}

util.inherits(PlaylistItem,BroadcastEventEmitter);

PlaylistItem.prototype.onUnserialize = function(){
};

PlaylistItem.prototype.isInitialized = function () {
    return _.isObject(this.inner) && _.keys(this.inner).length > 0;
};

PlaylistItem.prototype.doValidate = function(){
    if(!this.logger){
        return false;
    }
    if(!this.playlist){
        this.logger.warn("PlaylistItem.doValidate !this.playlist");
        return false;
    }
    if(!this.inner){
        this.logger.warn("PlaylistItem.doValidate !this.inner");
        return false;
    }
    return true;
};

PlaylistItem.prototype.validate = function(){
   return playlistUtils.playlistConfig.debug ? this.doValidate(playlistUtils.playlistConfig) : true;
};

PlaylistItem.prototype.toJSON = function(){
    return this.inner;
};

module.exports = PlaylistItem;
