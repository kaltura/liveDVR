/**
 * Created by ronyadgar on 29/11/2015.
 */

var heapdump = require('heapdump');
var logger = require('./logger/logger')(module);
var fs = require('fs');
var config = require('./../common/Configuration');


module.exports = (function(){
    var timeInterval = config.get('HeapDumpParams').timeInterval || '9000000';
    var windowSize = config.get('HeapDumpParams').windowSize || '3';
    var rootFolderPath=config.get('rootFolderPath');
    var ListOfHeapDumpFiles = new Array();
    setInterval(function() {
        var filename= Date.now() + '.heapsnapshot';
        console.log(filename);
        heapdump.writeSnapshot(rootFolderPath+"/"+filename,function(err, filename) {
            if (err){
                logger.error("Failed to write snapshot in "+filename+": "+err+"\n");
            }
            else {
                if (ListOfHeapDumpFiles.length === windowSize) {
                    var fileToDelete=ListOfHeapDumpFiles.shift();
                    fs.unlink(fileToDelete, function (err) {
                        if (err){
                            logger.error("Failed to delete "+fileToDelete+": "+err+"\n");
                        }
                        else {
                            logger.info("Succsefully deleted " + fileToDelete + "\n");
                        }
                    });

                }
                ListOfHeapDumpFiles.push(filename);
                logger.info("Succsefully written snapshot in "+filename+"\n");
            }
        });
    }, timeInterval);
})();