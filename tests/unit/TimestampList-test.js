var PlaylistGenerator = require('./../../lib/PlaylistGenerator/PlaylistGenerator');
var PlaylistUtils = require('./../../lib/PlaylistGenerator/playlistGen-utils');
var config = require('./../../common/Configuration');
var TimestampList =require('./../../lib/PlaylistGenerator/TimestampList');
var logger = require('./../../common/logger');
var util = require('util');
var _ = require('underscore');

logger = {
    debug:console.log,
    info:console.log,
    warn:console.log,
    error:console.log
};


arr = [0,1,2,3,4,5];
val = 7;
var index = _.sortedIndex(arr,val);


function Tester (logger){
    var obj = {
        offset: 0,
        durations: []
    },
       playlist = {
            inner: {
                firstClipTime: 0
            }
        };
    TimestampList.prototype.constructor.call(this,logger,playlist,obj, 'offset',obj.durations);
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

var tl = new Tester(logger);
try {
    tl.insertRange([0, 2000, 5000, 6000]);
    tl.checkTL();
    tl.insertRange([7000, 8000, 9000, 10000]);
    tl.checkTL();
    tl.removeRange(2000, 5000);
    tl.checkTL();
    tl.insertRange([11000, 12000]);
    tl.checkTL();
    tl.removeRange(5000,7500);
    tl.checkTL();

    console.log('done test');
} catch(err){
    console.log('failed test: ' + err);
}


