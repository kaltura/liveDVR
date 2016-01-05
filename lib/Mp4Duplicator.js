/**
 * Created by elad.benedict on 1/5/2016.
 */

var shell = require('shelljs');
var _ = require('underscore');
var os = require('os');
var Q = require('q');
var util = require('util');
var path = require('path');
var config = require('../common/Configuration');

module.exports = (function(){

    var commandTemplate = '%s -i %s -acodec copy -bsf:a aac_adtstoasc -vcodec copy -flags global_header -f mp4 -y %s'

    var process = function(chunks){

        var processSingleChunk = function(chunkPath)
        {
            var ffmpegPath = config.get('ffmpegPath') || 'ffmpeg.exe';
            var newFilePath = chunkPath.replace('.ts','.mp4');
            var d = Q.defer();
            var command = util.format(commandTemplate, ffmpegPath, chunkPath, newFilePath);
            shell.exec(command, function(code) {
                if (code !== 0)
                {
                    d.reject("Exit code is " + code);
                }
                d.resolve();
            })
            return d.promise;
        }

        var conversionPromises = _.map(chunks, function(c){
            return processSingleChunk(c);
        })
        return Q.all(conversionPromises);
    }

    return {
        process : process
    }

})();