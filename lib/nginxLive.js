/**
 * Created by elad.benedict on 1/5/2016.
 */

var path = require('path');
var _ = require('underscore');

module.exports = function(){
    var offset = 0;
    var firstChunkTime;
    var generateInput = function (chunksData, contentFolder, currentManifest){

        if (this.offset === 0) {
            firstChunkTime = chunksData[currentManifest.items.PlaylistItem[0].get('uri')].downloadTime;
        }

        var resTemplate = {
            "playlistType": "live",
            "discontinuity": false,
            "segmentBaseTime": 0,
            "firstClipTime": Math.floor((firstChunkTime + this.offset) * 1000),
            "durations": [],
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
            var audioDuration = chunkData.audioLength;
            var videoDuration = chunkData.videoLength;
            audioRes.durations.push(audioDuration);
            audioRes.sequences[0].clips.push({
                "type": "source",
                "path": path.join(contentFolder, mp4ChunkName)
            })

            videoRes.durations.push(videoDuration);
            videoRes.sequences[0].clips.push({
                "type": "source",
                "path": path.join(contentFolder, mp4ChunkName)
            })
        })

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
