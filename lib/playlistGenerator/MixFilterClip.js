/*
 *   vod packager playlist implementation.
 *   for details see https://github.com/kaltura/nginx-vod-module
 * */

var ConcatSource = require('./ConcatSource');
var _ = require('underscore');
var util = require('util');
var playlistUtils = require('./playlistGen-utils');
var PlaylistItem = require('./PlaylistItem');
var BroadcastEventEmitter = require('./BroadcastEventEmitter');
var config = require('./../../common/Configuration');
var path = require('path');
var loggerModule = require('../../common/logger');
const diagnosticsAlerts = require('../Diagnostics/DiagnosticsAlerts');
const InvalidClipError = require('../Diagnostics/InvalidClipError');

/*
 MixFilterClip class.
 used in playlist sequences collection of clips.
 internally implements collection of media tracks each containing multiple chunks - ConcatSource instances.
 */
function MixFilterClip(loggerInfo, index, playlist,  seq, clipTime, durationObj,serializationCtx) {

    this.id = loggerInfo + "[c-" + index + "]";
    this.loggerInfo = loggerInfo;
    this.logger = loggerModule.getLogger("MixFilterClip",this.id );
    if(!clipTime){
        playlist.checkAddClipTime(seq);
        clipTime    = playlist.inner.clipTimes.last;
        durationObj = playlist.inner.durations.last;
    }
    this.clipTime = clipTime;
    this.clipDuration = durationObj;
    this.seq = seq;

    PlaylistItem.prototype.constructor.call(this, this.logger, playlist, serializationCtx);
    this.addListener(seq);
    if(!this.isInitialized()) {
        this.inner.type = "mixFilter";
        this.inner.sources = []; //collection of ConcatSource
        // key frame information
        // this should be held by clip Source however it is is managed here
        // for faster access by vod-packager
        this.inner.keyFrameDurations = []; // list of key frame distances
        this.inner.firstKeyFrameOffset = Infinity; //relative to firstClipTime,
    }

    this.emit(playlistUtils.ClipEvents.clip_added,this);
}

util.inherits(MixFilterClip,PlaylistItem);


Object.defineProperty(MixFilterClip.prototype , "sources", {
    get: function get_Sources() {
        return this.inner.sources;
    }
});

var getSrcDuration = function(val,src){
    var r = src.getDTSRange();
    var d = r.valid ? (r.max - r.min) : 0;

    return Math.max(d,val);
};

// get available clip range (for garbage collection)
Object.defineProperty(MixFilterClip.prototype , "availableDuration", {
    get: function get_availableDuration() {
        return _.reduce(this.inner.sources,getSrcDuration,0);
    }
});

// insures internal state is valid at given point of time
MixFilterClip.prototype.doValidate = function mix_doValidate(opts) {
    var that = this;

    if(that.inner.basePath && !fs.existsSync(that.inner.basePath)){
        that.logger.warn("that.inner.basePath && !fs.existsSync(that.inner.basePath)" + that.inner.basePath);
        return false;
    }

    if(that.inner.type !== "mixFilter") {
        that.logger.warn('type !== "mixFilter"');
        return false;
    }

    if( that.inner.sources.length === 0 || that.inner.sources.length > 2 ) {
        that.logger.warn('sources.length === 0 || sources.length > 2');
        return false;
    }

    if(that.inner.keyFrameDurations && that.inner.keyFrameDurations.length > 0) {
        if (that.inner.firstKeyFrameOffset == Infinity) {
            that.logger.warn('that.inner.firstKeyFrameOffset == Infinity && that.inner.keyFrameDurations.length > 0');
            return false;
        }
        //TODO: add source kf validation
    }

    /*
     if( typeof that.clipIndex  != 'number' ) {
     that.logger.warn('typeof that.clipIndex  != Number');
     return false;
     }
     */
    return that.inner.sources.every(function(s){
        return s.doValidate(opts);
    });
};

var exceedFactor = 2;

function validateMediaTrack(fileInfo,m){
    let that = this;

    let track = fileInfo[m];

    let member;
   if(_.any( ['firstDTS','firstEncoderDTS','duration'], (mem) => {
        member = mem;
        return typeof track[member] !== 'number'
    })){
       that.logger.warn(`Typeof fileInfo.${m}.${member} !== 'number'`);
       return new diagnosticsAlerts.InvalidTypeAlert(fileInfo.flavor,fileInfo.chunkName,
           `fileInfo.${m}.${member}`,'number',typeof track[member] );
    }

    if (track.duration <= 0) {
        that.logger.warn(`FileInfo.${m}.duration  <= 0`);
        return new diagnosticsAlerts.ValueOutOfRangeAlert(fileInfo.flavor,fileInfo.chunkName,
            `fileInfo.${m}.duration`,track.duration);
    }

    if(fileInfo.targetDuration && fileInfo.targetDuration * exceedFactor <  track.duration){
        that.logger.warn(`FileInfo.${m}.duration  > targetDuration %j > %j`,track.duration,fileInfo.targetDuration*exceedFactor);
        return new diagnosticsAlerts.TargetDurationExceededAlert(fileInfo.flavor,fileInfo.chunkName,
            `fileInfo.${m}.duration`,track.duration,fileInfo.targetDuration * exceedFactor);
    }
    if(m === 'video') {
        if (!fileInfo.video.keyFrameDTS || !fileInfo.video.keyFrameDTS.length) {
            that.logger.warn('FileInfo.video track has no key frames');
            return new diagnosticsAlerts.InvalidKeyFramesAlert(fileInfo.flavor,fileInfo.chunkName, []);
        }
    }
    return null;
}

function validateInput (fileInfo){
    var that = this;

    if(!fileInfo){
        that.logger.warn('Bad fileInfo');
        return new diagnosticsAlerts.MissingReferenceAlert(this.seq.inner.id,
            undefined,
            'fileInfo');
    }

    if(!fileInfo.startTime){
        that.logger.warn('FileInfo.startTime is not set to unix time');
        that.emit(playlistUtils.ClipEvents.diagnosticsAlert, that, new diagnosticsAlerts.NoID3TagAlert(fileInfo.flavor, fileInfo.chunkName));
    }

    if(!fileInfo.flavor){
        that.logger.warn('Bad fileInfo.flavor');
        return new diagnosticsAlerts.MissingReferenceAlert(this.seq.inner.id,
            fileInfo.chunkName,
            'fileInfo.flavor');
    }

    if(!fileInfo.sig || typeof fileInfo.sig !== 'string'){
        that.logger.warn('Bad fileInfo.sig');
        return new diagnosticsAlerts.MissingReferenceAlert(fileInfo.flavor,fileInfo.chunkName,
            'fileInfo.sig');

    }

    let media = _.compact(_.map(['video','audio'], (m) => {
        return fileInfo[m] ? m : null;
    }));
    
    if(!media.length){
        that.logger.warn('!fileInfo.video && !fileInfo.audio');
        return new diagnosticsAlerts.MissingReferenceAlert(fileInfo.flavor,fileInfo.chunkName,
            'fileInfo.video && fileInfo.audio');
    }

    let alertObj;
    if(_.any(media,(m)=>{
            alertObj = validateMediaTrack.call(that,fileInfo,m);
            return alertObj !== null;
    })){
        return alertObj;
    }
    
    let retVal = _.chain(that.inner.sources).map((src) => {
            let track = src.isVideo ? fileInfo.video : fileInfo.audio;
            if(_.isObject(track)) {
                return null;
            }
            that.logger.warn('track information is missing for %j', src.inner.tracks);
            return new diagnosticsAlerts.MissingTrackAlert(fileInfo.flavor, fileInfo.chunkName, src.inner.tracks);
        }).compact().value();
    if(retVal.length){
        return retVal[0];
    }

    let videoPts = null;
    let audioPts = null;

    if(fileInfo.video)
        videoPts = fileInfo.video.firstEncoderDTS;
    if(fileInfo.audio)
        audioPts = fileInfo.audio.firstEncoderDTS;

    if (videoPts !== null && audioPts !== null) {
        let tsInfo = fileInfo.ts_info;
        if(tsInfo){
            videoPts = tsInfo.video.dts + tsInfo.video.ptsDelay;
            audioPts = tsInfo.audio.dts + tsInfo.audio.ptsDelay;
        }
        let gap = Math.abs(videoPts - audioPts);
        if (gap > config.get('diagnostics').ptsMaxMisalignmentAllowedInMSec) {
            that.emit(playlistUtils.ClipEvents.diagnosticsAlert, that, 
                new diagnosticsAlerts.PtsMisalignmentAlert(fileInfo.flavor, fileInfo.chunkName, videoPts, audioPts, gap),fileInfo);
        }
    }

    return null;
};

var createConcatSource = function(index,type,path){
    var that = this;

    let newSrc = new ConcatSource(that.id + '[s-' + index + ']',that.playlist,that, type,path);
    newSrc.addListener(that);
    return newSrc;
};

var checkNewSource = function(type,fileInfo){
    var that = this;

    var source = _.filter(that.inner.sources,function(s){
        return s.inner.tracks[0] == type;
    });

    if(!source.length){
        source = createConcatSource.call(that,
            that.inner.sources.length,
            type+'1',
            fileInfo.path);
        that.inner.sources.push(source);
        return source;
    } else {
        return source[0];
    }
};

// add new chunk to sources
MixFilterClip.prototype.insert = function (fileInfo) {
    var that = this;

    let failedVal = validateInput.call(that,fileInfo);
    if(failedVal){
        throw new InvalidClipError(failedVal);
    }

    // create on demand new media track ConcatSource
    if(fileInfo.video){
        checkNewSource.call(this,'v',fileInfo);
    }
    if(fileInfo.audio){
        checkNewSource.call(this,'a',fileInfo);
    }

    that.logger.debug('insert %j',fileInfo);

    for( var idx = 0; idx < that.inner.sources.length; idx++ ) {
        var src = that.inner.sources[idx];

        var track;

        switch (src.inner.tracks[0]) {
            case 'v':
                track = fileInfo.video;
                break;
            case 'a':
                track = fileInfo.audio;
                break;
            default:
                throw new Error('unsupported track type ' + src.inner.tracks);
                break;
        }

        that.logger.trace('insert %s: Track=%s; Duration=%d First_dts=%d Enc_dts=%d wrap=%j',
            fileInfo.path, src.inner.tracks,
            track.duration.toFixed(2),
            track.firstDTS,
            track.firstEncoderDTS,
            track.wrapEncoderDTS);

        if( track.duration <= 0 ) {
            that.logger.warn('Problem inserting clip. Bad duration: [%d], clip: [%s]', track.duration, fileInfo.path);
            throw new Error('Clip duration <= 0');
        }

        src.concatChunk(fileInfo,track);
    }

    that.validate();

    return this;
};

// get range of DTS(PTS). returns least playable interval for all media or {Number.MIN_VALUE,Number.MAX_VALUE} in case there's none
MixFilterClip.prototype.getDTSRange = function(){
    var that = this;

    var retVal = new playlistUtils.TimeRange();

    // check if there is at least one source with no data in it
    let bEmptySource = _.reduce( that.inner.sources,(bSrcEmpty,s) => {
        var range = s.getDTSRange();
        if(range.valid) {
            retVal.mergeWith(range);
            return bSrcEmpty;
        }
        return true;
    },false);

    // if ther is return empty range
    if( bEmptySource ) {
        retVal.empty();
    }


    //that.logger.debug('getDTSRange. %j', retVal);

    if( !retVal.eq(playlistUtils.TimeRange.prototype.Invalid) ){
        playlistUtils.dbgAssert(retVal.valid);
    }

    return retVal;
};

// conveniency function - return duration of DTS(PTS) range
MixFilterClip.prototype.getTotalDuration = function(){
    var that = this;

    var range = that.getDTSRange();
    if(!range.valid){
        return 0;
    }
    return range.max - range.min;
};

MixFilterClip.prototype.isEmpty = function(){
    var sources = this.inner.sources;
    if(sources.length === 0)
        return true;
    return _.some(sources,function(s){
        return s.inner.durations.length === 0
    }) ;
};

// PlaylistItem override called during playlist being serialized from <whatever>
MixFilterClip.prototype.onUnserialize = function () {
    var that = this;

    that.inner.sources = _.map(that.inner.sources,function(s,index){
        return createConcatSource.call(that,index,s);
    });

    var videoSrcArr = _.filter(that.inner.sources, function (s) {
        return s.isVideo;
    });

    if(videoSrcArr.length) {
        videoSrcArr[0].KeyFrameDurations = that.inner.keyFrameDurations || [];
    }
};

// remove part of media tracks overlapping with gap range
MixFilterClip.prototype.collapseGap = function (from,to) {
    var that = this;
    _.each(that.inner.sources,function(s){
        s.collapseGap(from,to);
    });
};

MixFilterClip.prototype.toJSON = function () {
    var that = this;
    if(!playlistUtils.playlistConfig.humanReadablePass){
        var clipObj = PlaylistItem.prototype.toJSON.call(that);

        // fill in keyFrameDurations array
        var videoSrc = _.filter(clipObj.sources, function (src) {
            return src.isVideo;
        });
        if(videoSrc.length) {
            clipObj.firstKeyFrameOffset = videoSrc[0].inner.offset;
            clipObj.keyFrameDurations = videoSrc[0].KeyFrameDurations;
        }

        if( !clipObj.keyFrameDurations || !clipObj.keyFrameDurations.length ){
            clipObj =  _.omit(clipObj,['keyFrameDurations','firstKeyFrameOffset']);
        }

        return clipObj;

    } else {
        var clips = [];
        var jsonReps =  _.map(that.inner.sources,function(src){
            return  src.toJSON().items;
        });
        if(jsonReps.length) {
            var l = jsonReps[0].length;
            for (var i = 0; i < l; i++) {
                var media = {};
                _.each(jsonReps, function (items,index) {
                    // check for short tracks
                    var offset = l - items.length,
                        src = that.inner.sources[index].inner;
                    if(i >= offset) {
                        var item = items[i - offset];
                        item.paths = path.join(src.basePath, item.paths);
                        media[src.tracks] = item;
                    } else {
                        media[src.tracks] = {missing:true};
                    }
                });
                clips.push(media);
            }
        }
        return {
            type: that.inner.type,
            clips: clips
        };
    }
};

MixFilterClip.prototype.checkFileExists = function(fileName) {
    //this.logger.trace("checkFileExists %j %j sources",fileName,(this.inner && this.inner.sources) ? this.inner.sources.length : 0);
    return this.seq.checkFileExists(fileName);
};

MixFilterClip.prototype.split = function (r) {
    var that = this;

    that.logger.debug("Split %j",r);

    var newInst =  new MixFilterClip(that.loggerInfo,
        that.playlist.inner.durations.length,
        that.playlist, that.listenerCb);

    _.each(that.inner.sources, function(src) {
        var newSrc = checkNewSource.call(newInst, src.inner.tracks[0], {path: path.join(src.inner.basePath,src.inner.paths[0])});
        src.split(newSrc,r);
    });

    return newInst;

};

Object.defineProperty(MixFilterClip.prototype , "lastClipStartTime", {

    get: function get_lastClipStartTime() {
        var that = this;
        return _.map(that.inner.sources, function (src) {
            return src.durationsMan.itemCount ? src.durationsMan.firstDTS.last : -1;
        }).min();
    }
});

function checkFilesToBeRemoved (pathsOfRemovedChunks) {

    // only remove file if no source uses it...
    pathsOfRemovedChunks = _.filter(pathsOfRemovedChunks, file =>  !this.checkFileExists(file) );

    if(pathsOfRemovedChunks.length) {
        this.emit(playlistUtils.ClipEvents.modified);
    }
    return pathsOfRemovedChunks;
}

MixFilterClip.prototype.handleEvent = function (type,arg) {
    var that = this;

    switch(type){
        case playlistUtils.ClipEvents.clip_removed:
            if(!_.isEmpty(arguments[2])) {
                arguments[2] = checkFilesToBeRemoved.call(that,arguments[2]);
                if (arguments[2].length) {
                    that.emit.apply(that, arguments);
                }
            }
            break;
        case playlistUtils.ClipEvents.gap_limit_exceeded:
            /*if(that.inner.sources.length > 1 && arg.inner.tracks[0] !== 'v'){
                return;
            }*/
            //fallthrough
        default:
            //forward
            BroadcastEventEmitter.prototype.handleEvent.apply(that,arguments);
            break;
    }
};

// removed all sources
MixFilterClip.prototype.clearClip = function() {

    this.logger.info('clearClip');

    // for each source in removed clip, remove all chunks until clip is empty
    _.each(this.inner.sources, s => s.ClearAll());
}



module.exports = MixFilterClip;
