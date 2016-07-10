/**
 * Created by igors on 6/15/16.
 */
var _ = require('underscore');
var playlistUtils = require('../playlistGenerator/playlistGen-utils');
var loggerModule = require('../../common/logger');


var sortByNumber = function (arr) {
    return arr.sort(function (a, b) {
        return +a - +b;
    }, 0);
};

function PackagerSim (loggerInfo,config,playlist,eventSource,flavorIndex) {
    this.logger = loggerModule.getLogger("PackagerSim", loggerInfo);
    this.manifest = [];
    this.chunklist = [];
    this.config = _.clone(config);
    this.flavorIndex =flavorIndex ? flavorIndex - 1 : 0;
    this.playlist = playlist;
    this.config.chunksPerIndex = this.config.chunksPerIndex || this.playlist.inner.liveWindowDuration / this.config.segmentDuration;
    eventSource.on('beforePlaylistChanged',beforePlaylistChanged.bind(this));
    eventSource.on('afterPlaylistChanged',afterPlaylistChanged.bind(this));
    this.db = {};
}

PackagerSim.prototype.getSegmentStartEndTimes = function(index){
    return {
        start: index * this.config.segmentDuration,
        end: ( 1 + index ) * this.config.segmentDuration
    };
};

PackagerSim.prototype.getSegmentIndex = function(time){
    return Math.ceil(time / this.config.segmentDuration);
};

var indexOfTime = function(time,durations){
    var total = 0;
    for(var i =0; i < durations.length; i++){
        var next = total + durations[i];
        if(total <= time && time < next) {
            return i;
        }
        total = next;
    }
    return -1;
};

PackagerSim.prototype.alignTime = function (time){
    var that = this;

    for(  var j = 0; j < that.playlist.inner.durations.length ; j++){
        var d = that.playlist.inner.durations[j];
        if(time < d)
            break;
        time -= d;
    }

    if(j >= that.playlist.inner.durations.length){
        throw new Error('time out of range');
    }

    var seq = that.playlist.inner.sequences[that.flavorIndex];

    playlistUtils.dbgAssert(seq.inner.keyFrameDurations.length>0);

    var src = seq.clips[j].inner.sources[0].inner;

    var idx = indexOfTime(time + that.playlist.inner.clipTimes[j] - (that.playlist.inner.clipTimes[j] + seq.inner.firstKeyFrameOffset),
        seq.inner.keyFrameDurations);

    if(idx < 0){
        idx = indexOfTime(time - src.offset,src.durations);
        playlistUtils.dbgAssert(idx>=0);
    }

    playlistUtils.dbgAssert(idx>=0);

    var srcIdx = indexOfTime(time - src.offset,src.durations);

    playlistUtils.dbgAssert(srcIdx>=0);

    return { offset: _.reduce(seq.inner.keyFrameDurations.slice(0,srcIdx),function(val,d) {
            return val + d;
        } , that.playlist.inner.clipTimes[0] + seq.inner.firstKeyFrameOffset),
        source: src.paths[srcIdx]
    };
};

var beforePlaylistChanged = function () {
    var that = this;

    var totalDuration = playlistUtils.sum(that.playlist.inner.durations);

    if(totalDuration > 0){

        var lowerLimit = that.playlist.inner.clipTimes[0] - that.playlist.inner.segmentBaseTime;
        var upperLimit = totalDuration + lowerLimit;

        var maxSegIndex = that.getSegmentIndex(upperLimit) - 1;
        if(maxSegIndex > 0) {
            that.manifest.splice(0,that.manifest.length);
            var minSegmentIndex = Math.max(0, maxSegIndex - that.config.chunksPerIndex);

            maxSegIndex -= minSegmentIndex;
            minSegmentIndex = 0;

            var segRange = that.getSegmentStartEndTimes(minSegmentIndex);

            var start = segRange.start,end = segRange.end;

            for (var i = minSegmentIndex; i < maxSegIndex; i++) {

                var startItem = that.alignTime(start),
                    endItem = that.alignTime(end);
                var timeStart = startItem.offset,
                    timeEnd = endItem.offset;

                if(timeEnd >= upperLimit)
                    break;

                if(timeEnd <= timeStart){
                    break;
                }

                that.logger.warn("insert item %d %d %d %d %d",
                    i , start, end,timeStart,timeEnd);

                that.manifest.push({ start: timeStart,
                        duration: timeEnd-timeStart,
                        source: startItem.source,
                        segmentIndex: i}
                );

                start += that.config.segmentDuration;
                end   += that.config.segmentDuration;
            }
        }
    }

};

var afterPlaylistChanged = function () {
    var that = this;


    that.validate();
};

PackagerSim.prototype.getSegment = function(index){
    var that = this;

    var range = this.getSegmentStartEndTimes(index);
    var startSource = that.alignTime(range.start),endSource = that.alignTime(range.end);
    return {
        start: startSource.offset,
        duration: endSource.offset - startSource.offset,
        segmentIndex: index,
        source: startSource.source
    };
};

PackagerSim.prototype.validate = function() {
    var that = this;

    var chunklist = _.map(that.manifest,function(seg){
        return that.getSegment(seg.segmentIndex);
    });
    _.each(chunklist,function(chunk,index){
        var mseg = that.manifest[index];
        if(chunk.segmentIndex != mseg.segmentIndex
            || chunk.start != mseg.start
            || chunk.duration != mseg.duration
            || chunk.source != mseg.source ){
            that.logger.warn("chunk != that.manifest[index]");
            throw new Error('chunk !== that.manifest[index]');
        }
    });

    that.updateChunkDB(chunklist);

};

PackagerSim.prototype.updateChunkDB = function(chunklist){
    var that = this;

    var keys = sortByNumber(Object.keys(that.db));

    var newitems = _.filter(chunklist, function(seg){
        return _.indexOf(keys,seg.segmentIndex.toString()) < 0;
    });

    _.each(newitems,function(seg){
        that.logger.debug("db: add item %d %d %d",seg.segmentIndex,seg.start,seg.duration);
        that.db[seg.segmentIndex] = seg;
    });

    keys = sortByNumber(Object.keys(that.db));

    if(keys.length > 100){
        keys =  _.last(keys,100);
        var tmp = {};
        _.each(keys,function(key){
            tmp[key] = that.db[key];
        });
        delete that.db;
        that.db = tmp;
    }

    keys = sortByNumber(Object.keys(that.db));

    _.each(keys, function(key){
        var item = that.db[key];
        if(item.start<= 0){
            throw new Error('(item.start<= 0');
        }
        if(item.duration <= 0){
            throw new Error('item.duration <= 0');
        }
        if( that.db[key-1]){
            var itemPrev = that.db[key-1];
            if(itemPrev.start + itemPrev.duration != item.start){
                that.logger.warn("chunk # %d prev %d != cur %d",
                    key,
                    itemPrev.start + itemPrev.duration,
                    item.start);
                throw new Error('itemPrev.start + itemPrev.duration != item.start');
            }
        }
    });

};

module.exports = PackagerSim;
