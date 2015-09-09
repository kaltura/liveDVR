/**
 * Created by elad.benedict on 8/12/2015.
 */

var m3u8Parser = require('./promise-m3u8');
var qio = require('q-io/fs');
var Q = require('Q');
var path = require('path');
var _ = require('underscore');
var logger = require('./logger/logger');

module.exports = function(outputFolderPath, filename, dvrWindowSize){

    var currentManifest;

    var manifestFullPath = path.join(outputFolderPath, filename);

    var readCurrentManifest = function readCurrentManifest(){
        return m3u8Parser.parseM3U8(manifestFullPath);
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
        // 2. Add discontinuity if relevant - TODO
        // 3. Append chunks
        // 4. Update media sequence number
        // 5. Add EXT-X-ENDLIST if relevant - TODO
        // 6. Write updated chunklist to disk

        return Q.fcall(function()
        {
            var originalDuration = currentManifest.get('targetDuration');
            var maxChunkDuration = originalDuration;

            // Add new items
            _.forEach(newItems, function(item)
            {
                var itemDuration = item.get('duration');
                if (itemDuration > maxChunkDuration){
                    maxChunkDuration = itemDuration;
                }
                currentManifest.addItem(item);
            });

            // Remove items exceeding the DVR window size
            var totalDuration = currentManifest.totalDuration();
            var exceedingAmount = totalDuration - dvrWindowSize;
            if (exceedingAmount > 0)
            {
                logger.info("Manifest overall duration passed the DVR window size - removing chunks");
                var numberOfRemovedItems = 0;
                while (exceedingAmount > 0)
                {
                    var itemToRemove = currentManifest.items.PlaylistItem.shift();
                    exceedingAmount = exceedingAmount - itemToRemove.get('duration');
                    numberOfRemovedItems++;
                }
                logger.info("Removed " + numberOfRemovedItems + " items from the manifest");

                // Update manifest sequence number
                var currentSequenceNumber = currentManifest.get('mediaSequence');
                currentManifest.set('mediaSequence', currentSequenceNumber + numberOfRemovedItems);
            }

            // Update manifest media sequence duration with maximal #EXTINF (rounded up)
            var chunkWithLongestDuration = _.max(currentManifest.items.PlaylistItem, function(item) {
                return item.get('duration');
            });

            if (chunkWithLongestDuration) { // Some chunk exists
                currentManifest.set('targetDuration', Math.ceil(chunkWithLongestDuration.get('duration')));
            }
        }).then(function(){
            return writeCurrentManifest();
        });
    };

    var getCurrentManifest = function getCurrentManifest()
    {
        return currentManifest;
    };

    return {
        init : init,
        update : update,
        getCurrentManifest : getCurrentManifest
    };
};