
var Q = require('q');
var _ = require('underscore');
var config = require('../../common/Configuration');
var BaseAdapter=require('./BaseAdapter.js').BaseAdapter;
var StreamInfo=require('./BaseAdapter.js').StreamInfo;
var util=require('util');
var m3u8Parser = require('./../manifest/promise-m3u8');
var networkClient = require('./../NetworkClientFactory').getNetworkClient();
var url=require('url');

var simulateStreams = config.get('simulateStreams');

function TestAdapter() {
    BaseAdapter.call(this);
}

util.inherits(TestAdapter,BaseAdapter);

function TestStreamInfo(entryId,flavorParamsIds,wowzaUrl,streamItem) {

    StreamInfo.call(this,entryId,flavorParamsIds);
    this.streamItem=streamItem;
    this.nginxUrl="http://localhost:2000/entry/"+this.entryId+"/origin/"+wowzaUrl.slice(7);
}

util.inherits(TestStreamInfo,StreamInfo);


TestStreamInfo.prototype.getAllFlavors = function() {


    var flavorsObjArray=[{
                name : "1",
                resolution: this.streamItem.attributes.attributes.resolution,
                codecs: this.streamItem.attributes.attributes.codecs,
                bandwidth: this.streamItem.attributes.attributes.bandwidth,
                liveURL : this.nginxUrl,
                entryId : this.entryId
            }];


    return Q.resolve(flavorsObjArray);

};

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}



TestAdapter.prototype.getLiveEntries=function() {



    if (this.cache) {
        return Q.resolve(this.cache);
    }
    return networkClient.read(simulateStreams.wowzaUrl)
        .then(function(content) {

            return m3u8Parser.parseM3U8(content, {'verbatim': true}).then(function (m3u8) {


                var streamItem=m3u8.items.StreamItem[0];

                var chunkListUrl = url.resolve(simulateStreams.wowzaUrl, streamItem.properties.uri);

                var result = [];
                for (var i = 0; i <simulateStreams.count; i++) {
                    result.push({
                        "entryId": "abc" + i.pad(3),
                        "flavorParamsIds": "1",
                        "maxChunkCount": simulateStreams.maxChunkCount,
                        getStreamInfo: function () {
                            return new TestStreamInfo(this.entryId, this.flavorParamsIds, chunkListUrl,streamItem);

                        }
                    });
                }
                this.cache = result;
                return Q.resolve(result);
            });

        });


}



module.exports = TestAdapter;

