/**
 * Created by igors on 12/09/2016.
 */
var chai = require('chai');
var expect = chai.expect;

describe('TS2MP4 convertor spec', function() {
    var config = require('./../../common/Configuration');
    config.set('preserveOriginalChunk',false);
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
                    expect(_.omit(fileInfo,['path'])).to.be.eql(_.omit(expectedResult,['path']));
                    done()
                })
                .on('error', (err) => {
                    done(err)
                });
        };

        it('should convert ts chunk', function (done) {

            convert(path.join(__dirname, '/../resources/ufhwdejgz-1.ts'),
                { startTime: 1476098931854, sig: '72C704A5AF7582B8F81540AD0D019BC1', 
                    video: { duration: 11999.666667,    firstDTS: 1476098931854,    firstEncoderDTS: 0,    wrapEncoderDTS: 95443718,
                        keyFrameDTS: [ 0, 2998, 5998, 8998 ] },
                    audio:   { duration: 12051.144444,    firstDTS: 1476098931854,    firstEncoderDTS: 0,    wrapEncoderDTS: 95443718 },
                    metaData:   { resolution: [ 480, 360 ],    fileSize_kbits: 6010,    framerate: 15,    keyFrameDistance: 2999.916748 },
                    path: './ufhwdejgz-1.mp4' },
                done)
        });
    });
});