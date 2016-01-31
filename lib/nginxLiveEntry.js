/**
 * Created by elad.benedict on 1/22/2016.
 */

var path = require('path');
var _ = require('underscore');
var Q = require('q');

module.exports = (function(){

    var populateFlavorData = function populateFlavorData(fdp, flavorData, flavorVideoData, flavorAudioData, firstClipTime)
    {
        if (fdp.nginxInput_video)
        {
            var clips = fdp.nginxInput_video.sequences[0].clips;
            for (var i=0 ; i<clips.length - 1; i++)
            {
                flavorVideoData.paths.push(clips[i].path);
                flavorVideoData.durations.push(clips[i+1].dts - clips[i].dts);
            }

            flavorVideoData.offset = clips[0].dts - firstClipTime;
            flavorData.clips[0].sources.push(flavorVideoData)
        }

        if (fdp.nginxInput_audio)
        {
            var clips = fdp.nginxInput_audio.sequences[0].clips;
            for (var i=0 ; i<clips.length - 1; i++)
            {
                flavorAudioData.paths.push(clips[i].path);
                flavorAudioData.durations.push(clips[i+1].dts - clips[i].dts);
            }

            flavorAudioData.offset = clips[0].dts - firstClipTime;
            flavorData.clips[0].sources.push(flavorAudioData)
        }

        return flavorData;
    }

    var generateInput = function (flavorDataProviders){
        return Q.fcall(function(){
            var resTemplate = {
                "playlistType": "live",
                "segmentBaseTime": 0,
                "discontinuity": false,
                "durations": [],
                "sequences": []
            }

            var flavorTemplate = {
                "clips": [
                    {
                        "type": "mixFilter",
                        "sources": []
                    }
                ]
            }

            var videoStreamTemplate = {
                "type": "concat",
                "tracks": "v1",
                "paths": [],
                "durations": []
            }

            var audioStreamTemplate = {
                "type": "concat",
                "tracks": "a1",
                "paths": [],
                "durations": []
            }

            var flavorStreamsData = [];

            _.chain(flavorDataProviders)
                .filter(function(fdp){
                    return fdp.nginxInput_audio || fdp.nginxInput_video;
                })
                .each(function(fdp){
                    if (fdp.nginxInput_video) { flavorStreamsData.push(fdp.nginxInput_video)};
                    if (fdp.nginxInput_audio) { flavorStreamsData.push(fdp.nginxInput_audio)};
                });

            var firstClipTime =_.chain(flavorStreamsData)
                .map(function(fsd){ return fsd.firstClipTime; })
                .max()
                .value();

            _.chain(flavorDataProviders)
                .filter(function(fdp){
                    return fdp.nginxInput_audio || fdp.nginxInput_video;
                })
                .each(function(fdp){
                    var flavorData = JSON.parse(JSON.stringify(flavorTemplate));
                    var flavorVideoData = JSON.parse(JSON.stringify(videoStreamTemplate));
                    var flavorAudioData = JSON.parse(JSON.stringify(audioStreamTemplate));
                    var flavorResultData = populateFlavorData(fdp, flavorData, flavorVideoData, flavorAudioData, firstClipTime);
                    resTemplate.sequences.push(flavorResultData);
                })

            var minTotalDuration = _.chain(flavorStreamsData)
                .map(function(fsd){
                    return fsd.sequences[0].clips[fsd.sequences[0].clips.length - 1].dts - firstClipTime;
                })
                .min()
                .value();

            resTemplate.durations.push(minTotalDuration);
            resTemplate.firstClipTime = firstClipTime;

            return resTemplate;
        })
    }

    return {
        generateInput : generateInput
    };
})();
