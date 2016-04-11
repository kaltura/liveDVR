function BroadcastEventEmitter(){
}

BroadcastEventEmitter.prototype.addListener = function(listener){
    this.listener = listener;
};

BroadcastEventEmitter.prototype.removeListener = function(){
    this.listener = null;
};

BroadcastEventEmitter.prototype.emit = function(type,arg){
    this.listener(type,arg);
};

module.exports = BroadcastEventEmitter;