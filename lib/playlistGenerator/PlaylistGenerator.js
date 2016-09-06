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

var qResolved = Q.resolve();
var empty = function(){};
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
function PlaylistGenerator (entryObject,isNewSession) {

    var that = this;

    // object state
    that.entryId = entryObject.entryId;
    that.loggerInfo = "[" + entryObject.entryId + "]";
    that.logger = loggerModule.getLogger("PlaylistGenerator", that.loggerInfo + " ");
    that.isNewSession = isNewSession;
    if(entryObject.getStreamInfo) {
        that.streamInfo = entryObject.getStreamInfo();
    }
    that.flavorsObjArray = null;
    that.isDirty = false;
    that.stopPromise = null;
    that.startPromise = null;
    that.persistPromise = qResolved;
    that.playListLimits =  {
        manifestTimeWindowInMsec: Math.ceil(entryObject.playWindow * 1000 * hlsStoreFilefactor),
        maxClipCountPerPlaylist:Math.max(10,entryObject.maxChunkCount)
    };
    that.playlistPath = path.join(persistenceFormat.getEntryFullPath(that.entryId),persistenceFormat.getMasterManifestName());

    // according to https://github.com/kaltura/nginx-vod-module
    setPlayList.call(that,new Playlist(that.loggerInfo));
    that.gapsCounter = 0;
    that.reorderCounter = 0;
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
};

var isRunning = function isRunning(){
    return this.startPromise && Q.isPending(this.stopPromise.promise);
};


/*
*   keep chunks for a while to avoid downloader from attempting to push bad chunks over and over again
* */
var delayChunkRemoval = function(fileInfo,removedChunks){
    var that = this;

    if(! that.scheduledForRemoval){
        that.scheduledForRemoval = {};
    }

    var chunkname = path.basename(fileInfo.path);

    if(that.scheduledForRemoval[chunkname]) {
        return;
    }

    var keys = _.keys(that.scheduledForRemoval);

    var n = that.playlistImp.getCurrentTime();

    var when = n + Math.max(fileInfo.windowSize || 0,1000*60*5);

    that.logger.warn("PlaylistGenerator.delayChunkRemoval. chunk %j. will be removed in %j ms",chunkname,when-n);

    that.scheduledForRemoval[chunkname] = when;
    _.every(_.values(that.scheduledForRemoval),function(when,index) {
        if (n > when) {
          var ready = keys[index];
          that.logger.warn("PlaylistGenerator.delayChunkRemoval. chunk is ready %j",ready);
          removedChunks.push(ready);
          delete that.scheduledForRemoval[ready];
          return true;
        } else {
           return false;
        }
    });

};

var handleClipError = function(removedChunks,fileInfo){
    var that = this;

    var seq = that.playlistImp.getSequenceForFlavor(fileInfo.flavor);
    var chunkName = path.basename(fileInfo.path);
    if(!seq) {
        that.logger.warn("PlaylistGenerator.handleClipError. erase chunk %j",fileInfo.path);
        fs.unlink(fileInfo.path, empty);
        delayChunkRemoval.call(that,fileInfo,removedChunks);
    } else if (!seq.checkFileExists(chunkName)){
        // avoid from downloader atempting to push this file again and again...
        delayChunkRemoval.call(that,fileInfo,removedChunks);
    }
};

// private insert a new media chunk
var addNewClip = function addNewClip (removedChunks,fileInfo){
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
        handleClipError.call(that,removedChunks,fileInfo);
    }

    return removedChunks;
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

    if(removedChunks.length) {
        var flavorBasePath = persistenceFormat.getFlavorFullPath(that.entryId,flavor);
        // Delete the obsolete chunks from disk
        return _.map(removedChunks, function (pathToDelete) {
            // Delete on a best effort basis
            removeFile.call(that, path.join(flavorBasePath, pathToDelete));
            return pathToDelete;
        });
    } else {
        return removedChunks;
    }
};

// insert list of new chunks return list of obsolete ones and a promise from playlist serialization
PlaylistGenerator.prototype.update = function (chunklist) {
    var that = this;

    var removedChunks = _.reduce(chunklist,addNewClip,[],that);

    if(chunklist.length) {
        removedChunks = removedChunks.concat(checkRemoveChunks.call(that,chunklist[0].flavor));
    }
    return [persistPlayList.call(that), Q.resolve({removedChunks: removedChunks})];
};

PlaylistGenerator.prototype.getDiagnostics = function (opts) {
    var that = this;
    return that.playlistImp.getDiagnostics(opts);
};

var doPersist =  function() {
    var that = this;

    that.emit('beforePlaylistChanged', that);

    that.isDirty = false;
    if(that.playlistImp.inner.liveWindowDuration) {
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
var persistPlayList = function persistPlayList(force){
    var that = this;

    var shouldPersist = force || (that.isDirty);

    if(shouldPersist) {

        if(Q.isPending(that.persistPromise)){
            return that.persistPromise
                .then( function(){
                    return persistPlayList.call(that,force);
                });
        }

        that.persistPromise = qResolved;

        if(that.playlistImp.isModified() || force) {

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
    return that.persistPromise;
};

var finalizeStart = function (){
    var that = this;



    // map flavors onto sequences in correct order
    _.each(that.flavorsObjArray,function(flavorObj){
        that.playlistImp.getSequenceForFlavor(flavorObj.name);
    });

    that.startPromise.resolve(that);
};

PlaylistGenerator.prototype.start = function start() {
    var that = this;

    if(that.startPromise)
        return that.startPromise;

    try {
        that.startPromise = Q.defer();
        that.stopPromise = Q.defer();

        fs.readFile(that.playlistPath,function(err,data) {

            if(err){
                if(err instanceof Error && err.code !== 'ENOENT' ) {
                    that.logger.warn("PlaylistGenerator.start readFile error: %s", ErrorUtils.error2string(err));
                    that.startPromise.reject(err);
                    return;
                }
            }

            if(err || playlistUtils.playlistConfig.dontInitializePlaylist){
                persistPlayList.call(that)
                    .then( function(){
                        finalizeStart.call(that);
                    })
                    .catch(that.startPromise.reject.bind(that.startPromise));
                return;
            }

            Playlist.prototype.serializeFrom(data,that.loggerInfo,function(newPlaylist){
                setPlayList.call(that,newPlaylist);

                persistPlayList.call(that)
                    .then( function(){
                        finalizeStart.call(that);
                    });
            });
        });
        return that.startPromise.promise;
    } catch(err){
        return Q.reject(err);
    }
};

PlaylistGenerator.prototype.stop = function stop (){
    var that = this;

    if( !that.startPromise ) {
        return qResolved;
    }
    if(Q.isPending(that.startPromise.promise)){
        return that.startPromise.then(stop);
    }
    if(isRunning.call(that)){
        that.startPromise = null;
        return persistPlayList.call(that,true).then( function(){
            return that.stopPromise.resolve();
        });
    }
    return that.stopPromise.promise;
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
    }
};

// JSON.stringify callback
PlaylistGenerator.prototype.toJSON = function () {
    var that = this;
    var diag = that.getDiagnostics();
    diag.playlistPath = that.playlistPath;
    diag.reoderCounter = that.reorderCounter;
    diag.gapsCounter = that.gapsCounter;
    diag.config = that.playListLimits;
    if(playlistUtils.playlistConfig.debug){
        diag.palylist = that.playlistImp;
    }
    return diag;
};

var checkTranscodingProfileChange = function () {
    var that = this;
    var entryPath = persistenceFormat.getEntryFullPath(that.entryId);
    var reg = new RegExp("(?:" + that.entryId + "\\/)([0-9]*)\\b", "i");
    return qio.listDirectoryTree(entryPath)
        .then(function(result) {
            return _.chain(result)
                .filter(function(d) {
                    return d.match(reg) !== null;
                })
                .map(function(d) {
                    return d.match(reg)[1];
                })
                .uniq(function(f) {
                    return f;
                })
                .value();
        })
        .then(function(result) {
            var playingFlavorsString = _.map(that.flavorsObjArray, function(f) {
                return f.name;
            }).sort().join();
            if (result.sort().join() !== playingFlavorsString) {
                that.logger.info("Transcoding profile changed, cleaning entry folder");
                return fsUtils.cleanFolder(entryPath);
            }
        })
        .catch(function(error) {
            that.logger.error("Error cleaning folder because of transcoding profile change: %s", ErrorUtils.error2string(error));
        });
};

PlaylistGenerator.prototype.createManifest = function() {
    var that = this;
    that.logger.info("Retrieving master manifest for entry");
    return that.streamInfo.getAllFlavors()
        .then(function(flavors) {
            that.flavorsObjArray = flavors;
            return (!that.isNewSession) ? checkTranscodingProfileChange.call(that) : flavors;
        })
        .then(function() {
            return that.start();
        })
        .then(function(){
            return that.flavorsObjArray;
        });
};

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
        return that.resetting.promise;
    }
    that.resetting = Q.defer();
    try {
        setPlayList.call(that,new Playlist(that.loggerInfo));
        var endReset = function(err){
            that.logger.warn("reset. done %j", err ? ErrorUtils.error2string(err) : 'ok' );
            if(err) {
                that.resetting.reject(err);
            } else {
                that.resetting.resolve();
            }
            delete that.resetting;
        };

        that.startPromise.promise
            .then(function () {
                return persistPlayList.call(that)
            })
            .then(function () {
                return finalizeStart.call(that);
            })
            .then(endReset)
            .catch(endReset);
    } catch(err){
        endReset(err);
    }
    return  that.resetting.promise;
};




module.exports = PlaylistGenerator;