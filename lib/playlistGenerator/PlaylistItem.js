var util = require('util');
var BroadcastEventEmitter = require('./BroadcastEventEmitter');

function PlaylistItem(inner) {

    BroadcastEventEmitter.prototype.constructor.call(this);

    this.inner = inner || {};

    if(inner){
        this.onSerialize();
        if(!this.validate()){
            throw new Error('serialization error');
        }
    }
}


util.inherits(PlaylistItem,BroadcastEventEmitter);

PlaylistItem.prototype.onSerialize = function(){
};

PlaylistItem.prototype.validate = function(){
    return true;
};

PlaylistItem.prototype.toJSON = function(){
    return this.inner;
};

module.exports = PlaylistItem;
