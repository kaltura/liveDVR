/**
 * Created by igors on 12/09/2016.
 */
var chai = require('chai');
var expect = chai.expect;

describe('TS2MP4 convertorr spec', function() {
    var mp4utils = require('./../../lib/utils/mp4-utils');
    var path = require('path');

    describe('basics', function() {
        this.timeout(0);
        it('should extract fileinfo from file', function (done) {

            var expected = {"startTime":1473253456751,"sig":"F279C4E6F7F82AA9F1A3760D17584F1D","video":{"duration":9600,"firstDTS":1473253456751,"firstEncoderDTS":2221501,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2400,4800,7200]},"audio":{"duration":9600,"firstDTS":1473253456762,"firstEncoderDTS":2221511.666667,"wrapEncoderDTS":95443718}};

            return mp4utils.extractMetadata(path.join(__dirname, '/../resources/media-u4cc7m30h_b1496000_3383.ts.mp4'))
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
    });
});