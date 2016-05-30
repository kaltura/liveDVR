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


var qResolved = Q.resolve();
var empty = function(){};

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
        manifestTimeWindowInMsec: entryObject.playWindow * 1000,
        maxClipCountPerPlaylist:Math.max(10,entryObject.maxChunkCount),
        minRefreshPlaylistInterval:playlistUtils.playlistConfig.minRefreshPlaylistInterval || 20000
    };
    that.lastPersistTime = Date.now() - that.playListLimits.minRefreshPlaylistInterval - 1000;
    that.playlistPath = path.join(persistenceFormat.getEntryFullPath(that.entryId),persistenceFormat.getMasterManifestName());

    // according to https://github.com/kaltura/nginx-vod-module
    setPlayList.call(that,new Playlist(that.loggerInfo));
    that.gapsCounter = 0;
    that.reorderCounter = 0;
}

var setPlayList = function (playlist){
    var that = this;

    that.playlistImp = playlist;
    that.playlistImp.playListLimits = that.playListLimits;
    that.playlistImp.getCurrentTime = Date.now;
    that.playlistImp.inner.presentationEndTime = that.playlistImp.getCurrentTime() + that.playListLimits.manifestTimeWindowInMsec;
    if(that.playListLimits.manifestTimeWindowInMsec) {
        that.playlistImp.inner.dvrWindow = that.playListLimits.manifestTimeWindowInMsec;
    }
};

var isStopped = function isStopped(){
    return this.stopPromise && this.stopPromise.promise.state === 'fulfilled';
};
var isRunning = function isRunning(){
    return this.startPromise && Q.isPending(this.stopPromise.promise);
};

// private insert a new media chunk
var addNewClip = function addNewClip (fileInfo){
    var that = this;

    if(!isRunning.call(that)) {
        fs.unlink(fileInfo.path,empty);
            throw new Error('Playlist is stopped');
    }

    var lastClip = that.playlistImp.getClipFromFileInfo(fileInfo);

    lastClip.insert(fileInfo);

    // REMOVE: use in debug tests only!
    if(!lastClip.validate(playlistUtils.playlistConfig)){
        that.logger.warn("PlaylistGenerator.addNewClip. lastClip.validate failed - bug in playlist");
    }

    that.isDirty = true;
};

var removeFile = function (pathToDelete) {
    var that = this;

    return qio.remove(pathToDelete)
        .then(function () {
            that.logger.info('Successfully deleted chunk $s', path.basename(pathToDelete));
        }).catch(function (err) {
            that.logger.error('Error deleting a chunk which was removed from a manifest - error %s', ErrorUtils.error2string(err));
        });
};

// remove obsolete chunks no more fitting into window
var checkRemoveChunks = function(flavor){
    var that = this;

    var seq = that.playlistImp.getSequenceForFlavor(flavor);
    var removedChunks = seq.checkExpires(that.playlistImp.getCurrentTime());

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
PlaylistGenerator.prototype.update = function (playlist) {
    var that = this;

    var removedChunks = [];
    _.each(playlist,addNewClip,that);

    if(playlist.length) {
        removedChunks = removedChunks.concat(checkRemoveChunks.call(that,playlist[0].flavor));
    }
    return [persistPlayList.call(that), Q.resolve({removedChunks: removedChunks})];
};

PlaylistGenerator.prototype.getDiagnostics = function (opts) {
    var that = this;
    return that.playlistImp.getDiagnostics(opts);
};

var playlistIsModified = function(){
    var that = this;

    var playlist = that.playlistImp.inner;

    if(that.playlistImp.collectObsoleteClips() && !playlist.durations.length ){
        return true;
    }

    if (playlist.durations.length > 0) {
        var minMax = that.playlistImp.recalculateOffsetsAndDuration();

        // zero range clips?
        if (!minMax) {
            return false;
        }

        // only update manifest if all downloaders have contributed i.e. playback range changed
        if (that.playlistImp.minMax && that.playlistImp.minMax.min === minMax.min && that.playlistImp.minMax.max === minMax.max) {
            return false;
        }

        // no durations => no minMax
        if (playlist.durations.length === 0){
            delete that.playlistImp.minMax;
        }

        //first time only
        if (playlist.segmentBaseTime === 0) {
            playlist.segmentBaseTime = playlist.firstClipTime;
        }

        that.playlistImp.minMax = minMax;
    }
    return true;
};

// save playlist
var persistPlayList = function persistPlayList(force){
    var that = this;

    var shouldPersist = force || (that.isDirty && that.lastPersistTime < Date.now());

    if(shouldPersist) {

        if(Q.isPending(that.persistPromise)){
            return that.persistPromise
                .then( function(){
                    return persistPlayList.call(that,force);
                });
        }

        that.persistPromise = qResolved;

        if(force || playlistIsModified.call(that)) {

            that.isDirty = false;
            that.playlistImp.inner.presentationEndTime = that.playlistImp.getCurrentTime() + that.playListLimits.manifestTimeWindowInMsec;
            that.lastPersistTime = Date.now() + that.playListLimits.minRefreshPlaylistInterval;
            try {
                that.logger.debug("write %s atomically",that.playlistPath);
                if( playlistUtils.playlistConfig.humanReadable ) {
                    var p1 = fsUtils.writeFileAtomically(that.playlistPath, JSON.stringify(that.playlistImp));
                    try {
                        playlistUtils.playlistConfig.humanReadablePass = true;
                        var p2 = fsUtils.writeFileAtomically(that.playlistPath + ".human", JSON.stringify(that.playlistImp, undefined, 1));
                    } finally {
                        playlistUtils.playlistConfig.humanReadablePass = false;
                    }
                    that.persistPromise = Q.allSettled([p1,p2]);
                } else {
                    that.persistPromise = fsUtils.writeFileAtomically(that.playlistPath, JSON.stringify(that.playlistImp));
                }
            } catch (err) {
                that.persistPromise = Q.reject(err);
            }
        }
    }
    return that.persistPromise;
};

var finalizeStart = function (){
    var that = this;

    that.playlistImp.addListener(that);

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

            if(err || config.get('dontInitializePlaylist')){
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
            that.logger.warn("PlaylistGenerator.handleEvent. handle gap_limit_exceeded(%s-%s)",arg.from,arg.to);
            that.playlistImp.collapseGap(arg);
            that.isDirty = true;
            that.gapsCounter++;
            break;
        case playlistUtils.ClipEvents.chunk_reorder:
            that.logger.warn("PlaylistGenerator.handleEvent. handle chunk_reorder(%s-%s)",arg.from,arg.to);
            that.playlistImp.onReorder(arg);
            that.isDirty = true;
            that.reorderCounter++;
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

// TODO: getChunkCount is just a hint
PlaylistGenerator.prototype.getChunkCount = function(flavorId){
    var that = this;

    var seqN = that.playlistImp.inner.flavor2SeqIndex[flavorId];
    return _.reduce(that.playlistImp.inner.sequences[seqN].inner.clips,function(val,c){
        return _.min(c.inner.sources,function(src){
            return src.inner.durations.length;
        });
    },0);
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

PlaylistGenerator.prototype.validate = function() {
    return this.playlistImp.validate();
};

PlaylistGenerator.prototype.checkFileExists = function(fileName){
    var that = this;

    return _.any(that.playlistImp.inner.sequences,function(seq){
        return _.any(seq.inner.clips, function(src){
            return src.checkFileExists(fileName);
        });
    });
};



module.exports = PlaylistGenerator;