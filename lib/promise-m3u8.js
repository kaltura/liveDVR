/**
 * Created by elad.benedict on 8/23/2015.
 */

var m3u8Parser = require('m3u8');
var fs = require('fs');
var Q = require('q');

module.exports.M3U = m3u8Parser.M3U;

module.exports.parseM3U8 = function(manifestStringOrStream, options){

    var stream;
    if (manifestStringOrStream.pipe)
    {
        stream = manifestStringOrStream;
    }
    else
    {
        if (options && options.verbatim)
        {
            // Use value verbatim
            var Readable = require('stream').Readable;
            var s = new Readable();
            s.push(manifestStringOrStream);
            s.push(null); // Stream end
            stream = s;
        }
        else
        {
            // Value is the M3U8 path
            stream = fs.createReadStream(manifestStringOrStream);
        }
    }

    var parser = m3u8Parser.createStream();
    var d = Q.defer();

    parser.on('m3u', function(m3u)
    {
        d.resolve(m3u);
    });

    parser.on('error', function(error)
    {
        d.reject(error);
    });

    stream.pipe(parser);
    return d.promise;
};
