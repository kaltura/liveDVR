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
const MILLISEC_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
const expirationTimeWindowMilliSec = 1000 * config.get('expirationTimeWindowSec');
const maxClipsPerFlavor = config.get('maxClipsPerFlavor');

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
const hlsWindowProtectionFactor = 3;
// nginx vod module limits (hard coded), the size of the play window to 25 hrs.
// It was decided to limit the max play window (DVR/VOD) to 24 hrs, living at the least, 1 hour margin.
const maxDVRWindowInMsec = 60 * 60 * 1000 * config.get("playlistConfig").maxDVRWindowInHours;
// additional time that ensures play window grows to configured size (regardless chunk duration)
const extraTimeMsec = 600000;

function applyHLSWindowFactor (val) {
    var calculatedWindowSizeMsec = Math.min( val * hlsWindowProtectionFactor, val * (hlsWindowProtectionFactor-1) + extraTimeMsec);
    return Math.min(calculatedWindowSizeMsec, maxDVRWindowInMsec + extraTimeMsec);

}
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



    if (_.has(options, 'recording') && options.recording == true){
        that.playListFormat = 'recording';
        var recordingMaxDurationMsec = config.get('recording').recordingMaxDurationInHours * 60 * 60 * 1000;
        that.playListLimits = {
            manifestTimeWindowInMsec: recordingMaxDurationMsec + extraTimeMsec
        }
        that.playlistPath = path.join(options.recordingSessionPath, persistenceFormat.getMasterManifestName());
        that.endlist = true;
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
        that.playListFormat = 'live';
        that.playListLimits =  {};
        that.playListLimits.liveWindowDurationMsec = Math.ceil(entryObject.playWindow * 1000);
        that.playListLimits.manifestTimeWindowInMsec = applyHLSWindowFactor(that.playListLimits.liveWindowDurationMsec)
        that.playlistPath = path.join(persistenceFormat.getEntryBasePath(that.entryId),persistenceFormat.getMasterManifestName());
    }


    // according to https://github.com/kaltura/nginx-vod-module
    that.playlistType = 'live';
    setPlayList.call(that,new Playlist(that.loggerInfo, undefined, that.playlistType, that.playListFormat));
    that.gapsCounter = 0;
    that.reorderCounter = 0;

    that.driftInfo = {}
    that.tsSaveQueue = qResolved;
}

util.inherits(PlaylistGenerator,EventEmitter);

Object.defineProperty(PlaylistGenerator.prototype , "actualWindowSize", {
    get: function get_rollingWindowFactor() {
        return this.playListLimits.manifestTimeWindowInMsec;
    }
});

function saveTSChunk (fileInfo) {
    let that = this;
    return that.tsSaveQueue = that.tsSaveQueue.finally(
        () => { return fileInfo.saveAsTS() }).
        finally( () => {return qResolved} );
}

function renameMP4File (fileInfo) {
    let that = this;
    return that.tsSaveQueue = that.tsSaveQueue.finally(
        () => {
            return qio.rename(fileInfo.path,fileInfo.path + '.saved') }).
        catch((err) => {
            that.logger.warn(`failed to rename file ${fileInfo.path} error ${ErrorUtils.error2string(err)}`);
            return qResolved
        })
}

var setPlayList = function (playlist){
    var that = this;

    that.playlistImp = playlist;
    that.playlistImp.playListLimits = that.playListLimits;
    that.playlistImp.getCurrentTime = Date.now;
    // set presentation end time to 10 years ahead
    that.playlistImp.inner.presentationEndTime = that.endlist ? 0 : that.playlistImp.getCurrentTime() + MILLISEC_IN_YEAR * 10;

    if(that.playListLimits.liveWindowDurationMsec) {
        that.playlistImp.inner.liveWindowDuration = that.playListLimits.liveWindowDurationMsec;
    }
    that.playlistImp.addListener(that);

};

function makeFlavorEventName(flavorId,event){
    return `${flavorId}-${event}`;
}

function isRunning(){
    return this.startPromise && !this.stopPromise;
};

function  getDelayedForFlavor (flavor) {

    var seq = this.playlistImp.getSequenceForFlavor(flavor);

    if(!seq.scheduledForRemoval){
        seq.scheduledForRemoval = {};
    }

    return seq.scheduledForRemoval;
}

var checkDelayedRemovalChunksReady = function(flavor){
    var that = this;

    let removedChunks = [];

    var delayedChunks = getDelayedForFlavor.call(that,flavor);

    var n = that.playlistImp.getCurrentTime();
    var keys = _.keys(delayedChunks);
    _.every(_.values(delayedChunks),function(fi,index) {
        if (n > fi.when) {
            var ready = keys[index];
            that.logger.warn("PlaylistGenerator.delayChunkRemoval. chunk is ready %j",ready);
            removedChunks.push(ready);
            delete delayedChunks[ready];
            return true;
        } else {
            return false;
        }
    });

    if(removedChunks.length){
        that.emit(makeFlavorEventName.call(this,flavor,'playlist-clips-removed'),removedChunks)
    }
};

function handleClipError (fileInfo){
    var that = this;

    var delayedChunks = getDelayedForFlavor.call(that,fileInfo.flavor);

    var chunkname = path.basename(fileInfo.path);

    if(delayedChunks[chunkname]) {
        return;
    }

    var n = that.playlistImp.getCurrentTime();

    var when = n + Math.max(fileInfo.windowSize || 0,1000*60*5);

    that.logger.warn("handleClipError. chunk %j. will be removed in %j ms",chunkname,when-n);

    delayedChunks[chunkname] = { when: when, path: persistenceFormat.getRelativePathFromFull(fileInfo.path)};

    renameMP4File.call(that,fileInfo);
}

// private insert a new media chunk
function addNewClip (fileInfo) {
    var that = this;

    try {

        if (!isRunning.call(that)) {
            throw new Error('PlaylistGenerator.addNewClip. PlaylistGenerator is stopped');
        }

        if(that.playlistImp.insertChunk(fileInfo)) {
            that.isDirty = true;
        }

    } catch(err){
        that.logger.warn("[%s] PlaylistGenerator.addNewClip. exception %j",fileInfo.flavor,ErrorUtils.error2string(err));
        if( err instanceof InvalidClipError){
            that.handleEvent('diagnosticsAlert', that.playlistImp , err._alert, fileInfo );
        }
        fileInfo.error = err;
        handleClipError.call(that,fileInfo);
    }
}

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

    let seq = that.playlistImp.getSequenceForFlavor(flavor);

    seq.checkExpires(that.playlistImp.getCurrentTime(), that.playlistImp.totalDuration);

    seq.checkMaxAllowedClips(maxClipsPerFlavor);

    checkDelayedRemovalChunksReady.call(that, flavor);

};

PlaylistGenerator.prototype.getTotalDuration = function () { //todo check with igor!
    return this.playlistImp.totalDuration
}

// insert list of new chunks return list of obsolete ones and a promise from playlist serialization
PlaylistGenerator.prototype.update = function (chunklist) {
    var that = this;

    _.each(chunklist,addNewClip,that);

    if(chunklist.length) {
        checkRemoveChunks.call(that,chunklist[0].flavor);
    }

    return [that.tsSaveQueue,persistPlayList.call(that)];
};

PlaylistGenerator.prototype.getDiagnostics = function (opts) {
    var that = this;
    return that.playlistImp.getDiagnostics(opts);
};

PlaylistGenerator.prototype.setEncoderBitrate = function(flavor, encodedBitrate) {
    this.playlistImp.updateEncodedBitrate(flavor, encodedBitrate);
};

var doPersist =  function() {
    var that = this;

    that.emit('beforePlaylistChanged', that);

    that.isDirty = false;
    if (that.playListFormat === 'live'){
        that.playlistImp.inner.expirationTime =  that.playlistImp.getCurrentTime() + expirationTimeWindowMilliSec;
    }
    try {
        that.logger.info("write %s atomically", that.playlistPath);
        that.playlistImp.validate();
        var jsonStr = JSON.stringify(that.playlistImp);
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
function persistPlayList(force = undefined) {
    var that = this;

    if(that.isDirty || force) {

        if(Q.isPending(that.persistPromise)){
            return that.persistPromise
                .then( function(){
                    return persistPlayList.call(that);
                });
        }

        that.persistPromise = qResolved;

        if(that.playlistImp.isModified() || force ) {

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
                if(newPlaylist instanceof Error) {
                    newPlaylist = new Playlist(that.loggerInfo, undefined, that.playlistType, that.playListFormat);
                }
                setPlayList.call(that, newPlaylist);
            }, true, that.playListFormat)
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

function removeObsoleteChunks(flavor,removedChunks) {
    let that = this;

    if (removedChunks.length) {
        var flavorBasePath = persistenceFormat.getFlavorFullPath(that.entryId, flavor);
        // Delete the obsolete chunks from disk
        removedChunks = _.map(removedChunks, function (pathToDelete) {
            // Delete on a best effort basis
            removeFile.call(that, path.join(flavorBasePath, pathToDelete));
            return path.basename(pathToDelete);
        });

        that.emit(makeFlavorEventName.call(this,flavor,'playlist-clips-removed'),removedChunks)
    }
}


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
            let fileInfo = arguments[3]
            if(fileInfo){
                saveTSChunk.call(that,fileInfo);
            }
            that.logger.trace("handleEvent. raising %s",arguments[2].msg);
            that.emit('diagnosticsAlert', arguments[2]);
            break;
        case playlistUtils.ClipEvents.clip_removed:
            let flavorId = arguments[1],paths = arguments[2];
            removeObsoleteChunks.call(this,flavorId,paths)
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
    setPlayList.call(that,new Playlist(that.loggerInfo, undefined, that.playlistType, that.playListFormat));

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

/*
*   acts as event emitter on/addListener only on per-flavor basis.
*   allows for event multiplexing
* */
PlaylistGenerator.prototype.flvAddListener =  PlaylistGenerator.prototype.flvOn = function(flavorId,event,handler) {
    EventEmitter.prototype.on.call(this,makeFlavorEventName.call(this,flavorId,event),handler);
};

PlaylistGenerator.prototype.flvRemoveListener = function(flavorId,event,handler) {
    EventEmitter.prototype.removeListener.call(this,makeFlavorEventName.call(this,flavorId,event),handler);
};

PlaylistGenerator.prototype.MaxClipCountReached = function () {
    if (this.playlistImp.inner.sequences.length > 0){
        return this.playlistImp.inner.sequences[0].clips.length >= maxClipsPerFlavor
    }
    return false

}
PlaylistGenerator.prototype.setBasePath = function(newBasePath){

    //TODO WARNIING! ASSUME THAT BASEPATH IS IDENTICALS, TRUE ONLY ON RECORDING
    _.each(this.playlistImp.inner.sequences, (s) => {
        _.each( s.clips, (c) => {
            _.each( c.sources, (src) => {
                let flavor = path.basename(src.inner.basePath);
                src.inner.basePath = path.join(newBasePath, flavor) + '/';
            })
        })
    });
    return persistPlayList.call(this,true).then(()=>{
            this.playlistPath = path.join(newBasePath, persistenceFormat.getMasterManifestName());
            this.logger.info("Successfully flush playlist with the newBasePath %s",newBasePath)
    },
        (err)=>{
            this.logger.error("Failed to flush playlist with the newBasePath %s : %s",newBasePath, ErrorUtils.error2string(err))
        })
};




module.exports = PlaylistGenerator;
