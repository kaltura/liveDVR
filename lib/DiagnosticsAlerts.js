/**
 * Created by gadyaari on 21/09/2016.
 */

var diagnosticsErrorCodes = {
    "TsConversionFailureAlert": 0,
    "NoID3TagAlert" : 1,
    "PtsMisalignmentAlert" : 2,
    "EmptyFileAlert" : 3,
    "InvalidM3u8Alert" : 4
};

class Alert {
    constructor(args) {
        this.args = args;
        this.time = new Date();
        this.name = this.constructor.name;
        this.errorCode = diagnosticsErrorCodes[this.name];
    }
    
    toJson() {
        return { Time : this.time, Name : this.name, Arguments : this.args };
    }
}

class TsConversionFailureAlert extends  Alert {
    constructor(args) {
        super(args);
        this.args = { Error : args.err, ChunkName : args.chunkName };
    }
}

class NoID3TagAlert extends Alert {
    constructor(args) {
        super(args);
        this.args = { Flavor : args.flavor, ChunkName : args.chunkName, ID3 : args.startTime };
    }
}

class PtsMisalignmentAlert extends Alert {
    constructor(args) {
        super(args);
        this.args = {
            Flavor : args.fileInfo.flavor,
            ChunkName : args.fileInfo.chunkName,
            Video : args.videoPts,
            Audio : args.audioPts,
            Gap : args.gap
        };
    }
}

class EmptyFileAlert extends Alert {
    constructor(args) {
        super(args);
    }
}

class InvalidM3u8Alert extends Alert {
    constructor(args) {
        super(args);
    }
}

module.exports = {
    TsConversionFailureAlert : TsConversionFailureAlert,
    NoID3TagAlert : NoID3TagAlert,
    PtsMisalignmentAlert : PtsMisalignmentAlert,
    EmptyFileAlert : EmptyFileAlert,
    InvalidM3u8Alert : InvalidM3u8Alert
};