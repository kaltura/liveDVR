/**
 * Created by elad.benedict on 10/21/2015.
 */

var chunklistManifestGenerator = require('./ChunklistManifestGenerator');
var loggerModule = require('../../common/logger');
var Q = require('q');
var _ = require('underscore');
var PtsAlligner = require('./PtsAlligner');
var config = require('../../common/Configuration');
var universalTimestampPartnersList =config.get("universalTimestampPartnersList");
module.exports = function(downloadedChunksGetter, outputFolderPath, filename, entryObj,  loggerInformation){

    // Since we're working on top of the media server's live stream we need to ensure that:
    // 1. We update our manifest with all the media server's chunks, and in the right order
    // 2. Whenever we add a chunk to the chunklist manifest it is essentially available for download => it should be added to the manifest
    // only if it was already downloaded from the media server. (Keep in mind that a chunk download can fail/take a long time due to temporary network issues)
    // This module ensures that we keep track of all the media server's chunks by keeping them in an intermediate manifest.
    // Once chunks are available they are exposed through the externalized chunklist manifest

    var timeWindowSize = entryObj.dvrWindow;
    var maxChunkCount =  entryObj.maxChunkCount;
    var logger = loggerModule.getLogger("TwoPhasedManifestGenerator", loggerInformation);


    var intermediateManifestDecoratedLogger = loggerModule.getLogger("IntermediateManifestGenerator" ,loggerInformation);
    var externalizedManifestDecoratedLogger = loggerModule.getLogger("ExternalizedManifestGenerator" ,loggerInformation);

    var intermediateManifest = chunklistManifestGenerator(outputFolderPath, filename + '.intermediate', timeWindowSize, maxChunkCount, intermediateManifestDecoratedLogger);
    var externalizedManifest = chunklistManifestGenerator(outputFolderPath, filename, timeWindowSize, maxChunkCount, externalizedManifestDecoratedLogger);
    var universalTimestamp =(universalTimestampPartnersList.indexOf(entryObj.partnerId) > -1); //check if exist on list
    var ptsAligner = new PtsAlligner(outputFolderPath, loggerInformation, universalTimestamp);

    var init = function(){
        return Q.all([intermediateManifest.init(), externalizedManifest.init(), ptsAligner.initialize()]);
    };

    var getCurrentManifest = function() {
        return externalizedManifest.getCurrentManifest();
    };

    var update = function updateChunklist(newItems) {
        var chunksRemovedFromIntermediateManifest;
        return intermediateManifest.update(newItems)
            .then(function(updateResult){
                chunksRemovedFromIntermediateManifest = updateResult.removedChunks;
                return downloadedChunksGetter();
            }).then(function(files) {
                var currentIntermediateManifest = intermediateManifest.getCurrentManifest();
                var consecutiveExistingChunks = getConsecutiveExistingChunks(currentIntermediateManifest, files);
                var currentExternalizedManifest = externalizedManifest.getCurrentManifest();

                // Take only the chunks that already exist on disk and that are not already listed in the manifest
                return getNewChunksToUpdate(currentExternalizedManifest, consecutiveExistingChunks);
            }).then(function(chunksToUpdate) {
                // HACK: Align PTS on the video chunks to avoid player lack of support for discontinuity
                return ptsAligner.process(chunksToUpdate.slice())
                    .then(function () {
                        return externalizedManifest.update(chunksToUpdate);
                    }).then(function(updateResult){
                        return {
                            removedChunks : updateResult.removedChunks,
                            bumpedChunks : chunksRemovedFromIntermediateManifest,
                            newItemsCount : updateResult.newItemsCount
                        };
                    });
            });
    };

    var getNewChunksToUpdate = function(currentExternalizedManifest, consecutiveExistingChunks) {

        var externallyVisibleChunkArray = currentExternalizedManifest.items.PlaylistItem;

        // Use a map to flag which chunks already exist in the externalized manifest
        var alreadyExistingChunks = {};
        _.forEach(currentExternalizedManifest.items.PlaylistItem, function(item) { alreadyExistingChunks[item.get('uri')] = true;});

        // Note: Another hack due to wowza issues - since we may get an invalid duration in the first ts, we were
        // forced to increase the window size in the intermediate manifest so we don't lose previous chunks due to
        // overall time exceeding the allotted window side. This, however, can become an issue in case the window size
        // is small (e.g. live), in which case we may, mistakenly, think that chunks that were already removed should
        // be added again. Hence - we start examining items only after the last item in the externally visible manifest.

        // Get the list of consecutive chunks starting at the last chunk available in the externalized manifest
        var relevantConsecutiveExistingChunks;
        if (externallyVisibleChunkArray.length === 0)
        {
            relevantConsecutiveExistingChunks = consecutiveExistingChunks;
        }
        else
        {
            var existingChunkUris = _.map(consecutiveExistingChunks, function(x) { return x.get('uri');});
            var locationToFilterFrom = _.indexOf(existingChunkUris, _.last(externallyVisibleChunkArray).get('uri'));
            relevantConsecutiveExistingChunks = _.rest(consecutiveExistingChunks, locationToFilterFrom);
        }

        var result = _.filter(relevantConsecutiveExistingChunks, function(chunk) {
            return !alreadyExistingChunks[chunk.get('uri')];
        });

        if (logger.isDebugEnabled) {
            logger.debug("relevant chunks to update: %j", _.map(result, function (item) {
                return item.get('uri');
            }));
        }

        return result;
    };

    var remove = function remove(){
        return Q.all([intermediateManifest.remove(), externalizedManifest.remove()]);
    }

    var getConsecutiveExistingChunks = function (manifest, fileListMap) {
        for (var i=0; i < manifest.items.PlaylistItem.length; i++) {
            if (!fileListMap[manifest.items.PlaylistItem[i].get('uri')]) {
                break;
            }
        }

        // i now holds the number of consecutive existing chunks
        return _.first(manifest.items.PlaylistItem, i);
    };

    return {
        init : init,
        update : update,
        getCurrentManifest : getCurrentManifest,
        remove : remove
    };
};