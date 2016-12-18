/**
 * Created by igors on 3/21/16.
 */
var fs   = require('fs'),
    util = require('util'),
    Path = require('path'),
    logger = require('./../../common/logger').getLogger('playlist'),
    config = require('./../../common/Configuration'),
     _ = require('underscore'),
    assert = require('assert');

var sum = function(a,b){
    return a+b;
};

module.exports.sum = function (arr){
    return _.reduce(arr,sum, 0);
};

module.exports.Warn = logger.warn.bind(logger);
module.exports.Info =  logger.info.bind(logger);
module.exports.Error = logger.error.bind(logger);
module.exports.Debug = logger.debug.bind(logger);

var dbgAssert = function(){
    if(playlistConfig.debug){
        assert.apply(null, arguments);
    } else if(!arguments[0]) {
        logger.trace(new Error('assertion failed at').stack);
    }
};

// simple statistics
function Stats(ws){
    this.window = new Array(ws || 1000);
    this.reset();
}


Stats.prototype = {

    get stdDev () {
        var c = this.counter;
        return c > 1 ? Math.sqrt((this.sumSqr * c + this.sum * this.sum ) / (c * (c - 1))) : Number.NaN;
    },
    get avg () {
        return this.counter > 0 ? this.sum / this.counter : Number.NaN;
    },
    get counter(){
        if(this.end >= this.head){
            return this.end - this.head;
        } else {
            return this.end + this.window.length - this.head;
        }
    },
    get windowSize(){
        return this.window.length;
    }
};


Stats.prototype.addSample = function(s){
    var that = this;

    that.sum += s;
    that.sumSqr += s * s;
    that.end = (that.end + 1) % that.windowSize;
    if(that.end == that.head){
        var sd = that.window[that.head];
        that.sum -= sd;
        that.sumSqr -= sd * sd;
        that.head = (that.head + 1) % that.windowSize;
    }
    that.window[that.end] = s;
    return that;
};

Stats.prototype.reset = function () {
    this.sum = 0;
    this.sumSqr = 0;
    for (var i = 0; i < this.window.length; i++){
        this.window[i] = 0;
    }
    this.head = this.end = 0;
    return this;
};




module.exports.Stats = Stats;

module.exports.addWithOverflow = addWithOverflow = function(a,b,c) {
    if(c === undefined){
        return (a +b) % b;
    }
    return (a + b + c) %c;
};


// events emitted by BroadcastEventEmitter
module.exports.ClipEvents = {
    gap_limit_exceeded:'gap-limit-exceeded',
    chunk_reorder: 'chunk_reorder',
    // param 1: source
    // param 2: array of paths getting removed from playlist
    clip_removed: 'clip_removed',
    clip_added: 'clip_added',
    // raised after playlist has modified firstClipTime
    // arg 1: firstClipTime
    base_time_changed: 'base_time_changed',
    // raised by ValueHolder object
    value_changed: 'value_changed',
    modified:'modified',
    // called before toJSON returns modified object
    // param 1: real object
    // param 2 : object returned at humanReadablePass
    humanReadablePass: 'humanReadablePass',
    item_disposed: 'item_disposed',
    diagnosticsInfo: 'diagnosticsInfo',
    // param 1: source object of the alert
    // param 2: alert
    // param 3: optional info
    diagnosticsAlert: 'diagnosticsAlert'
};

var playlistConfig = config.get('playlistConfig');

module.exports.playlistConfig = playlistConfig;

if(!Array.prototype.hasOwnProperty('last')){
    Object.defineProperty(Array.prototype , "last", {
        get: function get_last() {
            if(this.length){
                return this[this.length-1];
            }
        },
        set: function set_last(value) {
            if(this.length){
                this[this.length-1] = value;
            }
        }
    });
    Object.defineProperty(Array.prototype , "first", {
        get: function get_first() {
            if(this.length){
                return this[0];
            }
        },
        set: function set_first(value) {
        if(this.length){
            this[0] = value;
        }
    }
    });
}

var TimeRange = function (min,max){
    this.min = min || Number.MAX_VALUE;
    this.max = max ||  Number.MAX_VALUE;
};

Object.defineProperty(TimeRange.prototype , "valid", {
    get: function get_Value() {
        var ok =  _.isNumber(this.min) && this.min !== Number.MIN_VALUE && _.isNumber(this.max) && this.max !== Number.MAX_VALUE;
        if(ok && this.max < this.min){
            ok = false;
            dbgAssert(ok);
        }
        return ok;
    }
});

TimeRange.prototype.eq = function(that){
   return that && that.min === this.min && that.max === this.max;
};

TimeRange.prototype.mergeWith = function(other){
    var that = this;

    that.min = Math.min(that.min,other.min);
    that.max = Math.min(that.max,other.max);
};

TimeRange.prototype.toString = function(){
    if(this.eq(TimeRange.prototype.Invalid)){
        return '[Invalid]';
    }
    return this;
};

Object.defineProperty(TimeRange.prototype , "isEmpty", {
    get: function get_isEmpty() {
        return !this.valid || this.min >= this.max;
    }
});

TimeRange.prototype.Invalidate = function(){
    this.min = TimeRange.prototype.Invalid.min;
    this.max = TimeRange.prototype.Invalid.max;
};

TimeRange.prototype.overlaps = function(dtsRange2){
    return this.valid && dtsRange2.valid &&
        !(this.isEmpty || dtsRange2.isEmpty) &&
        this.min < dtsRange2.max && this.max > dtsRange2.min
};

TimeRange.prototype.empty = function(){
    if(this.valid) {
        this.max = this.min
    }
};

TimeRange.prototype.Invalid = new TimeRange();

module.exports.TimeRange = TimeRange;

module.exports.dbgAssert = dbgAssert;


