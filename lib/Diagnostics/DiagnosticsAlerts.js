/**
 * Created by gadyaari on 21/09/2016.
 */

var diagnosticsErrorCodes = {
    "TsConversionFailureAlert": 0,
    "NoID3TagAlert" : 1,
    "PtsMisalignmentAlert" : 2,
    "InvalidM3u8Alert" : 3,
    "MissingTrackAlert" : 4,
    "OverlapPtsAlert" : 5,
    "InvalidKeyFramesAlert" : 6,
    "ClipValidationFailedAlert" : 7
};



class Alert {
    constructor(flavor, chunkName) {
        this.args = { Flavor : flavor, ChunkName : chunkName };
        this.time = new Date();
        this.name = this.constructor.name;
        this.errorCode = diagnosticsErrorCodes[this.name];
    }
    
    toJSON() {
        return { Time : this.time, Code : this.errorCode, Arguments : this.args };
    }

    get msg (){
        return JSON.stringify(this.toJSON())
    }
}

class TsConversionFailureAlert extends  Alert {
    constructor(flavor, error, chunkName) {
        super(flavor, chunkName);
        this.args.Error = error;
    }
}

class NoID3TagAlert extends Alert {
    constructor(flavor, chunkName) {
        super(flavor, chunkName);
    }
}

class PtsMisalignmentAlert extends Alert {
    constructor(flavor, chunkName, videoPts, audioPts, gap) {
        super(flavor, chunkName);
        this.args.Video = videoPts;
        this.args.Audio = audioPts;
        this.args.Gap = gap;
    }
}

class InvalidM3u8Alert extends Alert {
    constructor(flavor, chunkName, duration) {
        super(flavor, chunkName);
        this.args.Duration = duration;
    }
}

class MissingTrackAlert extends  Alert {
    constructor(flavor, chunkName, trackId) {
        super(flavor, chunkName);
        this.args.trackId = trackId;
    }
}

class InvalidKeyFramesAlert extends Alert {
    constructor(flavor, chunkName,keyFrames) {
        super(flavor, chunkName);
        this.args.keyFrames = keyFrames;
    }
}

class OverlapPtsAlert extends  Alert {
    constructor(flavor, chunkName,firstPts,lastPts) {
        super(flavor, chunkName);
        this.args.firstPts = firstPts;
        this.args.lastPts = lastPts;
    }
}

const ClipValidationFailedAlertReasons = {
    None : 0,
    InvalidType:1,
    MissingReference:2,
    ValueOutOfRange:3,
    TargetdurationExceeded: 4,
    Alert:5
};

const ClipValidationFailedAlertNone = {};

class ClipValidationFailedAlert extends  Alert {
    constructor(flavor, chunkName,reason,hintArray) {
        super(flavor, chunkName);
        this.args.validationReason = reason;
        if(hintArray) {
            this.args.hints = hintArray;
        }
    }

    static get None () {
        return ClipValidationFailedAlertNone;
    }

    get msg(){
        let str = `${this.name} ${this.args.Flavor} ${this.args.chunkName} ${this.time} ${this.errorCode} ${this.args.validationReason} `
        switch(this.args.reason){
            case ClipValidationFailedAlertReasons.InvalidType:
                str += `invalid type: member: ${this.args.hints[0]} . expected: ${this.args.hints[1]} actual ${this.args.hints[2]}`
                break;
            case ClipValidationFailedAlertReasons.MissingReference:
                str += `missing reference for ${this.args.hints[0]}`
                break;
            case ClipValidationFailedAlertReasons.ValueOutOfRange:
                str += `value ${this.args.hints[1]} is out of range for ${this.args.hints[0]}`
                break;
            case ClipValidationFailedAlertReasons.TargetdurationExceeded:
                str += `target duration exceeded: memeber: ${this.args.hints[0]} target duration: ${this.args.hints[1]} , duration: ${this.args.hints[2]}`
                break;
            case ClipValidationFailedAlertReasons.Alert:
                str += `alert: ${this.args.hints[0]}`
                break;
            case ClipValidationFailedAlertReasons.None:
                str += 'None'
                break;
            default:
                str += `invalid or uninitialized instance`
                break;
        }
        return str
    }
}

module.exports = {
    Alert:Alert,
    TsConversionFailureAlert : TsConversionFailureAlert,
    NoID3TagAlert : NoID3TagAlert,
    PtsMisalignmentAlert : PtsMisalignmentAlert,
    InvalidM3u8Alert : InvalidM3u8Alert,
    MissingTrackAlert: MissingTrackAlert,
    InvalidKeyFramesAlert: InvalidKeyFramesAlert,
    OverlapPtsAlert: OverlapPtsAlert,
    ClipValidationFailedAlert: ClipValidationFailedAlert,
    ClipValidationFailedAlertReasons: ClipValidationFailedAlertReasons
};