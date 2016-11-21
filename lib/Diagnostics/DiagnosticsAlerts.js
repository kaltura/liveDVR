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
    "InvalidTypeAlert" : 7,
    "MissingReferenceAlert" : 8,
    "ValueOutOfRangeAlert": 9,
    "TargetdurationExceededAlert" : 10,
    "PtsDiscontinuityAlert" : 11
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

// ptsHigh disignates source last chunk pts + chunk duration, effectively highest pts value
// ptsNew is the pts of a chunk attempted to append.
// OverlapPtsAlert is generated when ptsHigh >> ptsNew and means that encoder pts has jumped back
class OverlapPtsAlert extends  Alert {
    constructor(flavor, chunkName,ptsNew,ptsHigh) {
        super(flavor, chunkName);
        this.args.ptsNew = ptsNew;
        this.args.ptsHigh = ptsHigh;
    }
    get msg(){
        return super.msg +  `pts jumped back in time: amount: ${this.args.ptsHigh-this.args.ptsNew} ms`;
    }
}

class InvalidTypeAlert extends  Alert {
    constructor(flavor, chunkName,memberName,expectedType, actualType) {
        super(flavor, chunkName);
        this.args.memberName = memberName;
        this.args.expectedType = expectedType;
        this.args.actualType = actualType;
    }
    get msg(){
        return super.msg +  `invalid type: member: ${this.args.memberName} . expected: ${this.args.expectedType} actual ${this.args.actualType}`;
    }
}

class MissingReferenceAlert extends  Alert {
    constructor(flavor, chunkName,memberName) {
        super(flavor, chunkName);
        this.args.memberName = memberName;
    }
    get msg(){
        return super.msg +  `undefined or null : member: ${this.args.memberName}`;
    }
}

class ValueOutOfRangeAlert extends  Alert {
    constructor(flavor, chunkName,memberName,value) {
        super(flavor, chunkName);
        this.args.memberName = memberName;
        this.args.value = value;
    }
    get msg(){
        return super.msg +  `value ${this.args.value} is invalid for ${this.args.memberName}`;
    }
}

class TargetdurationExceededAlert extends  Alert {
    constructor(flavor, chunkName,memberName,duration,targetDuration) {
        super(flavor, chunkName);
        this.args.memberName = memberName;
        this.args.duration = duration;
        this.args.targetDuration = targetDuration;
    }
    get msg(){
        return super.msg +  `duration ${this.args.duration}  exceeds target duration ${this.args.targetDuration} for ${this.args.memberName}`;
    }
}

class PtsDiscontinuityAlert extends  Alert {
    constructor(flavor, chunkName,ptsHigh,ptsNew) {
        super(flavor, chunkName);
        this.args.ptsHigh = ptsHigh;
        this.args.ptsNew = ptsNew;
    }
    get msg(){
        return super.msg +  `pts discontinuity input=${this.args.ptsNew} high=${this.args.ptsHigh}`;
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
    InvalidTypeAlert : InvalidTypeAlert,
    MissingReferenceAlert : MissingReferenceAlert,
    ValueOutOfRangeAlert: ValueOutOfRangeAlert,
    TargetdurationExceededAlert : TargetdurationExceededAlert,
    PtsDiscontinuityAlert : PtsDiscontinuityAlert
};