/**
 * Created by elad.benedict on 9/10/2015.
 */

var http = require('http');
// Since node v0.10 sets this to 5 by default
http.globalAgent.maxSockets = Infinity;

var WorkerCtor = require('./Worker');
var worker = new WorkerCtor();
worker.start();
