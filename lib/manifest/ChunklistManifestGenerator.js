/**
 * Created by elad.benedict on 8/12/2015.
 */

var m3u8Parser = require('./promise-m3u8');
var loggerDecorator = require('./../utils/log-decorator');
var qio = require('q-io/fs');
var Q = require('q');
var path = require('path');
var fsUtils = require('./../utils/fs-utils');
var _ = require('underscore');

module.exports = function(outputFolderPath, filename, timeWindowSize, maxChunkCount, logger){

    timeWindowSize = timeWindowSize || Number.MAX_VALUE;
    maxChunkCount = maxChunkCount || Number.MAX_VALUE;

    var decoratedLogger = loggerDecorator(logger, "Chunklist manifest generator: ");

    var currentManifest;
    var shouldAddDiscontinuityTag = false;

    var manifestFullPath = path.join(outputFolderPath, filename);

    var readCurrentManifest = function readCurrentManifest(){
        return m3u8Parser.parseM3U8(manifestFullPath);
    };

    var remove = function remove(){
        return qio.rename(manifestFullPath, manifestFullPath + '.removed');
    }

    var writeCurrentManifest = function writeCurrentManifest(){
        return fsUtils.writeFileAtomically(manifestFullPath, currentManifest.toString());
    };

    // Generate an empty M3U8 or read the existing manifest from disk
    var init = function init()
    {
        var manifestPath = path.join(outputFolderPath, filename);
        return fsUtils.existsAndNonZero(manifestPath).then(function(result)
        {
            var currentManifest;
            if (!result) {
                currentManifest = createEmptyM3U8();
                return fsUtils.writeFileAtomically(manifestPath, currentManifest.toString()).then(function()
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
        var result = {
            removedChunks : [],
            newItemsCount: newItems.length
        };

        return Q.fcall(function()
        {
            var itemToRemove, i;

            logger.debug('new items to update: ' + _.map(newItems, function(item) { return item.get('uri') + " ";}));

            // Ignore any items that are already available in the manifest
            if (currentManifest.items.PlaylistItem.length > 0) {
                var lastItemInCurrentManifest = _.last(currentManifest.items.PlaylistItem);
                var indexToStartFrom = _.indexOf(_.map(newItems, function (item) {
                    return item.get('uri');
                }), lastItemInCurrentManifest.get('uri'));
                if (indexToStartFrom >= 0) {
                    for (i = 0; i <= indexToStartFrom; i++) {
                        itemToRemove = newItems.shift();
                        logger.info('item at index ' + i + ' - ' + itemToRemove.get('uri') + ' already appears in manifest - ignoring it');
                    }
                }
            }

            if (newItems.length === 0)
            {
                // No new items
                logger.debug("No new chunks to update");
                return false;
            }

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
            var exceedingAmount = totalDuration - timeWindowSize;
            if (exceedingAmount > 0)
            {
                decoratedLogger.info("Manifest overall duration passed the DVR window size - removing chunks");
                while (exceedingAmount > 0)
                {
                    itemToRemove = currentManifest.items.PlaylistItem.shift();
                    decoratedLogger.debug('Removed %s with duration %s' ,itemToRemove.get('uri') , itemToRemove.get('duration'));
                    exceedingAmount = exceedingAmount - itemToRemove.get('duration');
                    result.removedChunks.push(itemToRemove);
                }
            }

            // Remove items exceeding the chunk count
            var manifestLength = currentManifest.items.PlaylistItem.length;
            if (manifestLength > maxChunkCount)
            {
                decoratedLogger.info("Manifest chunk count exceeded the allowed chunk limit - removing chunks");
                var chunksToRemove = manifestLength - maxChunkCount;
                for (i=0 ; i<chunksToRemove ; i++)
                {
                    itemToRemove = currentManifest.items.PlaylistItem.shift();
                    result.removedChunks.push(itemToRemove);
                    decoratedLogger.debug('Removed %s  with duration  %s' ,itemToRemove.get('uri'), itemToRemove.get('duration'));
                }
            }

            decoratedLogger.info("Removed %d items from the manifest",result.removedChunks.length );

            // Update manifest sequence number
            var currentSequenceNumber = currentManifest.get('mediaSequence');
            currentManifest.set('mediaSequence', currentSequenceNumber + result.removedChunks.length);

            var playlistLength = currentManifest.items.PlaylistItem.length;
            decoratedLogger.debug('Length of currentManifest.items.PlaylistItem: %d' , playlistLength);
            if (playlistLength > 0) { // The manifest is not empty
                // Update manifest media sequence duration with maximal #EXTINF (rounded up)
                var chunkWithLongestDuration = _.max(currentManifest.items.PlaylistItem, function(item) {
                    return item.get('duration');
                });

                decoratedLogger.debug("chunkWithLongestDuration: %j" ,chunkWithLongestDuration);
                if (chunkWithLongestDuration) { // Some chunk exists
                    currentManifest.set('targetDuration', Math.ceil(chunkWithLongestDuration.get('duration')));
                }
            }
            return true;
        }).then(function(manifestChanged){
            if (manifestChanged)
            {
                return writeCurrentManifest();
            }
        }).then(function(){
            return result;
        });
    };

    var getCurrentManifest = function getCurrentManifest()
    {
        return currentManifest;
    };

    return {
        init : init,
        update : update,
        getCurrentManifest : getCurrentManifest,
        remove : remove
    };
};