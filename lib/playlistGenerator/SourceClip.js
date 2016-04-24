/*
 *   vod packager playlist implementation.
 *   for details see https://github.com/kaltura/nginx-vod-module
 * */

/*
    SourceClip class
    used in the sequences collection as a single clip info (as opposed to MixFilterClip which represents multiple small chunks)
* */
function SourceClip() {
    if( typeof this.type === 'string' ) {
        this.type = "source";
        this.path = '';
        this.expires = 0;
    }
    return this;
}

SourceClip.prototype = {
    get clipCount () {
        return 1;
    }
};

SourceClip.prototype.insert = function (fileInfo,expires) {
    var that = this;

    that.path = fileInfo.path;
    that.expires = expires;
    that.getTotalDuration = function(){
        return fileInfo.videoDuration;
    };
    that.getDTSRange = function(){
        return { min:Math.min(fileInfo.videoFirstDTS,fileInfo.audio.encoderDTS),
            max: Math.max(fileInfo.video.FirstDTS+fileInfo.videoDuration,fileInfo.audio.FirstDTS+fileInfo.audio.duration)
        };
    }
};

SourceClip.prototype.validate = function validate(){

};

SourceClip.prototype.checkExpires = function (expires) {
    var that = this;

    if(that.expires !== undefined && expires >= that.expires){
        var retVal = [that.path];
        that.path = null;
        return retVal;
    }
};

SourceClip.prototype.isEmpty = function(){
    return !this.path;
};

SourceClip.prototype.updateOffset = function(firstClipTime){
};

SourceClip.prototype.collapseGap = function (from,to) {
};
SourceClip.prototype.onSerialize = function () {
};

module.exports  = SourceClip;