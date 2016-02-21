
var Q = require('q');
var _ = require('underscore');
var config = require('../../common/Configuration');
var BaseAdapter=require('./BaseAdapter.js').BaseAdapter;
var StreamInfo=require('./BaseAdapter.js').StreamInfo;
var util=require('util');



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

//    "http://localhost:1935/kLive/_definst_/1_abc_"+kalturaFlavor+"/playlist.m3u8";
/*
    return promise.then(function(result) {

            return {
                name : "a",
                bandwidth : "20000",
                liveURL : "1_abc123_1",
                entryId : self.entryId
            };
        });

        return {flavorsObj : flavorsObjArray, flavorsList : result.flavorsList, playlist: result.playlist};
    })
    .catch(function(err) {
        logger.error("Manifest couldn't be parsed correctly: " + err.value);
    });*/
};


var result=[
    {
        "entryId": "1_abc_1",
        "flavorParamsIds": "1",
        "maxChunkCount": 20,
        getStreamInfo: function () {
            return new TestStreamInfo();

        }
    }
];


TestAdapter.prototype.getLiveEntriesForMediaServer=function() {
    return Q.resolve(result);

}



module.exports = TestAdapter;

