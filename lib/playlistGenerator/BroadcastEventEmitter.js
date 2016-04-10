function BroadcastEventEmitter(){
}

BroadcastEventEmitter.prototype.addListener = function(listener){
    this.getListener = function () {
        return listener;
    };
};

BroadcastEventEmitter.prototype.removeListener = function(){
    delete this.getListener;
};

BroadcastEventEmitter.prototype.emit = function(type,arg){
    this.getListener()(type,arg);
};

module.exports = BroadcastEventEmitter;