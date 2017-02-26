/**
 * Created by igors on 12/09/2016.
 */
var chai = require('chai');
var expect = chai.expect;

describe('TS2MP4 convertor spec', function() {
    var config = require('./../../common/Configuration');
    const preserveOriginalHLS = config.get('preserveOriginalHLS');
    preserveOriginalHLS.enable = false;
    config.set('preserveOriginalHLS',preserveOriginalHLS);
    var mp4utils = require('./../../lib/utils/mp4-utils');
    var path = require('path');
    var conv = require('./../../lib/MP4WriteStream');
    var fs = require('fs');
    var _ = require('underscore');

    describe('basics', function() {
        this.timeout(0);
        it('should extract fileinfo from file', function (done) {

            let filePath = path.join(__dirname, '/../resources/media-u4cc7m30h_b1496000_3383.ts.mp4');
            var expected = {"startTime":1473253456751,"sig":"F279C4E6F7F82AA9F1A3760D17584F1D","video":{"duration":9600,"firstDTS":1473253456751,"firstEncoderDTS":2221501,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2400,4800,7200]},"audio":{"duration":9600,"firstDTS":1473253456762,"firstEncoderDTS":2221511.666667,"wrapEncoderDTS":95443718},
            path:filePath};

            return mp4utils.extractMetadata(filePath)
                .then(function(fi){
                    expect(fi).to.be.eql(expected);
                })
                .catch(function(err){
                    fail(err,expected,'expected to extract fileinfo');
                })
                .finally(function(){
                       done();
                });
        });

        const convert = function (localPath,expectedResult,done){
            let ts2mp4 = new conv.MP4WriteStream(localPath.replace('.ts','.mp4'));

            fs.createReadStream(localPath)
                .pipe(ts2mp4)
                .on('data', (chunk) => {
                    console.log("data " + chunk.length);
                })
                .on('end', (fileInfo) => {
                    if(expectedResult) {
                        expect(_.omit(fileInfo, ['path'])).to.be.eql(_.omit(expectedResult, ['path']));
                    }
                    done()
                })
                .on('error', (err) => {
                    if(expectedResult === null){
                        done()
                    } else {
                        done(err)
                    }
                });
        };

        it('should convert ts chunk', function (done) {

            convert(path.join(__dirname, '/../resources/ufhwdejgz-1.ts'),
                { startTime: 1476098931854, sig: '72C704A5AF7582B8F81540AD0D019BC1',
                    "ts_info": {
                        "audio": {
                            "dts": 0,
                            "duration": 12005,
                            "ptsDelay": 0,
                        },
                        "video": {
                            "dts": 0,
                            "duration": 12066,
                            "ptsDelay": 0
                        }
                    },
                    video: { duration: 11999.666667,    firstDTS: 1476098931854,    firstEncoderDTS: 0,    wrapEncoderDTS: 95443718,
                        keyFrameDTS: [ 0, 2999, 5999, 8999 ] },
                    audio:   { duration: 12051.144444,    firstDTS: 1476098931854,    firstEncoderDTS: 0,    wrapEncoderDTS: 95443718 },
                    metaData:   { resolution: [ 480, 360 ],    fileSize_kbits: 6010,    framerate: 15,    keyFrameDistance: 2999.916748 },
                    path: './ufhwdejgz-1.mp4' },
                done)
        });

        it('should produce valid key frame durations after ts is converted', function (done) {
            convert(path.join(__dirname, '/../resources/u4k5n96yh-101.ts'),
                { startTime: 1476355403863,sig: '5A922AD7FB91C94D2D8BDBB5589B0E4A',
                    video:  { duration: 11850,   firstDTS: 1476355403863,   firstEncoderDTS: 1290843,   wrapEncoderDTS: 95443718,   keyFrameDTS: [ 0, 3984, 7969 ] },
                    metaData:  { resolution: [ 1280, 720 ],   fileSize_kbits: 9991,   framerate: 19.333334,   keyFrameDistance: 3950 },
                    path: './u4k5n96yh-101.mp4' },
                done)
        });


        it('should not crash when exposed to bad input', function (done) {
            convert(path.join(__dirname, '/../resources/crash.ts'),null,done)
        });

        it('should not crash when exposed to bad input2', function (done) {
            convert(path.join(__dirname, '/../resources/crash2.ts'),null,done)
        });


        it('should succeed on decreasing pts data', function (done) {
            convert(path.join(__dirname, '/../resources/decreasing_pts.ts'),
                {"startTime":1476970881847,"sig":"6538AE061EA671F03369D11DA2F7248F","video":{"duration":10122.366667,"firstDTS":1476970881847,"firstEncoderDTS":90810753,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,4972,8169,8233,8297,8361,8425,8489,8553,8617,8681,8745,8809,8873,8937,9001,9065,9129,9193,9257,9321,9385,9449,9513,9577,9641,9705,9769,9833,9897,9961,10025,10089]},"metaData":{"resolution":[720,480],"fileSize_kbits":7282,"framerate":29.97003,"keyFrameDistance":306.738373}}
                ,done)
        });
    });
});