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
var childProcess = require('child_process');

// todo: check if this is required?????
/*
var loggerMock = {
    info : sinon.stub(),
    error : sinon.stub(),
    debug : sinon.stub(),
    warn : sinon.stub(),
};

// todo: check if this is required?????
var mocks = {
    './logger/logger' : sinon.stub().returns(loggerMock)
};*/


describe('Regression test1', function() {

    // Set an appropriate test timeout here to 12 hours: 12 * 3600 * 1000 = 43200000
    this.timeout(43200000);

    it('should run regression and receive same result as ground truth', function(done) {
        var deferred = Q.defer();

        const spawn = require('child_process').spawn;

        const child = spawn(process.argv[0], ['lib/App.js'], {
            stdio: ['inherit', 'inherit', 'inherit']
        });

        child.on('error', (err) => {
            console.log('Failed to start child process.');
            if (err.code != 0) {
                let err_msg = util.format('failed to start liveController, error %s', err);
                deferred.resolve()
            }
        });

        child.on('close', (err) => {
            if (err.code === 0) {
                console.log('test finished successfully.');
                deferred.resolve();
            } else {
                util.format('test failed with exit code '  + err);
                console.log(err_msg);
                deferred.resolve(err_msg);
            }
        });

        //child.unref();

        // wrap in promise
        deferred.promise.then(function(msg) {
            expect(err).to.equal(0);
            done();
        });
    });

});

/*
describe('Regression test2', function() {

    // Set an appropriate test timeout here to 12 hours: 12 * 3600 * 1000 = 43200000
    this.timeout(43200000);

    it('should run regression and receive same result as ground truth', function(done) {
        var controller = childProcess.exec('node lib/app.js', function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: '+error.code);
            console.log('Signal received: '+error.signal);
        }
        console.log('Child Process STDOUT: '+stdout);
        console.log('Child Process STDERR: '+stderr);
        });
        controller.on('exit', function (code) {
            console.log('Child process exited with exit code '+code);
        });
    });
});
*/


/*
//todo: in order for this to work need add to Controller, support in events.
describe('Regression test3', function() {

    // Set an appropriate test timeout here to 12 hours: 12 * 3600 * 1000 = 43200000
    this.timeout(43200000);

    it('should run regression and receive same result as ground truth', function(done) {
        var prefix = "";
        var controller = new ControllerCtor(prefix);
        controller.start();
        controller.on('event', function(code) {
            if (code === 0) {
                // regression passed successfully
                done();
            } else {
                // regression failed!
                done(err);
            }
        });
    });
});
*/