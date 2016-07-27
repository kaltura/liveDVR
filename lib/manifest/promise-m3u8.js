/**
 * Created by elad.benedict on 8/23/2015.
 */

var m3u8Parser = require('../m3u8');
var fs = require('fs');
var Q = require('q');

module.exports.M3U = m3u8Parser.M3U;

/**
 *
 * @param {string or stream} manifestStringOrStream - either a stream containing the M3U8 content or a string.
 * In case a string is supplied without options it is considered to be the path to a local M3U8 file.
 * @param {object} options - in case the 'verbatim' property is set to true, the string passed in manifestStringOrStream
 * will be taken verbatim (i.e. as the content for the M3U8)
 * @returns {*|promise}
 */
module.exports.parseM3U8 = function(manifestStringOrStream, options){

    var getStreamFromInput = function(manifestStringOrStream){
        var d = Q.defer();

        if (manifestStringOrStream.pipe)
        {
            d.resolve(manifestStringOrStream);
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
                d.resolve(s);
            }
            else
            {
                // Value is the M3U8 path
                var stream = fs.createReadStream(manifestStringOrStream);

                // This will wait until we know the readable stream is actually valid before piping
                stream.on('readable', function () {
                    d.resolve(stream);
                });

                // This catches any errors that happen while creating the readable stream (usually invalid names)
                stream.on('error', function(err) {
                    var newErr = new Error("Error reading file " + manifestStringOrStream + " when trying to parse m3u8" + "\n" + err);
                    d.reject(newErr);
                });
            }
        }
        return d.promise;
    };

    var d = Q.defer();

    var streamPromise = getStreamFromInput(manifestStringOrStream);
    streamPromise.then(function(stream){
        var parser = m3u8Parser.createStream();
        parser.on('m3u', function(m3u)
        {
            d.resolve(m3u);
        });

        parser.on('error', function(error)
        {
            d.reject(error);
        });
        stream.pipe(parser);

    }, function(err){
        d.reject(err);
    });

    return d.promise;
};
