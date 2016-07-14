/**
 * Created by igors on 5/16/16.
 */

var    _ = require('underscore');
var util = require('util');
var playlistUtils = require('./playlistGen-utils');
var PlaylistItem = require('./PlaylistItem');
var TimeRange = playlistUtils.TimeRange;

function TimestampList (logger,playlistObj,inner,offsetName,durations,editPolicy){

    //BroadcastEventEmitter.prototype.addListener.call(playlistObj,playlistUtils.ClipEvents.base_time_changed,this);
    this.offsetName = offsetName;
    this.durations = durations;
    this.totalDuration = 0;
    this.editPolicy = editPolicy || TimestampList.prototype.editPolicy.cutaway;
    this.firstDTS = [];

    PlaylistItem.prototype.constructor.call(this,logger,playlistObj,inner);
}


util.inherits(TimestampList,PlaylistItem);

Object.defineProperty(TimestampList.prototype , "offset", {
    get: function get_Offset() {
        return this.inner[this.offsetName];
    },
    set: function set_Offset(off) {
        return this.inner[this.offsetName] = off;
    }
});

Object.defineProperty(TimestampList.prototype , "itemCount", {
    get: function get_ItemCount() {
        return this.firstDTS.length;
    }
});

Object.defineProperty(TimestampList.prototype , "clipTime", {
    get: function get_clipTime() {
        return this.getClipTime();
    }
});

TimestampList.prototype.getClipTime = function(){
    return this.playlist.inner.clipTimes[0];
};

TimestampList.prototype.editPolicy = {
    cutaway: 'cutaway',
    update: 'update'
};

TimestampList.prototype.doValidate = function(opts){
    var that = this;

    if(!_.isArray(that.firstDTS)){
        that.logger.warn("!_.isArray(that.firstDTS)");
        return false;
    }

    if(!_.isArray(that.durations)){
        that.logger.warn("!_.isArray(that.durations)");
        return false;
    }

    if( that.durations.length !== that.firstDTS.length) {
        that.logger.warn("TimestampList.doValidate  that.durations.length(%d) !== that.firstDTS.length(%d)",
            that.durations.length, that.firstDTS.length);
        return false;
    }

    if( !_.every(that.durations, function(d,index){
            var retval = d >= 0 && d !== undefined && !Number.isNaN(d);
            if(false === retval){
                that.logger.warn("TimestampList.doValidate check index %j duration %j [duration >= 0 && duration !== undefined && !Number.isNaN(duration)] failed",
                    index,d);
            }
            return retval;
        }) ) {
        return false;
    }

    var td = that.totalDuration,
        calcD = playlistUtils.sum(that.durations);
    if( Math.abs(calcD - td) > playlistUtils.playlistConfig.timestampToleranceMs ){
        that.logger.warn("TimestampList.doValidate  that.inner.durations.reduce( sum,0)  !== that.totalDuration");
        if(opts && opts.recover) {
            that.totalDuration = calcD;
            return true;
        } else {
            return false;
        }
    }

    return PlaylistItem.prototype.doValidate.apply(that,arguments);
};

TimestampList.prototype.setDurationAt = function(index,val){
    var that = this;

    val = Math.ceil(val);

    playlistUtils.dbgAssert(val >= 0);

    that.totalDuration -= that.durations[index];
    that.durations[index] = val;
    that.totalDuration += val;

    if(index === 0 && that.durations.length === 1){
       that.updateOffset();
    }
};

TimestampList.prototype.removeRange = function(from,to){
    var that = this;

    that.logger.info("TimestampList.removeRange. %j-%j firstDTS=%d durations=%d",from,to,that.firstDTS.length , that.durations.length);

    if(to <= from){
        return;
    }


    if(that.durations.length) {

        that.checkValid();

        //find indices for the input range
        var startIndex = _.sortedIndex(that.firstDTS,from),
            lastIndex = _.sortedIndex(that.firstDTS,to);

        while(startIndex > 0 && that.firstDTS[startIndex] > from) {
            startIndex--;
        }
        while(lastIndex > startIndex && that.firstDTS[lastIndex] > to) {
            lastIndex--;
        }

        if(startIndex >= lastIndex){
            if(startIndex < that.durations.length) {
                that.setDurationAt(startIndex, that.durations[startIndex] - (to - from));
            }
            return;
        }

        var upper = that.firstDTS[lastIndex-1]+that.durations[lastIndex-1];

        that.logger.info("TimestampList.removeRange. removing range [%d]=%d - [%d]=%d ",startIndex,
            that.firstDTS[startIndex],lastIndex,upper);

        var retVal =  {from: from, to: upper};

        if( that.editPolicy === TimestampList.prototype.editPolicy.cutaway ) {

            // remove all intervening items merge left overs into startIndex item
            that.totalDuration -=  playlistUtils.sum(that.durations.slice(startIndex, lastIndex));

            that.firstDTS.splice(startIndex, lastIndex - startIndex);
            that.durations.splice(startIndex, lastIndex - startIndex);

            if(startIndex > 0) {
                startIndex--;
                that.setDurationAt(startIndex, upper - that.firstDTS[startIndex]);
            }

        } else {
            var leftOver = from - that.firstDTS[startIndex] + to - upper;
            if(leftOver > 0){
                that.setDurationAt(startIndex++, leftOver);
            }
            for(;startIndex < lastIndex;startIndex++) {
                that.setDurationAt(startIndex, 0);
            }
        }

        that.updateOffset();

        that.checkValid();

        return retVal;
    }
};


TimestampList.prototype.collapseGap = function(from,to){
    var that = this;

    that.checkValid();

    var removed = that.removeRange(from, to);

    that.checkValid();

    return removed;
};

TimestampList.prototype.updateOffset = function(timestamp) {
    var that = this;

    timestamp = timestamp || that.clipTime;
    if(that.firstDTS.length > 0) {
        that.offset =  that.firstDTS[0] - timestamp;
    }
    /*
     if( this.editPolicy === TimestampList.prototype.editPolicy.cutaway ) {
     while (that.durations.length > 0 && that.firstDTS[0] + that.durations[0] < timestamp) {
     that.offset += that.durations[0];
     that.setDurationAt( 0, 0);
     that.durations.shift();
     that.firstDTS.shift();
     }
     } */
};

// *splice*es array of items
var spliceArray = function(arrObj,startingIndex,itemsArr) {
    _.each(itemsArr,function(it){
        arrObj.splice(startingIndex++,0,it);
    });
};

TimestampList.prototype.insertRange = function(firstDTS,durations) {
    var that = this;

    var insertIndex = that.firstDTS.length;
    if(that.firstDTS.length){
        insertIndex = _.sortedIndex(that.firstDTS, firstDTS[0]);
    }

    if(_.isArray(durations) && durations.length){
        _.each(durations,function(d,index){
            that.insertAt(insertIndex++,firstDTS[index],d);
        });
        return;
    }

    that.checkValid();

    durations = _.map(firstDTS,function(kf,index){
        //adjacent frames
        if(index > 0 ){
            return kf - firstDTS[index - 1];
        } else  {
            // this frame will be removed
            if(insertIndex > 0){
                // update duration of last frame
                that.setDurationAt(insertIndex-1,kf - that.firstDTS[insertIndex-1]);
            }
            return 0;
        }
    });

    // no future estimation - set duration to 0 until next iteration
    if(firstDTS.length > 1) {
        durations.shift();
        firstDTS.splice(firstDTS.length-1,1);
    }

    spliceArray(that.firstDTS, insertIndex, firstDTS);
    spliceArray(that.durations, insertIndex, durations);

    that.totalDuration += playlistUtils.sum(durations);
    if(insertIndex === 0){
        that.updateOffset();
    }

    that.checkValid();
};

TimestampList.prototype.append = function(firstDTS,duration) {
    this.insertAt(this.durations.length,firstDTS,duration);
};

TimestampList.prototype.prepend = function(firstDTS,duration) {
    this.insertAt(0,firstDTS,duration);
};

TimestampList.prototype.insert = function(firstDTS,duration) {
    this.insertRange([firstDTS,duration+firstDTS]);
};

TimestampList.prototype.insertAt = function(index,firstDTS,duration,discontinuity) {
    var that = this;

    duration = duration || 0;

    that.checkValid();

    index = Math.max(0,Math.min(that.durations.length,index));

    if( index < that.durations.length) {
        if (index == 0) {
            if(that.durations.length) {
                that.offset = that.offset - (that.firstDTS[0] - firstDTS);
            }
            that.firstDTS.unshift(firstDTS);
        }
        that.durations.splice(index,0,0);
        that.firstDTS.splice(index,0,firstDTS);

    } else {
        that.durations.push(0);
        that.firstDTS.push(firstDTS);
    }

    if(!discontinuity && index > 0){
        that.setDurationAt(index-1, Math.max(0,firstDTS - that.firstDTS[index-1]));
    }

    that.setDurationAt(index, duration);

    that.checkValid();
};

TimestampList.prototype.checkValid = function(){
    return playlistUtils.playlistConfig.debug ? TimestampList.prototype.doValidate.call(this,playlistUtils.playlistConfig) : true;
};

TimestampList.prototype.remove = function(index) {
    var that = this;

    if( index >= 0 && index < that.durations.length) {

        that.checkValid();

        that.setDurationAt( index, 0);
        that.durations.splice(index,1);
        that.firstDTS.splice(index,1);

        if (index == 0) {
            that.updateOffset();
        }

        that.checkValid();
    }
};

TimestampList.prototype.getDTSRange = function() {
    var that = this;

    if(!that.range) {
        that.range = new TimeRange();
    }

    if ( that.durations.length ) {
        that.range.min = that.firstDTS[0];
        that.range.max = that.firstDTS[0] + that.totalDuration;
    } else {
        that.range.Invalidate();
    }
    return that.range;
};

TimestampList.prototype.onUnserialize = function(){
    var that = this;

    that.logger.debug('onUnserialize');

    var clipOffset = that.offset + that.clipTime;
    var gapindex = 0;
    that.firstDTS = _.map(that.durations,function(d) {
        //bild correct firstDTS index with respect to gaps
        var retVal = clipOffset;
        clipOffset += d;
        return retVal;
    });
    that.totalDuration = playlistUtils.sum(that.durations);
    that.checkValid();
};

TimestampList.prototype.handleEvent = function (type,arg) {
    var that = this;

    switch (type) {
        case playlistUtils.ClipEvents.value_changed:
        case playlistUtils.ClipEvents.base_time_changed:
            that.updateOffset(arg);
            break;
        default:
            that.emit(type,arg);
    }
};


module.exports = TimestampList;