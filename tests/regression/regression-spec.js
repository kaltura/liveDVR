/**
 * Created by lilach.maliniak on 15/08/2016.
 */

var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var Q = require('Q');
var should = chai.should();
var ControllerCtor = require('./../../lib/Controller');
var util=require('util');


//todo: in order for this to work need add to Controller, support in events.
describe('Regression test4', function() {

    // Set an appropriate test timeout here to 12 hours: 12 * 3600 * 1000 = 43200000
    this.timeout(43200000);

    it('should run regression and receive same result as ground truth', function(done) {
        var prefix = "";
        var controller = new ControllerCtor(prefix);
        controller.on('exit', function(code) {
            if (code === 0) {
                // regression passed successfully
                console.log('*************************************************');
                console.log('*     regression test finished successfully     *');
                console.log('*************************************************');
            } else {
                // regression failed!
                console.log('*************************************************');
                console.log(util.format('@@@ regression test failed with error %s!!! @@@', code));
                console.log('*************************************************');
            }
            expect(code).to.equal(0);
            done();
        });
        controller.start();       
    });
});

