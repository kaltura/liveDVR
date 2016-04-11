function BroadcastEventEmitter(){
}

BroadcastEventEmitter.prototype.addListener = function(listener){
    this.listenerCb = listener;
};

BroadcastEventEmitter.prototype.removeListener = function(){
    this.listenerCb = null;
};

BroadcastEventEmitter.prototype.emit = function(type,arg){
    this.listenerCb(type,arg);
};

module.exports = BroadcastEventEmitter;