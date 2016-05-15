var util = require('util');
var BroadcastEventEmitter = require('./BroadcastEventEmitter');
var playlistUtils = require('./playlistGen-utils');

/*
    base class for playlist items
    provides interface used to serialize to and from JSON string
    and validation method
* */
function PlaylistItem(logger,inner) {

    BroadcastEventEmitter.prototype.constructor.call(this);

    this.inner = inner || {};
    this.logger = logger;

    if(inner){
        this.onUnserialize();
        if(!this.validate(playlistUtils.playlistConfig)){
            throw new Error('serialization error');
        }
    }
}


util.inherits(PlaylistItem,BroadcastEventEmitter);

PlaylistItem.prototype.onUnserialize = function(){
};

PlaylistItem.prototype.validate = function(){
    return true;
};

PlaylistItem.prototype.toJSON = function(){
    return this.inner;
};

module.exports = PlaylistItem;
