/**
 * Created by elad.benedict on 11/1/2015.
 */

var Q = require('q');
var config = require('./../common/Configuration.js');

if(!config.get('mockDownloadChunk')) {

    var fsUtils = require('./utils/fs-utils');
    var qio = require('q-io/fs');
    var path = require('path');
    var os = require('os');

    var PtsAlligner = (function () {

        function getArchAndPlatform() {
            if (os.platform() === 'win32') {
                if (os.arch() === 'x64') {
                    return "win64";
                }
                else {
                    return "win32";
                }
            }
            else if (os.platform() === 'darwin') {
                    return "darwin";
            }
            else {
                return "linux";
            }
        }

        var nativePtsAligner = require(path.join(__dirname, '..', 'bin', getArchAndPlatform(), 'TsRebase.node'));

        function PtsAlligner(folderPath, logger) {
            this.initialized = false;
            this.folderPath = folderPath;
            this.logger = logger;
        }

        var alignPts = function (chunkList) {
            var that = this;
            if (chunkList.length === 0) {
                return;
            }

            var chunkToProcess = chunkList.shift();
            var filenameToProcess = chunkToProcess.get('uri');
            that.logger.debug("About to align PTS for " + filenameToProcess);

            var singleFileAlignmentPromise =
                qio.read(path.join(that.folderPath, filenameToProcess), "b") // Read binary data into a buffer
                    .then(function (dataBuffer) {
                        that.logger.debug("Old PTS alignment context: " + JSON.stringify(that.context));
                        var chunkDuration = nativePtsAligner.rebaseTs(that.context, dataBuffer); // Context is changed in place
                        chunkToProcess.set('duration', chunkDuration / 90000);
                        that.logger.debug("New PTS alignment context: " + JSON.stringify(that.context));
                        return qio.write(path.join(that.folderPath, filenameToProcess), dataBuffer);
                    }).then(function () {
                        that.logger.debug("Completed PTS alignment for " + filenameToProcess);
                    });


            return singleFileAlignmentPromise.then(function () {
                return alignPts.call(that, chunkList); // Recursively process the rest of the list
            });
        };

        PtsAlligner.prototype.initialize = function () {
            this.initialized = true;
            this.contextFilePath = path.join(this.folderPath, 'ptsAlignmentContext');
            var that = this;
            return qio.exists(that.contextFilePath)
                .then(function (exists) {
                    if (exists) {
                        return qio.read(that.contextFilePath)
                            .then(function (content) {
                                that.logger.info("Previous context found: " + content);
                                return JSON.parse(content);
                            });
                    }
                    else {
                        that.logger.info("No previous context found - starting anew");
                        // Set initial DTS to 90000 (1 second) to ensure correct time initialization alignment (relevant after stop-start)
                        return {expectedDts: 90000};
                    }
                }).then(function (context) {
                    that.context = context;
                });
        };

        PtsAlligner.prototype.process = function (chunkList) {
            var that = this;
            return Q.fcall(function () {
                if (!that.initialized) {
                    return that.initialize();
                }
            }).then(function () {
                return alignPts.call(that, chunkList);
            }).then(function () {
                return fsUtils.writeFileAtomically(that.contextFilePath, JSON.stringify(that.context));
            });
        };

        return PtsAlligner;

    })();

    module.exports = PtsAlligner;
} else {
    module.exports = function PtsAlligner () {
        return {
            process   :Q.resolve,
            initialize: Q.resolve
        };
    }
}