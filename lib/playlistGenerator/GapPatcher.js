/**
 * Created by igors on 5/21/16.
 */
var    _ = require('underscore');
var util = require('util');
var playlistUtils = require('./playlistGen-utils');
var PlaylistItem = require('./PlaylistItem');


var GapPatcher = function (logger,playlistObj,inner){

    inner = _.isObject(inner) && Object.keys(inner).length ? inner : undefined;

    PlaylistItem.prototype.constructor.call(this,logger,playlistObj,inner);
    if(!this.gaps){
        this.gaps = [];
    }
    this.reduceGapsRequested = 0;
};

util.inherits(GapPatcher,PlaylistItem);

var gapOverlaps = function(g){
    return this.to > g.from && this.from < g.to;
};

Object.defineProperty(GapPatcher.prototype , "itemCount", {
    get: function get_ItemCount() {
        return this.gaps ? this.gaps.length : 0;
    }
});

GapPatcher.prototype.onUnserialize = function() {
    var that = this;

    if(that.inner.gaps && that.inner.gaps.length){
        var offset = that.playlist.inner.clipTimes[0] +  that.inner.offset;
        that.gaps = _.map(that.inner.gaps,function(g){
            return {
                from: g.start + offset,
                to: g.duration + g.start + offset
            };
        });
    }
};

GapPatcher.prototype.at = function(index) {
    if (index >= 0 && index < this.itemCount) {
        return this.gaps[index];
    }
};

GapPatcher.prototype.toJSON = function() {
    var that = this;
    return PlaylistItem.prototype.toJSON.call(that);
};


var gapPred = function(r){
    return r.from;
};

var insertGap = function (g){
    var that = this;

    var index = _.sortedIndex(that.gaps,g,gapPred);
    that.gaps.splice(index,0,g);
};

GapPatcher.prototype.collapseGap = function(gap) {
    var that = this;

    if(gap.from < gap.to) {

        var overlaps = _.filter(that.gaps,gapOverlaps,gap);
        if(overlaps.length) {
            gap.from = Math.max(overlaps.first.from,gap.from);
            gap.to = Math.min(overlaps.last.to , gap.to);
            that.gaps = _.difference(that.gaps,overlaps);
        }

        if(gap.from < gap.to) {
            insertGap.call(that,gap);
            that.emit(playlistUtils.ClipEvents.modified, that);
        }
    }
};

GapPatcher.prototype.removeAt = function(index) {
    var that = this;
    if(index >= 0 && index < that.itemCount){
        that.gaps.splice(index,1);
    }
};

GapPatcher.prototype.update = function () {
    var that = this;
    while (that.itemCount) {
        var gap = that.at(0);
        // ensura all flavours are ready to create clip
        if (_.every(that.playlist.inner.sequences, function (seq) {
                return seq.inner.clips.length && seq.inner.clips.last.lastClipStartTime >= gap.to
            })) {

            // inhibit new clip with concat sources
            _.each(that.playlist.inner.sequences, function (seq) {
                seq.inner.clips.push(seq.inner.clips.last.split(gap));
            });

            that.removeAt(0);


        } else {
            break;
        }
    }
};

GapPatcher.prototype.doValidate = function() {

    var that = this;
    if(!_.isArray(that.gaps)){
        that.logger.warn("GapPatcher.doValidate. !_.isArray(that.gaps)");
        return false;
    }

    if(_.any(that.gaps,function(g){
            return g.to < g.from
        })){
        that.logger.warn("GapPatcher.doValidate.  g.to < g.from");
        return false;
    }

    if(that.gaps.length && _.any(that.gaps,function(g,index){
            return index > 0 && that.gaps[index-1].to > g.from;
        })){
        that.logger.warn("GapPatcher.doValidate.  g.to < g.from");
        return false;
    }

    return true;
};

GapPatcher.prototype.toHumanReadable = function(clipDuration){
    var that = this;

    clipDuration = clipDuration || 1;
    return _.map(that.gaps,function(g) {
        return {
            at: Math.floor((g.from - that.inner.segmentBaseTime) / clipDuration),
            dur: Math.ceil((g.to - g.from) / clipDuration)
        };
    });
};


module.exports = GapPatcher;