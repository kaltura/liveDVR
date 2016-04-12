/**
 * Created by igors on 3/21/16.
 */
var fs   = require('fs'),
    util = require('util'),
    Path = require('path'),
    logger = require('../logger/logger')(module),
    config = require('./../../common/Configuration'),
     _ = require('underscore');

var sum = function(a,b){
    return a+b;
};

module.exports.sum = function (arr){
    return _.reduce(arr,sum, 0);
};

module.exports.Warn = logger.warn.bind(logger);
module.exports.Info = logger.info.bind(logger);
module.exports.Error = logger.error.bind(logger);
module.exports.Debug = logger.debug.bind(logger);



// simple statistics
function Stats(ws){
    this.window = new Array(ws || 1000);
    this.reset();
}


Stats.prototype = {
    get hasEnoughSamples () {
        return this.counter > 3;
    },
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


// events emotted by BroadcastEventEmitter
module.exports.ClipEvents = {
    gap_limit_exceeded:'gap-limit-exceeded',
    chunk_reorder: 'chunk_reorder'
};

module.exports.playlistConfig = config.get('playlistConfig') || {
    debug : config.get('debug') || true,
    waitTimeBeforeRemoval : config.get('chunkWaitTimeBeforeRemove') || 100000,
    maxChunkGapSize : config.get('maxChunkGapSize') || 10000,
    maxAllowedPTSDrift: config.get('maxAllowedPTSDrift') || 1000,
    timestampToleranceMs: 2
};



