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
        var ffProbePath = config.get('ffProbePath') || 'ffprobe.exe';
        var command = util.format(commandTemplate, ffProbePath, chunkPath);
        shell.exec(command, function(code, output) {
            if (code !== 0)
            {
                d.reject("Exit code is " + code);
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

            if (!videoStream.duration)
            {
                throw new Error("No video duration found");
            }

            return {
                audioLength : audioStream ? audioStream.duration : 0,
                videoLength : videoStream.duration
            }
        })
    }

    return {
        extractChunkAudioVideoDuration : extractChunkAudioVideoDuration
    }

})();