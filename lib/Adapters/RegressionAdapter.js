
var Q = require('q');
var _ = require('underscore');
var config = require('../../common/Configuration');
var BaseAdapter=require('./BaseAdapter.js').BaseAdapter;
var StreamInfo=require('./BaseAdapter.js').StreamInfo;
var util=require('util');
var url=require('url');
var http=require('http');
var fs=require('fs');
var networkClient = require('./../NetworkClientFactory').getNetworkClient();

var m3u8Handler = require('../manifest/promise-m3u8');
var basePath=__dirname + "/../../tests/resources/liveSessionData/";

var regressionAdapterConfig = config.get('regressionAdapter');

if (!regressionAdapterConfig || !regressionAdapterConfig.enable) {
    return;
}

function readFile(res,entryId,flavorId,file) {
    fs.readFile(basePath + entryId + "/" + flavorId + "/" + file, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
}

function validateFlavor(entryId,flavorId) {

    var url=util.format("http://localhost:8080/kLive/smil:%s_all.smil/%s/chunklist.m3u8",entryId,flavorId);
    return networkClient.read({ url: url, timeout: 10000 }).then(function(content) {
        return m3u8Handler.parseM3U8(content,{ verbatim: true})
    }).then(function (m3u8) {
        console.warn(m3u8);
    }).catch (function(e) {
        console.warn(e);
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

            var validate=false;

            if (path.indexOf("chunklist.m3u8")>-1) {
                if (flavorChunklistIndex[flavorId]===_.min(flavorChunklistIndex)) {
                    flavorChunklistIndex[flavorId]++;
                    validate=true;
                }
                fileName=flavorChunklistIndex[flavorId];
            }

            var p= Q.resolve();
            if (validate) {
                p=validateFlavor(entryId, flavorId);
            }

            p.finally(function() {
                readFile(res,entryId,flavorId,fileName);
            });
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
                "flavorParamsIds": "32",
                "serverType": 0,
                getStreamInfo: function () {
                    return new RegressionStreamInfo(this.entryId, this.flavorParamsIds);

                }
            });
            return (result);
    });

}



module.exports = RegressionAdapter;

