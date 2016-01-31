/**
 * Created by elad.benedict on 1/5/2016.
 */

var path = require('path');
var _ = require('underscore');

module.exports = function(){
    var offset = 0;
    var initialCorrection = 0;
    var wrapAroundCounter = 0; // The number of times we wrapped-around
    var wrapAroundValue = Math.pow(2,33);
    var chunksDtsData = {};

    var updateChunkDtsData = function(chunkData, currentManifest){
        for (var i=0 ; i < currentManifest.items.PlaylistItem.length ; i++)
        {
            var chunkName = currentManifest.items.PlaylistItem[i].get('uri');

            if (!(chunksDtsData[chunkName]))
            {
                chunksDtsData[chunkName] = {
                    videoDts : initialCorrection + chunkData[chunkName].videoStartPtsInMillis + wrapAroundCounter * wrapAroundValue,
                    audioDts : initialCorrection + chunkData[chunkName].audioStartPtsInMillis + wrapAroundCounter * wrapAroundValue
                };
            }

            if (i > 0) {
                var previousChunkName = currentManifest.items.PlaylistItem[i - 1].get('uri');

                // Wraparound. Ensure update is done exactly once per wraparound by inspecting the calculated dts value
                if ((chunksDtsData[chunkName].videoDts < chunksDtsData[previousChunkName].videoDts) ||
                    (chunksDtsData[chunkName].audioDts < chunksDtsData[previousChunkName].audioDts))
                {
                    wrapAroundCounter++;
                    chunksDtsData[chunkName].videoDts += wrapAroundValue;
                    chunksDtsData[chunkName].audioDts += wrapAroundValue;
                }
            }
        }
    }

    var generateInput = function (chunksData, contentFolder, currentManifest){

        var firstChunkName = currentManifest.items.PlaylistItem[0].get('uri');
        var firstChunkData = chunksData[firstChunkName];

        if (initialCorrection === 0) {
            initialCorrection = firstChunkData.downloadTime - firstChunkData.videoStartPtsInMillis;
        }

        updateChunkDtsData(chunksData, currentManifest);

        var resTemplate = {
            "playlistType": "live",
            "discontinuity": false,
            "segmentBaseTime": 0,
            "durations": [],
            "offset" : 0,
            "sequences": [
                {
                    "clips": [
                    ]
                }
            ]
        }

        var audioRes = JSON.parse(JSON.stringify(resTemplate));
        var videoRes = JSON.parse(JSON.stringify(resTemplate));

        _.each(currentManifest.items.PlaylistItem, function(chunk){
            var chunkName = chunk.get('uri');
            var mp4ChunkName = chunkName.replace('.ts', '.mp4');
            var chunkData = chunksData[chunkName];

            audioRes.sequences[0].clips.push({
                "type": "source",
                "path": path.join(contentFolder, mp4ChunkName),
                "dts" : chunksDtsData[chunkName].audioDts
            })

            videoRes.sequences[0].clips.push({
                "type": "source",
                "path": path.join(contentFolder, mp4ChunkName),
                "dts" : chunksDtsData[chunkName].videoDts
            })
        })

        videoRes.firstClipTime = chunksDtsData[firstChunkName].videoDts;
        audioRes.firstClipTime = chunksDtsData[firstChunkName].audioDts;

        return {
            audio : audioRes,
            video : videoRes
        }
    }

    return {
        generateInput : generateInput,
        offset : offset
    };
}
