var PlaylistGenerator = require('./../../lib/PlaylistGenerator/PlaylistGenerator');
var PlaylistUtils = require('./../../lib/PlaylistGenerator/playlistGen-utils');
var config = require('./../../common/Configuration');
var TimestampList =require('./../../lib/PlaylistGenerator/TimestampList');
var logger = require('./../../common/logger');
var util = require('util');
var _ = require('underscore');
var assert = require('assert');

logger = {
    debug:console.log,
    info:console.log,
    warn:console.log,
    error:console.log
};


arr = [0,1,2,3,4,5];
val = 7;
var index = _.sortedIndex(arr,val);


function Tester (logger,mode){
    var obj = {
            offset: 0,
            durations: []
        },
        playlist = {
            inner: {
                firstClipTime: 0
            }
        };
    TimestampList.prototype.constructor.call(this,logger,playlist,obj, 'offset',obj.durations,mode);
};

util.inherits(Tester,TimestampList);

Tester.prototype.toJSON = function(){
    var json = TimestampList.prototype.toJSON.call(this);
    json.firstDTS = this.firstDTS;
    return json;
};

Tester.prototype.checkTL = function(){
    this.logger.info(JSON.stringify(this));
    if(!this.validate()){
        throw new Error('validate failed');
    }
};

Tester.prototype.removeEmptyRanges = function() {
    var startIndex = _.indexOf(this.durations,0),
        lastIndex = _.lastIndexOf(this.durations,0);
    this.durations.splice(startIndex,lastIndex-startIndex);
    this.firstDTS.splice(startIndex,lastIndex-startIndex);
};

/*
 if(!Array.prototype.last ) {

 Object.defineProperty(Array.prototype, "last", {
 get: function get_Last() {
 return this[this.length-1];
 }
 });
 }
 */

var tl = new Tester(logger,TimestampList.prototype.editPolicy.cutaway),
    d1 = new Tester(logger,TimestampList.prototype.editPolicy.update);

try {
    var timestamp = 0, step = 1000,timestampRemove = 0, nInsert = 3, nRemove = 3, maxDuration = step * 20,
        nIterations = 1000;

    for(var j = 0;j < nIterations;j++) {
        var insert = [];

        for(var i =0; i < nInsert;i++){
            insert.push(timestamp);
            timestamp += step;
        }
        tl.insertRange(insert);
        tl.checkTL();

        var duration = 0;
        _.reduce(insert,function(val,it,index){
            duration += it - val;
            return it;
        },insert[0]);
        d1.append(insert[0],duration);
        d1.checkTL();

        while(d1.itemCount > 0 && timestamp - d1.firstDTS[0] > maxDuration) {
            var from = d1.firstDTS[0];
            d1.remove(0);
            d1.checkTL();
            if(d1.itemCount === 0)
                break;
            var to = d1.firstDTS[0];

            tl.removeRange(from, to);
            tl.checkTL();
        }

        if(0 === j % 100 && j > 0){
            var from = Math.random()* maxDuration / 2 + timestamp,
                to = from + Math.random() * maxDuration / 4 + 100;
            tl.removeRange(Math.ceil(from),Math.ceil(to));
            tl.checkTL();
            d1.removeRange(Math.ceil(from),Math.ceil(to));
            d1.checkTL();

        }

        assert(tl.totalDuration === d1.totalDuration);
        assert(tl.firstDTS[0] === d1.firstDTS[0]);

    }

    console.log('done test');
} catch(err){
    console.log('failed test: ' + err);
}


