/**
 * Created by elad.benedict on 8/26/2015.
 */

var Q = require('q');
var _ = require('underscore');
var config = require('../../common/Configuration');
var BaseAdapter=require('./BaseAdapter.js').BaseAdapter;




var result=[
    {
        "entryId": "1_abc_1",
        "flavorParamsIds": "1",
        "maxChunkCount": 20,
        getChunklistUrl: function (kalturaFlavor) {
            return "http://localhost:1935/kLive/_definst_/1_abc_"+kalturaFlavor+"/playlist.m3u8";
        }
    }
];

function TestAdapter() {


}

util.inherits(TestAdapter,BaseAdapter);



TestAdapter.prototype.getLiveEntriesForMediaServer=function() {


    return  Q.resolve(result);

}

module.exports = TestAdapter;