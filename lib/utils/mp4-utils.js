/**
 * Created by igors on 12/09/2016.
 */
var fs = require('fs');
var Q = require('q');
var loggerModule = require('../../common/logger');
var errorUtils = require('./../utils/error-utils');
const _ = require('underscore')

const logger = loggerModule.getLogger("mp4-utils");

const comentStr = 'cmt'; //'�cmt';


class DummyFileInfo {
    saveAsTS(){
        return Q.resolve();
    }
}

function handleError (def,err){
    if(err instanceof DummyFileInfo) {
        def.resolve(err);
    } else {
        logger.warn("handleError %j", errorUtils.error2string(err));
        def.reject(err);
    }
};

function finalize(def,err,fd){
    if(fd) {
        fs.close(fd, () => {
            handleError(def,err);
        });
    } else {
        handleError(def,err);
    }

};

var extractMetadata =  function (filePath) {
    let def = Q.defer();
    fs.open(filePath, 'r', function (err, fd) {
        if (err) {
            finalize(def, err);
        } else {
            fs.fstat(fd, function (err, stats) {
                if (err) {
                    finalize(def, err,fd);
                } else {
                    let buf = new Buffer(1024 * 4);

                    fs.read(fd, buf, 0, buf.length, stats.size - buf.length,  (err, bytesRead, buffer) => {
                        try {
                            if (err)
                                throw err;
                            // read metadata table
                            var pos = buf.indexOf(comentStr);
                            if (pos < 0)
                                throw new Error('fileinfo object not found');
                            pos += comentStr.length;
                            let dataLength = buf.readInt32BE(pos) - 'data'.length - 12; //size
                            pos += 'data'.length;
                            pos += 12;
                            let str = buf.toString('utf-8', pos, pos + dataLength);
                            var fileInfo = _.create(DummyFileInfo.prototype,JSON.parse(str));
                            fileInfo.path = filePath;
                            logger.trace("readMetadataFromMP4File %j", fileInfo);
                            finalize(def,fileInfo,fd)
                        } catch (err) {
                            finalize(def, err,fd);
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