var Q = require('q');
var config = require('./../../common/Configuration');
var fs = require('fs');
var PlaylistUtils = require('./../utils/playlistGenrator-utils');
var util = require('util');
var persistenceFormat = require('./../../common/PersistenceFormat');
var path = require('path');
var qio = require('q-io/fs');
var _ = require('underscore');

var qResolved = Q.resolve();
var empty = function(){};

function PlaylistGenerator (entryObject,isNewSession,logger){

    var that = this;

    // object state
    that.entryId = entryObject.entryId;
    that.isNewSession = isNewSession;
    that.streamInfo = entryObject.getStreamInfo();
    that.flavorsObjArray = null;
    that.getCurrentTime = Date.now;
    that.isDirty = false;
    that.stopPromise = null;
    that.startPromise = null;
    that.logger = logger;
    that.playListLimits =  {
        manifestTimeWindow: entryObject.dvrWindow * 1000,
        maxClipCountPerPlaylist:Math.max(10,entryObject.maxChunkCount),
        maxClipDuration :config.get('maxClipDuration') || 5 * 60 * 1000,
        maxChunksPerClip:config.get('maxChunksPerClip') || 25,
        minRefreshPlaylistInterval:config.get('minRefreshPlaylistInterval') || 1000
    };

    that.playlistPath = path.join(persistenceFormat.getEntryFullPath(entryObject.entryId),persistenceFormat.getMasterManifestName());

    // according to https://github.com/kaltura/nginx-vod-module
    that.playlistImp = new PlaylistUtils.Playlist();

    return {
        update: function(playlist){
            return that.update(playlist);
        },
        createManifest: function (){
            return that.createManifest();
        },
        stop: function (){
            return that.stop();
        },
        getDiagnostics: function(opts){
            return that.getDiagnostics(opts);
        },
        getChunkCount: function(flavorId){
            return that.getChunkCount(flavorId);
        },
        toJSON: function(){
            return that.toJSON();
        }
    };

}

var checkIsStopped = function checkIsStopped(){
    return this.stopPromise && this.stopPromise.promise.state === 'fulfilled';
};

var getClipFromFileInfo = function (fileInfo) {
    var that = this;

    var clips = that.playlistImp.getClipListForFlavor(fileInfo.flavor);

    var lastClip = clips.length > 0 ? clips[clips.length - 1] : null;

    if( !lastClip/*
     || lastClip.type === 'source'
     || (lastClip.type === 'mixFilter'
     && (lastClip.sources[0].paths.length > that.playListLimits.maxChunksPerClip
     || lastClip.getDuration(that.logger) + fileInfo.videoDuration > that.playListLimits.maxClipDuration))*/
    ) {
        var newClip = new PlaylistUtils.MixFilterClip();
        newClip.addListener(handleEvents.bind(that));
        clips.push(newClip);
    }
    return clips[clips.length - 1];
};

var addNewClip = function addNewClip (fileInfo){
    var that = this;

    if(checkIsStopped.call(that)) {
        fs.unlink(fileInfo.path,empty);
        throw new Error('Playlist is stopped');
    }

    var lastClip = getClipFromFileInfo.call(that,fileInfo);

    var expires;
    if(that.playListLimits.manifestTimeWindow) {
        expires = that.getCurrentTime() + that.playListLimits.manifestTimeWindow;
    }

    lastClip.insert(fileInfo,expires);

    // REMOVE: use in debug tests only!
    if(!lastClip.validate({validateClips:true})){
        that.logger.warn("PlaylistGenerator.addNewClip. lastClip.validate failed - bug in playlist");
    }
    if(!that.playlistImp.validate()){
        that.logger.warn("PlaylistGenerator.addNewClip. that.playlistImp.validate failed - bug in playlist");
    }

    that.isDirty = true;
};

var checkRemoveChunks = function(flavor){
    var that = this;

    var removedChunks = [];
    var curTime = that.getCurrentTime();
    var remove = false;
    do {
        remove = false;

        if(that.playlistImp.durations.length > that.playListLimits.maxClipCountPerPlaylist ){
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

    return removedChunks;
};

PlaylistGenerator.prototype.update = function update (playlist) {
    var that = this;

    var removedChunks = [];
    _.each(playlist,addNewClip,that);

    if(playlist.length) {
        removedChunks.concat(checkRemoveChunks.call(that,playlist[0].flavor));
    }
    return [persistPlayList.call(that), Q.resolve({removedChunks: removedChunks})];
};

PlaylistGenerator.prototype.getDiagnostics = function (opts) {
    var that = this;
    return that.playlistImp.getDiagnostics(opts);
};

var persistPlayList = function persistPlayList(force){
    var that = this;

    if(that.isDirty || force) {

        if(that.persistDef){
            return that.persistDef.promise
                .then( function(){
                    return persistPlayList.call(that,force);
                });
        }

        if(that.playlistImp.durations.length > 0) {
            var minMaxFirstClip = that.playlistImp.recalculateOffsetsAndDuration(0),
                minMaxLastClip = that.playlistImp.durations.length > 1 ? that.playlistImp.recalculateOffsetsAndDuration(that.playlistImp.durations.length - 1) : minMaxFirstClip;

            if(!(minMaxFirstClip && minMaxLastClip)){
                return qResolved;
            }

            // only update manifest if all downloaders have contributed i.e. playback range changed
            if (!force && that.minMax && that.minMax.min === minMaxFirstClip.min && that.minMax.max === minMaxLastClip.max) {
                return qResolved;
            }

            if(that.playlistImp.segmentBaseTime === 0){
                that.playlistImp.segmentBaseTime = that.playlistImp.firstClipTime;
            }

            that.minMax = {min: minMaxFirstClip.min, max: minMaxLastClip.max};

            if(this.discontinuity) {
                var segmentDuration  = config.get('vodPackagerSegmentDuration') || 10000;
                that.playlistImp.initialSegmentIndex = Math.floor((that.playlistImp.firstClipTime - that.playlistImp.segmentBaseTime) / segmentDuration);
            }

        } else {
            delete that.minMax;
        }
        that.isDirty = false;
        try {
            var ws = fs.createWriteStream(that.playlistPath + '.temp');
            that.persistDef = Q.defer();
            ws.on('finish', function () {
                ws.close();
                fs.rename(that.playlistPath + '.temp', that.playlistPath, function (err) {
                    that.logger.warn("diag: ",util.inspect(that.getDiagnostics()));
                    var def = that.persistDef;
                    that.persistDef = null;
                    err ? def.reject(err) : def.resolve();
                });
            });
            ws.on('error', function (err) {
                var def = that.persistDef;
                that.persistDef = null;
                def.reject(err);
                ws.close();
            });

            that.playlistImp.serializeTo(ws);


            return that.persistDef.promise;
        } catch(err){
            return Q.resolve(err);
        }
    }
    return qResolved;
};

var finaizeStart = function (){
    var that = this;

    if (!that.stopPromise) {
        that.stopPromise = Q.defer();
    }

    that.playlistImp.addListener(handleEvents.bind(that));

    that.startPromise.resolve();
};

PlaylistGenerator.prototype.start = function start() {
    var that = this;

    if(that.startPromise)
        return that.startPromise;

    try {
        that.startPromise = Q.defer();
        fs.exists(that.playlistPath,function(ok) {

            if(!ok || config.get('dontInitializePlaylist')){
                persistPlayList.call(that)
                    .then( function(){
                        finaizeStart.call(that);
                    })
                    .catch(that.startPromise.reject.bind(that.startPromise));
                return;
            }

            var rs = fs.createReadStream(that.playlistPath);

            rs.on('error', function (err) {
                rs.close();
                that.startPromise.reject(err);
            });

            that.playlistImp.serializeFrom(rs,function(pl){
                that.playlistImp = pl;
                persistPlayList.call(that)
                    .finally(function(){
                        finaizeStart.call(that);
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

    if( !that.startPromise )
        return Q.reject();
    if(Q.isPending(that.startPromise.promise)){
        return that.startPromise.then(stop);
    }
    if(!checkIsStopped.call(that)){
        that.startPromise = null;
        return persistPlayList.call(that,true).then( that.stopPromise.resolve );
    }
    return that.stopPromise.promise;
};

var handleEvents = function (type,arg) {
    var that = this;

    switch(type){
        case PlaylistUtils.ClipEvents.gap_limit_exceeded:
            that.logger.warn("PlaylistGenerator.handleEvents. handle gap_limit_exceeded(%s-%s)",arg.from,arg.to);
            that.playlistImp.collapseGap(arg.from,arg.to);
            that.isDirty = true;
            break;
    }
};

PlaylistGenerator.prototype.toJSON = function () {
    var that = this;
    return that.getDiagnostics();
};

PlaylistGenerator.prototype.getChunkCount = function(flavorId){
    var that = this;

    seqN = that.playlistImp.flavor2SeqIndex[flavorId];
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
}


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