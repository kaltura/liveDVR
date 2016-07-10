
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

function TestStreamInfo(entryId,flavors) {

    StreamInfo.call(this,entryId, _.keys(flavors).join(","));
    this.flavors=flavors;

}

util.inherits(TestStreamInfo,StreamInfo);


TestStreamInfo.prototype.getAllFlavors = function() {

    var _this=this;

    var flavorsObjArray=[];
    _.each(this.flavors,function(flavor,key) {

        var streamUrl =  flavor.url;
        if (simulateStreams.useNginx) {
            streamUrl = "http://localhost:2000/entry/" + _this.entryId + "/origin/" + flavor.url.slice(7);
        }
        flavorsObjArray.push( {
            name : key,
            resolution: flavor.streamItem.attributes.attributes.resolution,
            codecs: flavor.streamItem.attributes.attributes.codecs,
            bandwidth: flavor.streamItem.attributes.attributes.bandwidth,
            liveURL : streamUrl,
            entryId : _this.entryId
        });
    });


    return Q.resolve(flavorsObjArray);

};

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}



TestAdapter.prototype.getLiveEntries=function() {


    var _this=this;

    if (this.cache) {
        return Q.resolve(this.cache);
    }
    return networkClient.read(simulateStreams.wowzaUrl)
        .then(function(content) {

            return m3u8Parser.parseM3U8(content, {'verbatim': true}).then(function (m3u8) {


                var result = [];
                for (var i = 0; i < simulateStreams.count; i++) {

                    var flavors={};
                    _.each(_.first(m3u8.items.StreamItem,1),function(streamItem,index) {

                            var chunkListUrl = url.resolve(simulateStreams.wowzaUrl, streamItem.properties.uri);
                            flavors[index+1]= {
                                streamItem: streamItem,
                                url: chunkListUrl
                            }

                    });
                    result.push({
                        "entryId": simulateStreams.entryId,
                        "flavorParamsIds": _.keys(flavors).join(","),
                        "maxChunkCount": simulateStreams.maxChunkCount,
                        "playWindow": simulateStreams.playWindow,
                        getStreamInfo: function () {
                            return new TestStreamInfo(this.entryId, flavors);

                        }
                    });
                }
                _this.cache = result;
                return Q.resolve(result);
            });

        });


}



module.exports = TestAdapter;

