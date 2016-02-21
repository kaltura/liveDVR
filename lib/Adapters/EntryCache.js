
var Q = require('q');
var WowzaAdapter=require('./WowzaAdapter.js');
var _=require('underscore');
//var logger = require('../../common/logger/logger')(module);
var backendClient=require('../BackendClientFactory.js').getBackendClient();



module.exports = function() {


    var entryCache={};

    var outdatedTime=60*1000;//one minute

    var lastRevoke=0;
    var self=this;


    self.get=function(entryId) {
        return entryCache[entryId];
    };
    self.getEntries=function(entriesId) {

        var now=new Date();

        var entriesToFetch=[];

        //revoke from cache outdated entries
        if (now-lastRevoke>outdatedTime) {
            _.each(entryCache,function(entry) {
                if (now-entry.lastUpdated>outdatedTime) {
                    console.warn("deleting ",entry.entryId);
                    delete entryCache[entry.entryId];
                }});

            lastRevoke=now;
        }

        //determin what is missing from cache
        _.each(entriesId,function(entryId) {
            if (!entryCache[entryId]) {
                entriesToFetch.push(entryId);
            }});

        var refreshCache= Q.resolve(true);
        if (entriesToFetch.length>0) {

            console.warn("Fetching ",entriesToFetch);
            refreshCache = backendClient.getEntries(entriesToFetch).then(function (entries) {
                _.each(entries, function (entry) {
                    entry["lastUpdated"] = now;
                    entryCache[entry.entryId] = entry;
                });
            });

            return refreshCache;


        } else {
            console.warn("No need to fetch!!");

        };


        return refreshCache;


    };


    return self;
}();