/**
 * Created by elad.benedict on 8/12/2015.
 */

var m3u8Parser = require('m3u8');
var qio = require('q-io/fs');
var Q = require('Q');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');

module.exports = function(outputFolderPath, filename){

    var currentManifest;

    var manifestFullPath = path.join(outputFolderPath, filename);

    var readCurrentManifest = function readCurrentManifest(){
        var parser = m3u8Parser.createStream();
        var variantFile = fs.createReadStream(manifestFullPath);
        var d = Q.defer();

        parser.on('m3u', function(m3u)
        {
            d.resolve(m3u);
        });

        parser.on('error', function(error)
        {
            d.reject(error);
        });

        variantFile.pipe(parser);

        return d.promise;
    };

    var writeCurrentManifest = function writeCurrentManifest(){
        return qio.write(manifestFullPath, currentManifest.toString());
    };

    // Generate an empty M3U8 or read the existing manifest from disk
    var init = function init()
    {
        var manifestPath = path.join(outputFolderPath, filename);
        return qio.exists(manifestPath).then(function(result)
        {
            var currentManifest;
            if (!result) {
                currentManifest = createEmptyM3U8();
                return qio.write(manifestPath, currentManifest.toString()).then(function()
                {
                    return currentManifest;
                });
            }
            else
            {
                return readCurrentManifest();
            }
        }).then(function(manifest)
        {
            // Update in-memory manifest
            currentManifest = manifest;
            return currentManifest;
        });
    };

    var createEmptyM3U8 = function createEmptyM3U8()
    {
        var manifest = new m3u8Parser.M3U();
        manifest.set("allowCache", "NO");
        manifest.set("version", 3);
        manifest.set("mediaSequence", 0);
        manifest.set("targetDuration", 0);
        return manifest;
    };

    var update = function updateChunklist(newItems) {

        // 1. Read or create chunklist
        // 2. Add discontinuity if relevant
        // 3. Append chunks
        // 4. Update media sequence number
        // 5. Add EXT-X-ENDLIST if relevant

        // 1. Get current M3U8
        // 2. Update with new chunks
        // 3. Write to disk

        return Q.fcall(function()
        {
            _.forEach(newItems, function(item)
            {
                currentManifest.addItem(item);
            });
        }).then(function(){
            return writeCurrentManifest();
        });
    };

    return {
        init : init,
        update : update
    };
};