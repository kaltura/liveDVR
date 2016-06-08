/**
 * Created by igors on 3/26/16.
 */
var MP4WriteStream = require('../../../lib/MP4WriteStream');
var fs = require('fs');
var util = require('util');

var consoleLogger = {
    debug: console.log,
    info: console.log,
    warn: console.log,
    error: console.log
};

var fileList = [
    __dirname+'/../resources/media-uixh2a1qh_w1892051821_476.ts',
    __dirname+'/../resources/media-uixh2a1qh_w1892051821_477.ts',
    __dirname+'/../resources/media-uixh2a1qh_w1892051821_478.ts',
    __dirname+'/../resources/media-uixh2a1qh_w1892051821_479.ts',
    __dirname+'/../resources/media-uixh2a1qh_w1892051821_480.ts'
];

var processchunk = function(tsPath,cbDone) {
    var readable = fs.createReadStream(tsPath);
    var ts2mp4 = new MP4Writer(tsPath, consoleLogger);
    readable.pipe(ts2mp4)
        .on('data', function (chunk) {
            consoleLogger.debug("data " + chunk.length);
        })
        .on('end', function (fileInfo) {
            consoleLogger.info("end");
            cbDone(fileInfo);
        })
        .on('error', function (err) {
            consoleLogger.warn(err);
        });
};

var palylist = [];

var processNextChunk = function processNextChunk() {
    if(fileList.length) {
        var path = fileList.splice(0,1);
        processchunk(path[0], function (fi) {
            palylist.push(fi);
            processNextChunk();
        });
    } else {
        palylist.reduce( function(val,fi,index){
            consoleLogger.info("fi[%d]=",index,util.inspect(fi));
            var minDTS = Math.min(fi.videoFirstDTS, fi.audioFirstDTS),
                maxDTS = Math.max(fi.videoFirstDTS + fi.videoDuration, fi.audioFirstDTS + fi.audioDuration);
            if(val && val !== minDTS ) {
               consoleLogger.info("lastDTS=%d diff=%d ms", val, minDTS - val);
            }
            return maxDTS;
        },undefined);
    }
}();

