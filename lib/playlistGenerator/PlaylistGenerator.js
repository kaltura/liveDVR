/*
 *   vod packager playlist implementation.
 *   for details see https://github.com/kaltura/nginx-vod-module
 * */

var Q = require('q');
var config = require('./../../common/Configuration');
var fs = require('fs');
var Playlist = require('./Playlist');
var playlistUtils = require('./playlistGenrator-utils');
var util = require('util');
var persistenceFormat = require('./../../common/PersistenceFormat');
var path = require('path');
var qio = require('q-io/fs');
var _ = require('underscore');
var fsUtils = require('./../utils/fs-utils');

var qResolved = Q.resolve();
var empty = function(){};

function PlaylistGenerator (entryObject,isNewSession,logger){

    var that = this;

    // object state
    that.entryId = entryObject.entryId;
    that.isNewSession = isNewSession;
    if(entryObject.getStreamInfo) {
        that.streamInfo = entryObject.getStreamInfo();
    }
    that.flavorsObjArray = null;
    that.getCurrentTime = Date.now;
    that.isDirty = false;
    that.stopPromise = null;
    that.startPromise = null;
    that.persistPromise = qResolved;
    that.logger = logger;
    that.playListLimits =  {
        manifestTimeWindow: entryObject.dvrWindow * 1000,
        maxClipCountPerPlaylist:Math.max(10,entryObject.maxChunkCount),
        maxClipDuration :config.get('maxClipDuration') || 5 * 60 * 1000,
        maxChunksPerClip:config.get('maxChunksPerClip') || 25,
        minRefreshPlaylistInterval:config.get('minRefreshPlaylistInterval') || 20000
    };
    that.lastPersistTime = Date.now() - that.playListLimits.minRefreshPlaylistInterval - 1000;
    that.playlistPath = path.join(persistenceFormat.getEntryFullPath(entryObject.entryId),persistenceFormat.getMasterManifestName());

    // according to https://github.com/kaltura/nginx-vod-module
    that.playlistImp = new Playlist(that.logger);
}

var isStopped = function isStopped(){
    return this.stopPromise && this.stopPromise.promise.state === 'fulfilled';
};
var isRunning = function isRunning(){
    return this.startPromise && Q.isPending(this.stopPromise.promise);
};

var addNewClip = function addNewClip (fileInfo){
    var that = this;

    if(!isRunning.call(that)) {
        fs.unlink(fileInfo.path,empty);
        throw new Error('Playlist is stopped');
    }

    var lastClip = that.playlistImp.getClipFromFileInfo(fileInfo,handleEvents.bind(that));

    var expires;
    if(that.playListLimits.manifestTimeWindow) {
        expires = that.getCurrentTime() + that.playListLimits.manifestTimeWindow;
    }

    lastClip.insert(fileInfo,expires);

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
            that.logger.info('Successfully deleted chunk ' + path.basename(pathToDelete));
        }).catch(function (err) {
            that.logger.info('Error deleting a chunk which was removed from a manifest - error %s',err);
        });
};

var checkRemoveChunks = function(flavor){
    var that = this;

    var removedChunks = [];
    var curTime = that.getCurrentTime();
    var remove = false;
    do {
        remove = false;

        if(that.playlistImp.inner.durations.length > that.playListLimits.maxClipCountPerPlaylist ){
            that.playlistImp.durations.shift();
            that.isDirty = remove = true;
        } else {

            var clips = that.playlistImp.getClipListForFlavor(flavor);

            while( clips.length ) {
                var clip = clips[0];
                var expiredPaths = clip.checkExpires(curTime,
                    that.playListLimits.manifestTimeWindow ? undefined : that.playListLimits.maxClipCountPerPlaylist);
                if (expiredPaths.length) {
                    removedChunks = removedChunks.concat(expiredPaths);
                    that.isDirty = true;
                    if (clip.isEmpty()) {
                        clips.shift();
                    }
                } else {
                    break;
                }
            }
        }
    } while(remove === true);

    // Delete the obsolete chunks from disk
    return _.map(removedChunks, function (pathToDelete) {
        // Delete on a best effort basis
        removeFile.call(that,pathToDelete);
        return path.basename(pathToDelete);
    });
};

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

        var playlist = that.playlistImp.inner;

        playlist.presentationEnd = !isRunning.call(that);

        do {
            if (playlist.durations.length > 0) {
                var minMaxFirstClip = that.playlistImp.recalculateOffsetsAndDuration(0),
                    minMaxLastClip = playlist.durations.length > 1 ? that.playlistImp.recalculateOffsetsAndDuration(playlist.durations.length - 1) : minMaxFirstClip;

                if (!(minMaxFirstClip && minMaxLastClip)) {
                    break;
                }

                // only update manifest if all downloaders have contributed i.e. playback range changed
                if (!force && that.playlistImp.minMax && that.playlistImp.minMax.min === minMaxFirstClip.min && that.playlistImp.minMax.max === minMaxLastClip.max) {
                    break;
                }

                if (playlist.segmentBaseTime === 0) {
                    playlist.segmentBaseTime = playlist.firstClipTime;
                }

                that.playlistImp.minMax = {min: minMaxFirstClip.min, max: minMaxLastClip.max};

                if (playlist.discontinuity) {
                    var segmentDuration = config.get('vodPackagerSegmentDuration') || 10000;
                    playlist.initialSegmentIndex = Math.floor((playlist.firstClipTime - playlist.segmentBaseTime) / segmentDuration);
                }

            } else {
                delete that.playlistImp.minMax;
            }
            that.isDirty = false;
            that.lastPersistTime = Date.now() + that.playListLimits.minRefreshPlaylistInterval;
            try {
                that.logger.debug("write %s atomically",that.playlistPath);
                that.persistPromise = fsUtils.writeFileAtomically(that.playlistPath, JSON.stringify(that.playlistImp));
            } catch (err) {
                that.persistPromise = Q.reject(err);
            }
        }while(false);
    }
    return that.persistPromise;
};

var finalizeStart = function (){
    var that = this;

    that.playlistImp.addListener(handleEvents.bind(that));

    that.startPromise.resolve();
};

PlaylistGenerator.prototype.start = function start() {
    var that = this;

    if(that.startPromise)
        return that.startPromise;

    try {
        that.startPromise = Q.defer();
        that.stopPromise = Q.defer();

        fs.exists(that.playlistPath,function(ok) {

            if(!ok || config.get('dontInitializePlaylist')){
                persistPlayList.call(that)
                    .then( function(){
                        finalizeStart.call(that);
                    })
                    .catch(that.startPromise.reject.bind(that.startPromise));
                return;
            }

            var rs = fs.createReadStream(that.playlistPath);

            rs.on('error', function (err) {
                rs.close();
                that.startPromise.reject(err);
            });

            Playlist.prototype.serializeFrom(rs,that.logger,function(newPlaylist){
                that.playlistImp = newPlaylist;
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


var handleEvents = function (type,arg) {
    var that = this;

    switch(type){
        case playlistUtils.ClipEvents.gap_limit_exceeded:
            that.logger.warn("PlaylistGenerator.handleEvents. handle gap_limit_exceeded(%s-%s)",arg.from,arg.to);
            that.playlistImp.collapseGap(arg.from,arg.to);
            that.isDirty = true;
            break;
    }
};

PlaylistGenerator.prototype.toJSON = function () {
    var that = this;
    var diag = that.getDiagnostics();
    var diag = that.getDiagnostics();
    diag.playlistPath = that.playlistPath;
    return diag;
};

PlaylistGenerator.prototype.getChunkCount = function(flavorId){
    var that = this;

    seqN = that.playlistImp.inner.flavor2SeqIndex[flavorId];
    if(!seqN) {
        return 0;
    }
    return _.reduce(that.playlistImp.sequences[seqN].clips,function(c,val){
        return c.clipCount + val;
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
            that.logger.error("Error cleaning folder because of transcoding profile change: %s", error);
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


module.exports = PlaylistGenerator;