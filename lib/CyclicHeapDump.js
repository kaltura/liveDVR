/**
 * Created by ronyadgar on 29/11/2015.
 */

var heapdump = require('heapdump');
var logger = require('./logger/logger')(module);
var fs = require('fs');
var config = require('./../common/Configuration');
var path = require('path');
var hostname = require('../common/utils/hostname');

module.exports = (function(){
    var timeInterval = config.get('heapDumpParams').timeInterval || '9000000';
    var windowSize = config.get('heapDumpParams').windowSize || '3';
    var rootFolderPath = config.get('rootFolderPath');
    var enabled = config.get('heapDumpParams').enabled;
    var listOfHeapDumpFiles = [];
    if (enabled) {
        setInterval(function () {
            var filename = Date.now() + '.heapsnapshot';
            heapdump.writeSnapshot(path.join(rootFolderPath, hostname.getLocalMachineFullHostname() + "_" + filename), function (err, filename) {
                if (err) {
                    logger.error("Failed to write snapshot in " + filename + ": " + err);
                }
                else {
                    if (listOfHeapDumpFiles.length === windowSize) {
                        var fileToDelete = listOfHeapDumpFiles.shift();
                        fs.unlink(fileToDelete, function (err) {
                            if (err) {
                                logger.error("Failed to delete " + fileToDelete + ": " + err);
                            }
                            else {
                                logger.info("Successfully deleted " + fileToDelete);
                            }
                        });

                    }
                    listOfHeapDumpFiles.push(filename);
                    logger.info("Successfully wrote snapshot to " + filename);
                }
            });
        }, timeInterval);
    }
})();