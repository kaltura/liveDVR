/**
 * Created by elad.benedict on 9/10/2015.
 */

var http = require('http');
require('./CyclicHeapDump');
require('./CpuProfiler');
var highCpuMonitor = require('./KillUponHighCpuUsage')
var config = require('../common/Configuration');

if (config.get('highCpuHandlingParams:enabled'))
{
    highCpuMonitor.start();
}

// Since node v0.10 sets this to 5 by default
http.globalAgent.maxSockets = Infinity;

var WorkerCtor = require('./Worker');
var worker = new WorkerCtor();
worker.start();
