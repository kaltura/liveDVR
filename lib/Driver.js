/**
 * Created by elad.benedict on 9/10/2015.
 */

var config = require('./../common/Configuration');
var http = require('http');
var _ = require('underscore');
var path = require('path');
var os = require('os');
/**
 *
 * Due to a misconfiguration, please do not write to the logger here.
 */
// Since node v0.10 sets this to 5 by default
http.globalAgent.maxSockets = Infinity;

if (os.platform() === 'darwin') {
    http.globalAgent.maxSockets = 50;
}

var prefixParam = _.find(process.argv, function(arg){
    return arg.match(/prefix:.*?/)
});

var prefix = "";
if (prefixParam)
{
    prefix = prefixParam.match(/prefix:(.*?)$/)[1];
    includePrefixInLogFileName(prefix, 'logFileName');
    includePrefixInLogFileName(prefix, 'webServerParams:logFileName');
}

function includePrefixInLogFileName(prefix, configPropertyName){
    var originalFilePath = config.get(configPropertyName)
    var fileDir = path.dirname(originalFilePath);
    var fileName = path.basename(originalFilePath);
    var newFileName = prefix + "_" + fileName;
    var newFilePath = path.join(fileDir, newFileName);
    config.set(configPropertyName, newFilePath);
}

require('./CyclicHeapDump');
require('./CpuProfiler');
var WorkerCtor = require('./Worker');
var worker = new WorkerCtor(prefix);
worker.start();
