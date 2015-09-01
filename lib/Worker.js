/**
 * Created by elad.benedict on 8/26/2015.
 */

var config = require('./Configuration');
var backendClient = require('./BackendClientFactory').getBackendClient();
var _ = require('underscore');
var entryDownloaderCtor = require('./EntryDownloader');
var logger = require('./logger/logger');

function createWorker(){

    var hostname = config.get('mediaServer').hostname;
    var port = config.get('mediaServer').port;
    var applicationName = config.get('mediaServer').applicationName;

    var handledEntries = {};
    var pollingInterval = config.get('backendPollingInterval');

    var start = function() {
        handleEntries();
        setInterval(handleEntries, pollingInterval);
    };

    var handleEntries = function(){
        return backendClient.getLiveEntriesForMediaServer().then(function(liveEntries){
            var unhandledLiveEntries = _.difference(liveEntries, Object.keys(handledEntries));
            _.forEach(unhandledLiveEntries, function(newLiveEntry){
                try {
                    var entryDownloader = new entryDownloaderCtor(newLiveEntry, hostname, port, applicationName);
                    handledEntries[newLiveEntry] = entryDownloader;
                    entryDownloader.start();
                }
                catch (err){
                    logger.error('failed to start entry downloader for entry: ' + newLiveEntry + "\n" + err + "\n" + err.stack);
                }
            });

            var noLongerLiveEntries = _.difference(Object.keys(handledEntries), liveEntries);
            _.forEach(noLongerLiveEntries, function(noLongerLiveEntry){
                var entryDownloader = handledEntries[noLongerLiveEntry];
                entryDownloader.stop();
            });
        }).catch(function(err){
            logger.error('Unhandled exception: ' + err + err.stack);
        });
    };

    return {
        start : start
    };
}

module.exports = createWorker();
