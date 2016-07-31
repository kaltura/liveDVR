/**
 * Created by ron.yadgar on 21/07/2016.
 */
var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var Q = require('q');
var config = require('../../common/Configuration');
var path = require('path');

    describe('Recording manager spec', function() {


        var clock;

        beforeEach(function () {
            clock = sinon.useFakeTimers();
        });

        afterEach(function () {
            clock.restore();
        });


    it('should return error promise, if makeDirectory is failed', function(done)
    {
        var message = "makeDirectory is failed"
        var mocks = {
            'q-io/fs': {makeDirectory: sinon.stub().returns(Q.reject(message))}
        };
        var RecordingManager = proxyquire('../../lib/RecordingManager', mocks);
        RecordingManager.newChunks("Mp4Files", "entryId", "liveSessionExpirationDuration").then(null,function (err) { console.log("makeDirectory is called")
            done();
        })
    })
    it('should return error promise, if all file failed to link', function(done)
    {
        var message = "makeDirectory is failed"
        var mocks = {
            'q-io/fs': {makeDirectory: sinon.stub().returns(Q.reject(message))}
        };
        var RecordingManager = proxyquire('../../lib/RecordingManager', mocks);
        RecordingManager.newChunks("Mp4Files", "entryId", "liveSessionExpirationDuration").then(null,function (err) {
            expect(err).to.equal(message);
            done();
        })
    })

    it.only(' new chunk', function(done){

        var mocks = {
            'q-io/fs': {
                makeDirectory: sinon.stub().returns(Q.resolve()),
                list: sinon.stub().returns(Q.resolve({}))
            }
        }
       // var RecordingManager = proxyquire('../../lib/RecordingManager', mocks);
        console.log(new Date().getTime())
        clock.tick(1);
        console.log(new Date().getTime())
       // RecordingManager.newChunks("Mp4Files", "entryId", "liveSessionExpirationDuration").then(null,function () {
            console.log(onStartUp.callCount.to.equal(1));
            done();
        })
    })