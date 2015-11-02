/**
 * Created by elad.benedict on 8/12/2015.
 */

var m3u8Parser = require('./promise-m3u8');
var loggerDecorator = require('./utils/log-decorator');
var qio = require('q-io/fs');
var Q = require('q');
var path = require('path');
var _ = require('underscore');

module.exports = function(outputFolderPath, filename, dvrWindowSize, logger){

    var messageDecoration = function(msg) {
        return "Chunklist manifest generator: " + msg;
    };
    var decoratedLogger = loggerDecorator(logger, messageDecoration);

    var currentManifest;
    var shouldAddDiscontinuityTag = false;

    var manifestFullPath = path.join(outputFolderPath, filename);

    var readCurrentManifest = function readCurrentManifest(){
        return m3u8Parser.parseM3U8(manifestFullPath);
    };

    var writeCurrentManifest = function writeCurrentManifest(){
        logger.debug('Writing manifest ' + manifestFullPath + ': ' + currentManifest.toString());
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
                // A manifest already exists - add a discontinuity tag upon next chunk addition
                // *** Temporarily disabled since our player currently doesn't support this tag **
                shouldAddDiscontinuityTag = false; // should have been true
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
        // 6. Write updated chunklist to disk

        return Q.fcall(function()
        {
            logger.debug('new items to update: ' + _.map(newItems, function(item) { return item.get('uri') + " ";}));
            var originalDuration = currentManifest.get('targetDuration');
            var maxChunkDuration = originalDuration;

            if (shouldAddDiscontinuityTag && newItems.length > 0)
            {
                // Update first item with discontinuity tag
                newItems[0].set('discontinuity', true);
                shouldAddDiscontinuityTag = false;
            }

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
                decoratedLogger.info("Manifest overall duration passed the DVR window size - removing chunks");
                var numberOfRemovedItems = 0;
                while (exceedingAmount > 0)
                {
                    var itemToRemove = currentManifest.items.PlaylistItem.shift();
                    decoratedLogger.debug('Removed ' + itemToRemove.get('uri') + ' with duration ' + itemToRemove.get('duration'));
                    exceedingAmount = exceedingAmount - itemToRemove.get('duration');
                    numberOfRemovedItems++;
                }
                decoratedLogger.info("Removed " + numberOfRemovedItems + " items from the manifest");

                // Update manifest sequence number
                var currentSequenceNumber = currentManifest.get('mediaSequence');
                currentManifest.set('mediaSequence', currentSequenceNumber + numberOfRemovedItems);
            }

            var playlistLength = currentManifest.items.PlaylistItem.length;
            decoratedLogger.debug('Length of currentManifest.items.PlaylistItem: ' + playlistLength);
            if (playlistLength > 0) { // The manifest is not empty
                // Update manifest media sequence duration with maximal #EXTINF (rounded up)
                var chunkWithLongestDuration = _.max(currentManifest.items.PlaylistItem, function(item) {
                    return item.get('duration');
                });


                decoratedLogger.debug("chunkWithLongestDuration: " + JSON.stringify(chunkWithLongestDuration));
                if (chunkWithLongestDuration) { // Some chunk exists
                    currentManifest.set('targetDuration', Math.ceil(chunkWithLongestDuration.get('duration')));
                }
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