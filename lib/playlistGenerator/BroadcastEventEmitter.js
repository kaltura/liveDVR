var    _ = require('underscore');
var playlistUtils = require('./playlistGen-utils');


function BroadcastEventEmitter(){
}

BroadcastEventEmitter.prototype.addListener = function(eventName,listener){
    if(typeof eventName === 'string'){
        var arr = this[eventName];
        if(arr){
            var index = _.indexOf(arr,listener);
            if(index < 0) {
                arr.push(listener)
            }
        } else {
            this[eventName] = [listener];
        }
    } else {
        if(eventName !== this) {
            this.listenerCb = eventName;
        }
    }
};


BroadcastEventEmitter.prototype.removeListener = function(eventName,listener){
    if(typeof eventName === 'string' && this[eventName] ){
        var arr = this[eventName];
        var index = _.indexOf(arr,listener);
        if(index >= 0) {
            arr.splice(index,1);
        }
        if(arr.length === 0){
            delete this[eventName];
        }
    } else if(this.listenerCb === listener) {
        delete this.listenerCb;
    }
};

// NB: arguments passed as *this* from outer scope
var applyEvent = function(listenerCb){
    listenerCb.handleEvent.apply(listenerCb,this);
};

BroadcastEventEmitter.prototype.emit = function(){
    if(this[arguments[0]]){
        _.each(this[arguments[0]], applyEvent,arguments);
    } else if(this.listenerCb) {
        this.listenerCb.handleEvent.apply(this.listenerCb,arguments);
    }
};

BroadcastEventEmitter.prototype.handleEvent = function () {
    this.emit.apply(this,arguments);
};

module.exports = BroadcastEventEmitter;