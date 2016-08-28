/**
 * Created by lilach.maliniak on 15/08/2016.
 */

var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var should = chai.should();

var ControllerWrapper =  require('./ControllerWrapper');



describe('Regression test for HLS stream', function() {

    // Set an appropriate test timeout here to 12 hours: 12 * 3600 * 1000 = 43200000
    // this.timeout(43200000);

    it('should run regression and receive same result as ground truth', function(done) {
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

