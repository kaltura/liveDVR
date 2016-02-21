
var Q = require('q');
var _ = require('underscore');
var config = require('../../common/Configuration');
var BaseAdapter=require('./BaseAdapter.js').BaseAdapter;
var StreamInfo=require('./BaseAdapter.js').StreamInfo;
var util=require('util');
var m3u8Parser = require('./../manifest/promise-m3u8');



function TestAdapter() {
    BaseAdapter.call(this);
}

util.inherits(TestAdapter,BaseAdapter);

function TestStreamInfo(entryId,flavorParamsIds) {

    StreamInfo.call(this,entryId,flavorParamsIds);
}

util.inherits(TestStreamInfo,StreamInfo);


TestStreamInfo.prototype.getAllFlavors = function() {
    var self=this;


    var flavorsList=["1"];

    var flavorsObjArray=[{
                name : "1",
                bandwidth : "926566",
                resolution: "640x480",
                liveURL : "http://localhost:1935/live/_definst_/1_abc123_1/chunklist.m3u8",
                entryId : "1_abc"
            }];



    return Q.resolve( {flavorsObj : flavorsObjArray, flavorsList : flavorsList});

};

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

var result=[];
for (var i=0;i<1;i++) {
    result.push(  {
        "entryId": "1_abc"+ i.pad(3),
        "flavorParamsIds": "1",
        "maxChunkCount": 20,
        getStreamInfo: function () {
            return new TestStreamInfo(this.entryId,this.flavorParamsIds);

        }
    });
}


TestAdapter.prototype.getLiveEntries=function() {
    return Q.resolve(result);

}



module.exports = TestAdapter;

