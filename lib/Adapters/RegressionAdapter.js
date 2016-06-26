
var Q = require('q');
var _ = require('underscore');
var config = require('../../common/Configuration');
var BaseAdapter=require('./BaseAdapter.js').BaseAdapter;
var StreamInfo=require('./BaseAdapter.js').StreamInfo;
var util=require('util');
var url=require('url');
var http=require('http');
var fs=require('fs');


var regressionAdapterConfig = config.get('regressionAdapter');

function readFile(res,entryId,flavorId,file) {
    fs.readFile(__dirname + "/../../tests/resources/liveSessionData/" + entryId + "/" + flavorId + "/" + file, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
}

var index=1;

var flavorChunklistIndex={};
var httpMock=http.createServer(function(req, res) {
    try {
        var url=req.url;

        var re=/\/(.*)\/(.*)\/(.*)/.exec(url);
        if (re.length===4) {
            var entryId=re[1];
            var flavorId=re[2];
            var path=re[3];
            var fileName=path;

            if (path.indexOf("chunklist.m3u8")>-1) {
                if (flavorChunklistIndex[flavorId]===_.min(flavorChunklistIndex)) {
                    flavorChunklistIndex[flavorId]++;
                }
                fileName=flavorChunklistIndex[flavorId];
            }
            readFile(res,entryId,flavorId,fileName);
        } else {
            res.writeHead(404);
            res.end();
        }
    }catch(e) {

        logger.info("Exception returning response to monitor server", e, e.stack);
    }
}).listen(8888);


function RegressionAdapter() {
    BaseAdapter.call(this);
}

util.inherits(RegressionAdapter,BaseAdapter);

function RegressionStreamInfo(entryId,flavorParamsIds) {
    StreamInfo.call(this,entryId,flavorParamsIds);

}

util.inherits(RegressionStreamInfo,StreamInfo);


RegressionStreamInfo.prototype.getAllFlavors = function() {



    var flavorsObjArray=[];
    var _this=this;

    _.each(this.flavorParamsIds,function(id) {
        flavorChunklistIndex[id]=0;
        flavorsObjArray.push({
            name: id,
            resolution: [640, 480],
            codecs: null,
            bandwidth: 640,
            liveURL: util.format("http://localhost:8888/%s/%s/chunklist.m3u8",_this.entryId, id),
            entryId: _this.entryId
        });
    });


    return Q.resolve(flavorsObjArray);

};

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}



RegressionAdapter.prototype.getLiveEntries=function() {

    return Q.fcall(function() {

             var result = [];
            result.push({
                "entryId": "zzz",
                "flavorParamsIds": "32,33,34",
                "maxChunkCount": regressionAdapterConfig.maxChunkCount,
                getStreamInfo: function () {
                    return new RegressionStreamInfo(this.entryId, this.flavorParamsIds);

                }
            });
            return (result);
    });

}



module.exports = RegressionAdapter;

