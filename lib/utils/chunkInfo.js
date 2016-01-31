/**
 * Created by elad.benedict on 1/5/2016.
 */

var shell = require('shelljs');
var _ = require('underscore');
var os = require('os');
var Q = require('q');
var util = require('util');
var path = require('path');
var config = require('../../common/Configuration');

module.exports = (function(){

    var commandTemplate = '%s -i %s -show_format -show_streams -print_format json -v quiet'

    var extractChunkInfo = function(chunkPath){
        var d = Q.defer();
        var ffProbePath = config.get('ffprobePath') || 'ffprobe.exe';
        var command = util.format(commandTemplate, ffProbePath, chunkPath);
        shell.exec(command, function(code, output) {
            if (code !== 0)
            {
                d.reject("Exit code is " + code + " ; output is: " + output);
            }

            try {
                var result = JSON.parse(output)
                d.resolve(result);
            }
            catch(err){
                d.reject(err);
            }
        })
        return d.promise;
    }

    var extractChunkAudioVideoDuration = function(chunkPath)
    {
        return extractChunkInfo(chunkPath).then(function(chunkData){
            var videoStream = _.chain(chunkData.streams).filter(function(s){
                return s.codec_type === 'video';
            }).first().value();

            var audioStream = _.chain(chunkData.streams).filter(function(s){
                return s.codec_type === 'audio';
            }).first().value();

            return {
                audioLength : audioStream ? Math.round(parseFloat(audioStream.duration)*1000) : 0,
                videoLength : videoStream ? Math.round(parseFloat(videoStream.duration)*1000) : 0,
                audioStreamStartTime : audioStream ? Math.round(parseFloat(audioStream.start_time)*1000) : 0,
                videoStreamStartTime : videoStream ? Math.round(parseFloat(videoStream.start_time)*1000) : 0,
                videoStartPtsInMillis :  videoStream ? Math.round(videoStream.start_pts/90) : 0,
                audioStartPtsInMillis :  audioStream ? Math.round(audioStream.start_pts/90) : 0,
            }
        })
    }

    return {
        extractChunkAudioVideoDuration : extractChunkAudioVideoDuration
    }

})();