/**
 * Created by lilach.maliniak on 18/08/2016.
 */
var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var Q = require('q');
var should = chai.should();
var util=require('util');
var ControllerWrapper =  require('./../regression/ControllerWrapper');

var testsuite = process.env.TEST_CLASS ? process.env.TEST_CLASS : 'hls-recording';


describe('Live-Recording (for regression)', function() {
    process.env['MOCHA_FILE'] = './reports/last_recording_run/recording-report.xml';
    process.env['PROPERTIES'] = `BUILD_ID:${process.env.BUILD_NUMBER}`;

    it (testsuite, function(done) {
        var controller = new ControllerWrapper('HLS stream recording');
        controller.start()
            .then(function(exit_code) {
                expect(exit_code).to.equal(0);
            }).then(function(){
            done();
        }).done(null, function(err){
            done(err);
        });
    });
});

