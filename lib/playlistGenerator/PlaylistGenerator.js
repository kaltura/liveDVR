/*
 *   vod packager playlist implementation.
 *   for details see https://github.com/kaltura/nginx-vod-module
 * */

var Q = require('q');
var config = require('./../../common/Configuration');
var fs = require('fs');
var Playlist = require('./Playlist');
var playlistUtils = require('./playlistGen-utils');
var util = require('util');
var persistenceFormat = require('./../../common/PersistenceFormat');
var loggerModule = require('../../common/logger');
var path = require('path');
var qio = require('q-io/fs');
var _ = require('underscore');
var fsUtils = require('./../utils/fs-utils');
var ErrorUtils = require('./../utils/error-utils');
var EventEmitter = require('events').EventEmitter;
const InvalidClipError = require('./../Diagnostics/InvalidClipError');

var qResolved = Q.resolve();
/*
 https://tools.ietf.org/html/draft-pantos-http-live-streaming-19#section-6.2.2
* When the server removes a Media Segment URI from the Playlist, the
 corresponding Media Segment MUST remain available to clients for a
 period of time equal to the duration of the segment plus the duration
 of the longest Playlist file distributed by the server containing
 that segment.  Removing a Media Segment earlier than that can
 interrupt in-progress playback
* */
var hlsStoreFilefactor = 3;
/*
 PlaylistGenerator class
 produces flavor for entry downloader and maintains playlist
 * */
function PlaylistGenerator (entryObject, options) {

    var that = this;

    // object state
    that.entryId = entryObject.entryId;
    that.loggerInfo = "[" + entryObject.entryId + "]";
    that.logger = loggerModule.getLogger("PlaylistGenerator", that.loggerInfo + " ");
    if(entryObject.getStreamInfo) {
        that.streamInfo = entryObject.getStreamInfo();
    }
    that.flavorsObjArray = null;
    that.isDirty = true;
    that.stopPromise = null;
    that.startPromise = null;
    that.persistPromise = qResolved;
    that.playlistType = 'live';
    if (_.has(options, 'recording') && options.recording == true){
        that.playlistType = 'recording'
        that.playListLimits =  {
            manifestTimeWindowInMsec: 86400000, //24 hours
            maxClipCountPerPlaylist: 'INF'
        };
        that.playlistPath = path.join(options.recordingSessionPath, persistenceFormat.getMasterManifestName())
        //In case of restore recording, we  should create manifest without wowza information, then the property streamInfo is mandatory
        if (options.flavors) {
            that.streamInfo = {
                getAllFlavors: ()=> {
                    return Q.resolve(options.flavors)
                }
            }
        }

    }
    else{
        that.playListLimits =  {
            manifestTimeWindowInMsec: Math.ceil(entryObject.playWindow * 1000 * hlsStoreFilefactor),
            maxClipCountPerPlaylist: Math.max(10,entryObject.maxChunkCount)
        };
        that.playlistPath = path.join(persistenceFormat.getEntryBasePath(that.entryId),persistenceFormat.getMasterManifestName());
    }


    // according to https://github.com/kaltura/nginx-vod-module
    setPlayList.call(that,new Playlist(that.loggerInfo));
    that.gapsCounter = 0;
    that.reorderCounter = 0;
    
    that.driftInfo = {}
}

util.inherits(PlaylistGenerator,EventEmitter);

Object.defineProperty(PlaylistGenerator.prototype , "actualWindowSize", {
    get: function get_rollingWindowFactor() {
        return this.playListLimits.manifestTimeWindowInMsec;
    }
});

var setPlayList = function (playlist){
    var that = this;

    that.playlistImp = playlist;
    that.playlistImp.playListLimits = that.playListLimits;
    that.playlistImp.getCurrentTime = Date.now;
    if(that.playListLimits.manifestTimeWindowInMsec) {
        that.playlistImp.inner.liveWindowDuration = Math.ceil(that.playListLimits.manifestTimeWindowInMsec / hlsStoreFilefactor);
    }
    that.playlistImp.addListener(that);
    that.playlistImp.inner.presentationEndTime = 0
};

var isRunning = function isRunning(){
    return this.startPromise && !this.stopPromise;
};

function  getDelayedForFlavor (flavor) {

       var seq = this.playlistImp.getSequenceForFlavor(flavor);

        if(!seq.scheduledForRemoval){
            seq.scheduledForRemoval = {};
        }

        return seq.scheduledForRemoval;
}

var checkDelayedRemovalChunksReady = function(flavor,removedChunks){
    var that = this;

    var delayedChunks = getDelayedForFlavor.call(that,flavor);

    var n = that.playlistImp.getCurrentTime();
    var removedChunks = removedChunks || [];
    var keys = _.keys(delayedChunks);
    _.every(_.values(delayedChunks),function(fi,index) {
        if (n > fi.when) {
            var ready = keys[index];
            that.logger.warn("PlaylistGenerator.delayChunkRemoval. chunk is ready %j",ready);
            removedChunks.push(fi.path);
            delete delayedChunks[ready];
            return true;
        } else {
            return false;
        }
    });
    return removedChunks;
};

function handleClipError (fileInfo){
    var that = this;

    var delayedChunks = getDelayedForFlavor.call(that,fileInfo.flavor);

    var chunkname = path.basename(fileInfo.path);

    if(delayedChunks[chunkname]) {
        return;
    }

    var keys = _.keys(delayedChunks);

    var n = that.playlistImp.getCurrentTime();

    var when = n + Math.max(fileInfo.windowSize || 0,1000*60*5);

    that.logger.warn("handleClipError. chunk %j. will be removed in %j ms",chunkname,when-n);

    delayedChunks[chunkname] = { when: when, path: persistenceFormat.getRelativePathFromFull(fileInfo.path) };
}

// private insert a new media chunk
function addNewClip (results,fileInfo){
    var that = this;

    try {

        if (!isRunning.call(that)) {
            that.logger.warn("PlaylistGenerator.addNewClip. stopped. adding rejected");
            throw new Error('PlaylistGenerator.addNewClip. stopped. adding rejected');
        }

        if(that.playlistImp.insertChunk(fileInfo)) {
            that.isDirty = true;
        }

    } catch(err){
        that.logger.warn("PlaylistGenerator.addNewClip. exception %j",ErrorUtils.error2string(err));
        if( err instanceof InvalidClipError){
            results.push(fileInfo.saveAsTS());
            that.emit('diagnosticsAlert', err._alert );
        }
        handleClipError.call(that,fileInfo);
    }
    return results;
};

var removeFile = function (pathToDelete) {
    var that = this;

    if(playlistUtils.playlistConfig.preserveMP4Chunks){
        return qResolved;
    }

    return qio.remove(pathToDelete)
        .then(function () {
            that.logger.debug('Successfully deleted chunk %j', path.basename(pathToDelete));
        }).catch(function (err) {
            var logOp = that.logger.error;
            if(err){
                switch(err.code){
                case 'ENOENT':
                    logOp = that.logger.debug;
                    break;
                }
            }
          logOp.call(that.logger,'removeFile. Error deleting a chunk %s', ErrorUtils.error2string(err));
        });
};

// remove obsolete chunks no more fitting into window
var checkRemoveChunks = function(flavor){
    var that = this;

    var seq = that.playlistImp.getSequenceForFlavor(flavor);

    var removedChunks = seq.checkExpires(that.playlistImp.getCurrentTime(), that.playlistImp.totalDuration);

    checkDelayedRemovalChunksReady.call(that,flavor,removedChunks);

    if(removedChunks.length) {
        var flavorBasePath = persistenceFormat.getFlavorFullPath(that.entryId,flavor);
        // Delete the obsolete chunks from disk
        return _.map(removedChunks, function (pathToDelete) {
            // Delete on a best effort basis
            removeFile.call(that, path.join(flavorBasePath, pathToDelete));
            return path.basename(pathToDelete);
        });
    } else {
        return removedChunks;
    }
};

PlaylistGenerator.prototype.getTotalDuration = function () { //todo check with igor!
    return this.playlistImp.totalDuration
}

// insert list of new chunks return list of obsolete ones and a promise from playlist serialization
PlaylistGenerator.prototype.update = function (chunklist) {
    var that = this;

    if(!that.addNewClip){
        that.addNewClip = addNewClip.bind(that);
    }

    let results = _.reduce(chunklist,that.addNewClip,[qResolved]);

    var removedChunks = [];
    if(chunklist.length) {
        removedChunks = checkRemoveChunks.call(that,chunklist[0].flavor);
    }
    return [Q.allSettled(results).then( () => {
        return persistPlayList.call(that)
    }), Q.resolve({removedChunks: removedChunks})];
};

PlaylistGenerator.prototype.getDiagnostics = function (opts) {
    var that = this;
    return that.playlistImp.getDiagnostics(opts);
};

var doPersist =  function() {
    var that = this;

    that.emit('beforePlaylistChanged', that);

    that.isDirty = false;
    if(that.playlistImp.inner.liveWindowDuration && that.playlistType == 'live') {
        that.playlistImp.inner.presentationEndTime = that.playlistImp.getCurrentTime() + that.playlistImp.inner.liveWindowDuration;
    }
    try {
        that.logger.info("write %s atomically", that.playlistPath);
        that.playlistImp.validate();
        var jsonStr = JSON.stringify(that.playlistImp);
        if (false && playlistUtils.playlistConfig.debug) {
            Playlist.prototype.serializeFrom(jsonStr, that.loggerInfo,function(newPlaylist){
               if( newPlaylist instanceof Error ){
                   that.logger.warn("error %j",newPlaylist);
               } else {
                   setPlayList.call(that, newPlaylist);
               }
            },true);
        }
        that.persistPromise = fsUtils.writeFileAtomically(that.playlistPath, jsonStr);
        if (playlistUtils.playlistConfig.humanReadable) {
            try {
                playlistUtils.playlistConfig.humanReadablePass = true;
                var p2 = fsUtils.writeFileAtomically(that.playlistPath + ".human", JSON.stringify(that.playlistImp, undefined, 1));
            } finally {
                playlistUtils.playlistConfig.humanReadablePass = false;
            }
            that.persistPromise = Q.allSettled([that.persistPromise, p2]);
        } else {

        }
    } catch (err) {
        that.persistPromise = Q.reject(err);
    }

    that.persistPromise
        .then(function () {
            that.emit('afterPlaylistChanged', that);
        })
        .catch(function (err) {
            that.emit('afterPlaylistChanged', that, err);
        });

    return that.persistPromise;
};

// save playlist
function persistPlayList() {
    var that = this;

    if(that.isDirty) {

        if(Q.isPending(that.persistPromise)){
            return that.persistPromise
                .then( function(){
                    return persistPlayList.call(that);
                });
        }

        that.persistPromise = qResolved;

        if(that.playlistImp.isModified()) {

            if( playlistUtils.playlistConfig.enablePlaylistHistory ) {
                //bypass any errors returned from rename
                var deferred = Q.defer();
                var savedName = that.playlistPath + '_' + Date.now();
                that.logger.trace("debug: save playlist to %j", savedName);
                qio.copy(that.playlistPath,savedName)
                    .finally( function(){
                        deferred.resolve();
                    });
                return deferred.promise.then( function(){
                    return doPersist.call(that);
                });

            } else {
                return doPersist.call(that);
            }
        }
    }
    return that.persistPromise.promise;
}

function initializeSequences(){
    var that = this;
    // initializeSequences is called only after startPromise is successfully fulfilled.

    // map flavors onto sequences in correct order
    _.each(that.flavorsObjArray,function(flavorObj){
        that.playlistImp.getSequenceForFlavor(flavorObj.name);
    });

    return that.startPromise;
}

function startPlaylistGenerator() {
    var that = this;

    if(that.startPromise)
        return that.startPromise;

    that.startPromise = qio.read(that.playlistPath)
        .then(function(data) {
            Playlist.prototype.serializeFrom(data, that.loggerInfo, function (newPlaylist) {
                setPlayList.call(that, newPlaylist);
            })
        })
        .catch(function(err) {
            if (err instanceof Error && err.code !== 'ENOENT') {
                that.logger.error("Error while reading from file: %j", ErrorUtils.error2string(err));
                return Q.reject(err);
            }
            else
                return Q.resolve();
        })
        .then(function() {
            return persistPlayList.call(that);
        })
        .catch(function(err) {
            that.logger.error("Error starting playlistGenerator: %j", ErrorUtils.error2string(err));
        });

    return that.startPromise;
}

PlaylistGenerator.prototype.initializeStart = function() {
    var that = this;
    return startPlaylistGenerator.call(that)
        .then(function() {
            return createManifest.call(that);
        })
        .catch(function(error) {
            return Q.reject(error);
        })
};

PlaylistGenerator.prototype.finalizeStart = function() {
    let that = this;
    return that.startPromise
        .then(function() {
            initializeSequences.call(that);
            return that.flavorsObjArray;
        })
        .catch(function(error) {
            that.logger.error("Error occurred while starting PlaylistGenerator: %s", ErrorUtils.error2string(error));
        });
};

PlaylistGenerator.prototype.stop = function stop (){
    var that = this;

    if( !that.startPromise ) {
        return qResolved;
    }
    return that.stopPromise = that.startPromise
        .then(function(){
            return persistPlayList.call(that);
        });
};

// BroadcastEventEmitter events raised by various levels processed here
PlaylistGenerator.prototype.handleEvent = function (type,arg) {
    var that = this;

    switch(type){
        case playlistUtils.ClipEvents.gap_limit_exceeded:
            var gap = arguments[2];
            that.logger.warn("PlaylistGenerator.handleEvent. handle gap_limit_exceeded(%s-%s)",gap.from,gap.to);
            that.playlistImp.collapseGap(gap);
            that.isDirty = true;
            that.gapsCounter++;
            break;
        case playlistUtils.ClipEvents.modified:
            that.isDirty = true;
            break;
        case playlistUtils.ClipEvents.diagnosticsInfo:
            that.driftInfo[arguments[2]] = arguments[3];
            break;
        case playlistUtils.ClipEvents.diagnosticsAlert:
            that.emit('diagnosticsAlert', arguments[2]);
            break;
    }
};

// JSON.stringify callback
PlaylistGenerator.prototype.toJSON = function () {
    var that = this;
    var diag = {};
    diag.playlistPath = that.playlistPath;
    diag.gapsCounter = that.gapsCounter;
    diag.config = that.playListLimits;
    return diag;
};

PlaylistGenerator.prototype.checkTranscodingProfileChange = function() {
    let that = this;
    let playedFlavors = _.map(that.playlistImp.inner.sequences, (seq) => { return seq.inner.id }).sort().join();
    // If json was not created yet, entry was restarted before started playing -> playedFlavors !== currentlyPlayingFlavors
    let currentlyPlayingFlavors = _.map(that.flavorsObjArray, (f) => { return f.name; }).sort().join();
    if (currentlyPlayingFlavors !== playedFlavors) {
        that.logger.info("Transcoding profile changed");
        return true;
    }
    return false;
};

function createManifest() {
    var that = this;
    that.logger.info("Retrieving master manifest for entry");
    return that.streamInfo.getAllFlavors()
        .then(function(flavors) {
            that.flavorsObjArray = flavors;
        });
}

PlaylistGenerator.prototype.doValidate = function() {
    return this.playlistImp.doValidate();
};

PlaylistGenerator.prototype.validate = function() {
    return this.playlistImp.validate();
};

PlaylistGenerator.prototype.checkFileExists = function(fileName){
    return this.playlistImp.checkFileExists(fileName);
};

PlaylistGenerator.prototype.reset = function() {
    var that = this;

    that.logger.warn("reset.");

    if(!isRunning.call(that)){
        that.logger.warn("reset. not running");
            return Q.reject(new Error('not running'));
    }
    if(that.resetting){
        that.logger.warn("reset. already resetting");
        return that.resetting;
    }
    setPlayList.call(that,new Playlist(that.loggerInfo));

    that.resetting =  that.startPromise
        .then(function () {
            return persistPlayList.call(that)
        })
        .then(function () {
            initializeSequences.call(that);
        })
        .finally( () => {
            delete that.resetting
        });
    return  that.resetting;
};




module.exports = PlaylistGenerator;