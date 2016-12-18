var config = require('../../../common/Configuration');
const preserveOriginalHLS = config.get('preserveOriginalHLS');
preserveOriginalHLS.enable = false;
config.set('preserveOriginalHLS',preserveOriginalHLS);
var MP4WRITER = require('../../../lib/MP4WriteStream');
var fs = require('fs');
var http = require('http');
var Url = require('url');
var _ = require('underscore');
var util = require('util');

var tsFilePath = process.argv[2];//'/Users/igors/media-u4cc7m30h_b1496000_3383.ts';//"/Users/igors/dvr/dvrContentRootPath/1_abc123/1/media-ul0o1lom6_w1600782441_670.ts.mp4_saved.ts";//__dirname+'/../resources/media-uixh2a1qh_w1892051821_472.ts';
var httpPath = 'http://localhost/wn/media-uhe4wm3o6_b475136_144354218.ts';
console.log("tsFilePath=",tsFilePath);
var ts2mp4 = new MP4WRITER.MP4WriteStream(tsFilePath, "");

var origUrl = {
    'http:': function (url, cb) {
        var req = http.get(url);
        req.on('error', function (err) {
            console.log(err);
        });
        req.on('response', function (responce, error) {
            if (error) {
                req.emit('error', error);
                return;
            }
            cb(response);
            req.end();
        });
    },
    'file:': function (url, cb) {
        var rs = fs.createReadStream(url.path);
        cb(rs);
    }
};


var createPipe = function(url,cb){
    var resolved = Url.parse(url);
    return origUrl[resolved.protocol ? resolved.protocol : 'file:'](resolved,cb);

};


createPipe( tsFilePath, function(readable) {
    readable.pipe(ts2mp4)
        .on('data', function (chunk) {
            console.log("data " + chunk.length);
        })
        .on('end', function (fileInfo) {
            console.log("end: %j",util.inspect(fileInfo));
        })
        .on('error', function (err) {
            console.log( "%s chunk %s", err, err.chunkName);
        });
});
