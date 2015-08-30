/**
 * Created by elad.benedict on 8/26/2015.
 */

var config = require('./Configuration');
var backendClient = require('./BackendClientFactory').getBackendClient();
var _ = require('underscore');
var worker = createWorker();

module.exports = worker;

function createWorker(){

    var hostname = config.get('mediaServer').hostname;
    var port = config.get('mediaServer').port;
    var applicationName = config.get('mediaServer').applicationName;

    var handledEntries = {};
    var pollingInterval = config.get('backendPollingInterval');

    var start = function(){
        handleEntries();
        while (true){
            setInterval(handleEntries, pollingInterval);
        }
    };

    var handleEntries = function(){
        return backendClient.getLiveEntriesForMediaServer().then(function(liveEntries){
            var unhandledLiveEntries = _.difference(liveEntries, handledEntries);
            _.forEach(unhandledLiveEntries, function(newLiveEntry){
                // Create and start entry downloader
                var entryDownloader = null;
                handledEntries[newLiveEntry] = entryDownloader;
            });

            var noLongerLiveEntries = _.difference(handledEntries, liveEntries);
            _.forEach(unhandledLiveEntries, function(noLongerLiveEntry){
                var entryDownloader = handledEntries[noLongerLiveEntry];
                // Stop relevant entry downloader
            });
        }).catch(function(err){
            // Log error
        });
    };

    return {
        start : start
    };
}