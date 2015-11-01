/**
 * Created by elad.benedict on 11/1/2015.
 */

var qio = require('q-io/fs');
var path = require('path');
var appDir = path.dirname(require.main.filename);
var os = require('os');
var platform = (os.platform() === 'win32' || os.platform() === 'win64') ? 'win' : 'linux';
var nativePtsAligner = require(path.join(appDir, '..', 'bin', platform, 'TsRebase.node'));
var Q = require('q');

var PtsAlligner = (function(){

    function PtsAlligner(folderPath, logger){
        this.initialized = false;
        this.folderPath = folderPath;
        this.logger = logger;
    }

    var alignPts = function(chunkList){
        var that = this;
        if (chunkList.length === 0)
        {
            return;
        }

        var chunkToProcess = chunkList.shift();
        var filenameToProcess = chunkToProcess.get('uri');
        that.logger.debug("About to align PTS for " + filenameToProcess);

        var singleFileAlignmentPromise =
            qio.read(path.join(that.folderPath, filenameToProcess), "b") // Read binary data into a buffer
                .then(function(dataBuffer){
                    that.logger.debug("Old PTS alignment context: " + JSON.stringify(that.context));
                    var chunkDuration = nativePtsAligner.rebaseTs(that.context, dataBuffer); // Context is changed in place
                    chunkToProcess.set('duration', chunkDuration/90000);
                    that.logger.debug("New PTS alignment context: " + JSON.stringify(that.context));
                    that.logger.debug("Completed PTS alignment for " + filenameToProcess);
                });

        return singleFileAlignmentPromise.then(function(){
            return alignPts.call(that, chunkList); // Recursively process the rest of the list
        });
    };

    PtsAlligner.prototype.initialize = function(){
        this.initialized = true;
        this.contextFilePath = path.join(this.folderPath, 'ptsAlignmentContext');
        var that = this;
        return qio.exists(that.contextFilePath)
            .then(function(exists){
                if (exists)
                {
                    return qio.read(that.contextFilePath)
                        .then(function(content){
                            that.logger.info("Previous context found: " + content);
                            return JSON.parse(content);
                        });
                }
                else
                {
                    that.logger.info("No previous context found - starting anew");
                    return {};
                }
            }).then(function(context){
                that.context = context;
            });
    };

    PtsAlligner.prototype.process = function(chunkList) {
        var that = this;
        return Q.fcall(function(){
            if (!that.initialized)
            {
                return that.initialize();
            }
        }).then(function(){
            return alignPts.call(that, chunkList);
        }).then(function(){
            return qio.write(that.contextFilePath, JSON.stringify(that.context));
        });
    };

    return PtsAlligner;

})();



module.exports = PtsAlligner;