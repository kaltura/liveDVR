
var Q = require('q');
var _ = require('underscore');
var config = require('../../common/Configuration');
var BaseAdapter=require('./BaseAdapter.js').BaseAdapter;
var StreamInfo=require('./BaseAdapter.js').StreamInfo;
var util=require('util');
var m3u8Parser = require('./../manifest/promise-m3u8');
var networkClient = require('./../NetworkClientFactory').getNetworkClient();
var url=require('url');
var logger =  require('../../common/logger').getLogger("TestAdapter");

var simulateStreams = config.get('simulateStreams');
var overrideOldRecordedHLS = config.get('overrideOldRecordedHLS');
var preserveOriginalHLS = parseInt(config.get('preserveOriginalHLS').runDurationInMinutes);


function TestAdapter() {
    BaseAdapter.call(this);
    this.setRunEndTimer();
}

util.inherits(TestAdapter,BaseAdapter);

TestAdapter.prototype.setRunEndTimer = function() {

    var that = this;
    var durationMillisec = 60000 * preserveOriginalHLS;

    setTimeout((function(duration) {
        return () =>
        {
            logger.info('recording ended (duration: %s minutes). LiveController will exit gracefully.', duration/60000);
            that.gracefullyExit(0);
        }
    })(durationMillisec), durationMillisec);

}

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

            return m3u8Parser.parseM3U8(content.body, {'verbatim': true}).then(function (m3u8) {


                var result = [];
                let extension = overrideOldRecordedHLS === true || (!simulateStreams.firstIndex) ? 1: simulateStreams.firstIndex;
                let path = simulateStreams.path ? simulateStreams.path : simulateStreams.entryId;
                for (let i = 0; i < simulateStreams.count; i++) {

                    var flavors={};
                    _.each(m3u8.items.StreamItem,function(streamItem,i) {

                            var chunkListUrl = url.resolve(simulateStreams.wowzaUrl, streamItem.properties.uri);
                            flavors[i+1]= {
                                streamItem: streamItem,
                                url: chunkListUrl
                            }

                    });
                    result.push({
                        "entryId": util.format('%s-%d',path, extension),
                        "flavorParamsIds": _.keys(flavors).join(","),
                        "maxChunkCount": simulateStreams.maxChunkCount,
                        "serverType": 0,
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

