/**
 * Created by igors on 12/09/2016.
 */
var fs = require('fs');
var Q = require('q');
var loggerModule = require('../../common/logger');
var errorUtils = require('./../utils/error-utils');

const logger = loggerModule.getLogger("mp4-utils");

const comentStr = 'cmt'; //'�cmt';

var handleError = function(def,err){
    logger.warn("handleError %j",errorUtils.error2string(err));
    def.reject(err);
};

var extractMetadata =  function (filePath) {
    var def = Q.defer();
    fs.open(filePath, 'r', function (err, fd) {
        if (err) {
            handleError(def, err);
        } else {
            fs.fstat(fd, function (err, stats) {
                if (err) {
                    handleError(def, err);
                } else {
                    let buf = new Buffer(1024 * 4);

                    fs.read(fd, buf, 0, buf.length, stats.size - buf.length, function (err, bytesRead, buffer) {
                        if (err) {
                            handleError(def, err);
                        } else {
                            // read metadata table

                            var pos = buf.indexOf(comentStr);
                            if (pos >= 0) {
                                pos += comentStr.length;
                                let dataLength = buf.readInt32BE(pos) - 'data'.length - 12; //size
                                pos += 'data'.length;
                                pos += 12;
                                let str = buf.toString('utf-8', pos, pos + dataLength);
                                try {
                                    var fileInfo = JSON.parse(str);
                                    fileInfo.path = filePath;
                                    logger.trace("readMetadataFromMP4File %j", fileInfo);
                                    def.resolve(fileInfo);
                                } catch (err) {
                                    handleError(def, err);
                                }
                            } else {
                                handleError(def, new Error('fileinfo object not found'));
                            }
                        }
                    });
                }
            });
        }
    });
    return def.promise;
};

module.exports = {
    extractMetadata: extractMetadata
};