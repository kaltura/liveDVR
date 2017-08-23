/**
 * Created by gadyaari on 21/09/2016.
 */

const DiagnosticsErrorCodes = {
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
    "TargetDurationExceededAlert" : 10,
    "PtsDiscontinuityAlert" : 11,
    "EntryRestartedAlert" : 100,
    "BitrateUnmatched" : 101,
    "NoAudioSignal" : 102,
    "NoVideoSignal" : 103,
    "PtsDrift" : 104,
    "EntryStopped" : 105,
    "EntryStarted" : 106
};

const AlertSeverity = {
    'debug': 0,
    'info': 1,
    'warning': 2,
    'error': 3,
    'critical': 4
};

const StreamHealth = {
    Good: 'Good',
    Fair: 'Fair',
    Poor: 'Poor'
};

class Alert {
    constructor(input = 1) {
        this.time = new Date();
        this.name = this.constructor.name;
        this.errorCode = DiagnosticsErrorCodes[this.name];
        this.key = this.hashFunction(input);
        this.severity = AlertSeverity.debug;
        this.health = this.calculateHealth();
        this.isTimed = false;
    }

    calculateHealth() {
        switch (this.severity) {
            case AlertSeverity.error:
            case AlertSeverity.critical:
                return StreamHealth.Poor;
            case AlertSeverity.warning:
                return StreamHealth.Fair;
            case AlertSeverity.debug:
            case AlertSeverity.info:
            default:
                return StreamHealth.Good;
        }
    }

    hashFunction(input) {
        // Create hash code for each input: For error code 101 -> has code will be 101_1 for input 1, or 101_2 for input 2.
        return this.errorCode + "_" + input;
    }

    toJSON() {
        return { Time : this.time, Code : this.errorCode, Arguments : this.args };
    }

    get msg() {
        return 'Diagnostics Alert: ' + JSON.stringify(this.toJSON());
    }

    get code() {
        return this.errorCode;
    }

    get hashKey() {
        return this.key;
    }
}

class FlavorAlert extends Alert {
    constructor(flavor, chunkName) {
        super();
        this.args = { Flavor : flavor, ChunkName : chunkName };
    }
}

class EntryAlert extends Alert {
    constructor(entryId, input = 1) {
        super(input);
        this.args = { EntryId : entryId, Input : input };
    }
}

class TsConversionFailureAlert extends  FlavorAlert {
    constructor(flavor, error, chunkName) {
        super(flavor, chunkName);
        this.args.Error = error;
        this.severity = AlertSeverity.warning;
    }
}

class NoID3TagAlert extends FlavorAlert {
    constructor(flavor, chunkName) {
        super(flavor, chunkName);
    }
}

class PtsMisalignmentAlert extends FlavorAlert {
    constructor(flavor, chunkName, videoPts, audioPts, gap) {
        super(flavor, chunkName);
        this.args.Video = videoPts;
        this.args.Audio = audioPts;
        this.args.Gap = gap;
    }
}

class InvalidM3u8Alert extends FlavorAlert {
    constructor(flavor, chunkName, duration) {
        super(flavor, chunkName);
        this.args.Duration = duration;
    }
}

class MissingTrackAlert extends  FlavorAlert {
    constructor(flavor, chunkName, trackId) {
        super(flavor, chunkName);
        this.args.trackId = trackId;
        this.severity = AlertSeverity.error;
        this.isTimed = true;
    }
}

class InvalidKeyFramesAlert extends FlavorAlert {
    constructor(flavor, chunkName, keyFrames) {
        super(flavor, chunkName);
        this.args.keyFrames = keyFrames;
        // TODO: Set severity to warning if keyframe interval is greater than 10
        this.severity = AlertSeverity.info;
        this.isTimed = true;
    }
}

// ptsHigh disignates source last chunk pts + chunk duration, effectively highest pts value
// ptsNew is the pts of a chunk attempted to append.
// OverlapPtsAlert is generated when ptsHigh >> ptsNew and means that encoder pts has jumped back
class OverlapPtsAlert extends  FlavorAlert {
    constructor(flavor, chunkName, ptsNew, ptsHigh) {
        super(flavor, chunkName);
        this.args.ptsNew = ptsNew;
        this.args.ptsHigh = ptsHigh;
    }
    get msg(){
        return super.msg + ` pts jumped back in time: amount: ${this.args.ptsHigh-this.args.ptsNew} ms`;
    }
}

class InvalidTypeAlert extends  FlavorAlert {
    constructor(flavor, chunkName, memberName, expectedType, actualType) {
        super(flavor, chunkName);
        this.args.memberName = memberName;
        this.args.expectedType = expectedType;
        this.args.actualType = actualType;
    }
    get msg(){
        return super.msg + ` invalid type: member: ${this.args.memberName} . expected: ${this.args.expectedType} actual ${this.args.actualType}`;
    }
}

class MissingReferenceAlert extends  FlavorAlert {
    constructor(flavor, chunkName, memberName) {
        super(flavor, chunkName);
        this.args.memberName = memberName;
    }
    get msg(){
        return super.msg + ` undefined or null : member: ${this.args.memberName}`;
    }
}

class ValueOutOfRangeAlert extends  FlavorAlert {
    constructor(flavor, chunkName, memberName, value) {
        super(flavor, chunkName);
        this.args.memberName = memberName;
        this.args.value = value;
    }
    get msg(){
        return super.msg + ` value ${this.args.value} is invalid for ${this.args.memberName}`;
    }
}

class TargetDurationExceededAlert extends  FlavorAlert {
    constructor(flavor, chunkName, memberName, duration, targetDuration) {
        super(flavor, chunkName);
        this.args.memberName = memberName;
        this.args.duration = duration;
        this.args.targetDuration = targetDuration;
    }
    get msg(){
        return super.msg + ` duration ${this.args.duration}  exceeds target duration ${this.args.targetDuration} for ${this.args.memberName}`;
    }
}

class PtsDiscontinuityAlert extends  FlavorAlert {
    constructor(flavor, chunkName, ptsHigh, ptsNew) {
        super(flavor, chunkName);
        this.args.ptsHigh = ptsHigh;
        this.args.ptsNew = ptsNew;
    }
    get msg(){
        return super.msg + ` pts discontinuity input=${this.args.ptsNew} high=${this.args.ptsHigh}`;
    }
}

class EntryRestartedAlert extends EntryAlert {
    constructor(entryId, startTime, input) {
        super(entryId, input);
        this.args.startTime = startTime;
        this.severity = AlertSeverity.warning;
        this.isTimed = true;
    }
    get msg() {
        return super.msg + ` Entry restarted ${this.args.startTime} seconds ago`;
    }
}

class BitrateUnmatched extends EntryAlert {
    constructor(entryId, configuredBitrate, incomingBitrate, input) {
        super(entryId, input);
        this.args.configuredBitrate = configuredBitrate;
        this.args.incomingBitrate = incomingBitrate;
        this.severity = AlertSeverity.info;
    }
    get msg() {
        let percentageDiff = Math.abs((1 - (this.args.incomingBitrate/this.args.configuredBitrate)) * 100);
        return super.msg + ` Incoming bitrate is different from configured bitrate by ${percentageDiff}%`
    }
}

// TODO: Is stream is AudioOnly or VideoOnly don't raise alert!
class NoAudioSignal extends EntryAlert {
    constructor(entryId, input) {
        super(entryId, input);
        this.severity = AlertSeverity.warning;
    }
    get msg() {
        return super.msg + ` No AUDIO signal`;
    }
}

class NoVideoSignal extends EntryAlert {
    constructor(entryId, input) {
        super(entryId, input);
        this.severity = AlertSeverity.warning;
    }
    get msg() {
        return super.msg + ` No VIDEO signal`;
    }
}

class PtsDrift extends EntryAlert {
    constructor(entryId, ptsInfo, input) {
        super(entryId, input);
        this.args.video = ptsInfo.video;
        this.args.audio = ptsInfo.audio;
        this.severity = AlertSeverity.error;
    }

    get msg() {
        return super.msg + ` Pts is not synchronized correctly`
    }
}

class EntryStopped extends EntryAlert {
    constructor(entryId) {
        super(entryId);
        this.severity = AlertSeverity.info;
        this.isTimed = true;
    }

    get msg() {
        return super.msg + `Entry stopped streaming`
    }
}

class EntryStarted extends EntryAlert {
    constructor(entryId) {
        super(entryId);
        this.severity = AlertSeverity.info;
        this.isTimed = true;
    }

    get msg() {
        return super.msg + `Entry started streaming`
    }
}

module.exports = {
    DiagnosticsErrorCodes: DiagnosticsErrorCodes,
    AlertSeverity: AlertSeverity,
    StreamHealth : StreamHealth,
    Alert : Alert,
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
    TargetDurationExceededAlert : TargetDurationExceededAlert,
    PtsDiscontinuityAlert : PtsDiscontinuityAlert,
    EntryRestartedAlert : EntryRestartedAlert,
    BitrateUnmatched : BitrateUnmatched,
    NoAudioSignal : NoAudioSignal,
    NoVideoSignal : NoVideoSignal,
    PtsDrift : PtsDrift,
    EntryStopped : EntryStopped,
    EntryStarted : EntryStarted
};