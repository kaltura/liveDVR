function BroadcastEventEmitter(){
}

BroadcastEventEmitter.prototype.addListener = function(listener){
    this.listenerCb = listener;
};

BroadcastEventEmitter.prototype.removeListener = function(){
    this.listenerCb = null;
};

BroadcastEventEmitter.prototype.emit = function(){
    if(this.listenerCb) {
        this.listenerCb.handleEvent.apply(this.listenerCb,arguments);
    }
};

BroadcastEventEmitter.prototype.handleEvent = function () {
    this.emit.apply(this,arguments);
}

module.exports = BroadcastEventEmitter;