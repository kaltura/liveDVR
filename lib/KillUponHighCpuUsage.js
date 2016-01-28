/**
 * Created by elad.benedict on 1/28/2016.
 */

var usage = require('usage');
var pid = process.pid;
var Q = require('q');
var logger = require('./logger/logger')(module);
var config = require('../common/Configuration');
var log4js = require('log4js');

var lookupP = Q.nbind(usage.lookup, usage);
module.exports = (function(){

    var highCpuThreshold = config.get('highCpuHandlingParams:highCpuThreshold');
    var allowedConsecutiveHighCpuUsageSamples = config.get('highCpuHandlingParams:allowedConsecutiveHighCpuUsageSamples');
    var cpuSamplingInterval = config.get('highCpuHandlingParams:cpuSamplingInterval');
    var options = { keepHistory: true }

    var numOfConsecutiveHighCpuSamples = 0;

    var sample = function() {
        lookupP(pid, options)
            .then(function(usageStats){
                if (usageStats.cpu > highCpuThreshold)
                {
                    logger.error('high CPU usage: ' + usageStats.cpu);
                    numOfConsecutiveHighCpuSamples++;
                }
                else
                {
                    if (numOfConsecutiveHighCpuSamples > 0)
                    {
                        logger.debug('CPU usage is below highCpuThreshold - clearing counter');
                    }

                    numOfConsecutiveHighCpuSamples = 0;
                }

                if (numOfConsecutiveHighCpuSamples === allowedConsecutiveHighCpuUsageSamples)
                {
                    logger.error('CPU usage was too high during the last ' + allowedConsecutiveHighCpuUsageSamples + ' samples - exiting the application');
                }
            })
            .then(function(){
                log4js.shutdown(function() { process.exit(1); });
            })
            .catch(function(err){
                logger.error('Error sampling the process CPU usage: ' + err);
            });
    }

    var start = function(){
        setInterval(sample, cpuSamplingInterval)
    }

    return {
        start : start
    }
})()