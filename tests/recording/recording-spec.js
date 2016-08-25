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
var ControllerWrapper =  require('./../regression/ControllerWrapper.js');


describe('Recording HLS stream data', function() {

    // Set an appropriate test timeout here to 12 hours: 12 * 3600 * 1000 = 43200000
    this.timeout(43200000);

    it('should successfully record HLS stream from specified entry', function(done) {
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

