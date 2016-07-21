/**
 * Created by elad.benedict on 11/1/2015.
 */

var qio = require('q-io/fs');
var path = require('path');
var os = require('os');
var Q = require('q');
var fsUtils = require('./../utils/fs-utils');
var config = require('../../common/Configuration');
var loggerModule = require('../../common/logger');
var PtsAlligner = (function(){

    function getArchAndPlatform()
    {
        if (os.platform() === 'win32')
        {
            if (os.arch() === 'x64')
            {
                return "win64";
            }
            else
            {
                return "win32";
            }
        } else if (os.platform() === 'darwin') {
            return "darwin";
        }
        else
        {
            return "linux";
        }
    }

    var nativePtsAligner = require(path.join(__dirname, '../..', 'bin', getArchAndPlatform(), 'TsRebase.node'));

    function PtsAlligner(folderPath, loggerInfo, universalTimestamp){
        this.universalTimestamp = universalTimestamp;
        this.initialized = false;
        this.folderPath = folderPath;
        this.logger = loggerModule.getLogger("PtsAlligner", loggerInfo);
        this.correctionThreshold =  10*90*1000;
    }

    var alignPts = function(chunkList){
        var that = this;
        if (chunkList.length === 0)
        {
            return;
        }

        var chunkToProcess = chunkList.shift();
        var filenameToProcess = chunkToProcess.get('uri');
        that.logger.debug("About to align PTS for %s" , filenameToProcess);
        var oldCorrection = that.context.correction;
        
        var singleFileAlignmentPromise =
            qio.read(path.join(that.folderPath, filenameToProcess), "b") // Read binary data into a buffer
                .then(function(dataBuffer) {
                    that.logger.debug("Old PTS alignment context: %j, buffer length:‌‌ %d" , that.context, dataBuffer.length);
                    if (dataBuffer.length === 0){
                        that.logger.error("file %s has zero bytes", filenameToProcess);
                        return Q.resolve(); //In order to continue processing other file, return resolved promise
                    }
                    var chunkDuration = nativePtsAligner.rebaseTs(that.context, dataBuffer, that.universalTimestamp, that.correctionThreshold);
                    chunkToProcess.set('duration', chunkDuration / 90000);
                    that.logger.debug("New PTS alignment context: %j" ,that.context);
                    return qio.write(path.join(that.folderPath, filenameToProcess), dataBuffer);
                }).then(function(){
                    that.logger.debug("Completed PTS alignment for %s" , filenameToProcess);
                    if ( that.universalTimestamp && oldCorrection && oldCorrection !== that.context.correction ){
                        chunkToProcess.set('discontinuity', true);
                        that.logger.debug("Add discontinuity tag");
                    }
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
                            that.logger.info("Previous context found: %s", content);
                            return JSON.parse(content);
                        });
                }
                else
                {
                    that.logger.info("No previous context found - starting anew");
                    // Set initial DTS to 90000 (1 second) to ensure correct time initialization alignment (relevant after stop-start)
                    return {expectedDts : 90000};
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
            return fsUtils.writeFileAtomically(that.contextFilePath, JSON.stringify(that.context));
        });
    };

    return PtsAlligner;

})();

module.exports = PtsAlligner;