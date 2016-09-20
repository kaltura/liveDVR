/**
 * Created by lilach.maliniak on 15/08/2016.
 */

var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var should = chai.should();
var ControllerWrapper =  require('./ControllerWrapper');

var testsuite = process.env.TEST_CLASS ? process.env.TEST_CLASS : 'hls-regression-test';



describe('Live-Regression', function() {
    process.env['MOCHA_FILE'] = './reports/last_regression_run/regression-test-report.xml';
    process.env['PROPERTIES'] = `BUILD_ID:${process.env.BUILD_NUMBER}`;
    
    it (testsuite, function(done) {
       var controller = new ControllerWrapper("regression test");
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

