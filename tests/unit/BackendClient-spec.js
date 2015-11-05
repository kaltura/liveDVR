/**
 * Created by Ron.Yadgar on 11/3/2015.
 */
var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var config = require('../../common/Configuration');
describe('Backend client factory spec', function() {
    var text;
    /*
     var loggerMock = {
     info: sinon.stub(),
     error: sinon.stub(),
     debug: sinon.stub(),
     warn: sinon.stub()
     };*/
    var loggerMock = {
        info: function(str){  console.log("info: "+str)},
        error:   function(){ console.log("error")},
        debug:  function(){  console.log("debug")},
        warn:   function(){ console.log("warn")}
    };



    var createBackendClient = function(mocks) {
        var BackendClientCtor = proxyquire('../../lib/backendClient', mocks);
        return BackendClientCtor;
    };
    //
    //it("Check that createSession function is called after session time is expired", function () {
    //    KalturaClientMock = {
    //        KalturaClient: function(){
    //            this.session={
    //                'start':functionIndicator
    //            };
    //        }
    //    };
    //    functionIndicator=function(){
    //        return  sinon.spy();
    //    }
    //    var mocks = {
    //        './kaltura-client-lib/KalturaClient' : KalturaClientMock,
    //        './logger/logger': sinon.stub().returns(loggerMock)
    //    };
    //    clock = sinon.useFakeTimers(9999999999);
    //    var BackendClient=createBackendClient(mocks);
    //    BackendClient.SetLastSessionTime(0);
    //    BackendClient.getLiveEntriesForMediaServer();
    //    expect(loggerMock.debug).to.have.been.calledOnce;
    //});
    it ("Session expired, check for creating new session",function(done){
      KalturaClientMock = {
            KalturaClient : sinon.stub().returns({
                session : {
                    start : sinon.stub().callsArgWith(0,'1')
                },
                setSessionId: sinon.stub()
            })
        };
        var mocks = {
            './logger/logger': sinon.stub().returns(loggerMock),
            './kaltura-client-lib/KalturaClient' : KalturaClientMock
        };
        var sessionDurationTest=config.get('backendClient').ksSessionRefreshIntervalMinutes* 60 * 1000;
        var FakeTime=sessionDurationTest+1;
        clock = sinon.useFakeTimers(FakeTime);
        var BackendClient=createBackendClient(mocks);
        BackendClient.SetLastSessionTime(0);
        BackendClient.getLiveEntriesForMediaServer();
        process.nextTick(function(){
            console.log(BackendClient.GetlastSessionTime());
            console.log(BackendClient.lastSessionTime);
            expect(BackendClient.GetlastSessionTime()).to.eql(FakeTime);
            done();
        });
    });
    it ("Session expired, check for creating new session",function(done){
        KalturaClientMock = {
            KalturaClient : sinon.stub().returns({
                session : {
                    start : sinon.stub().callsArgWith(0,'1')
                },
                setSessionId: sinon.stub()
            })
        };
        var mocks = {
            './logger/logger': sinon.stub().returns(loggerMock),
            './kaltura-client-lib/KalturaClient' : KalturaClientMock
        };
        var sessionDurationTest=config.get('backendClient').ksSessionRefreshIntervalMinutes* 60 * 1000;
        var FakeTime=sessionDurationTest+1;
        clock = sinon.useFakeTimers(FakeTime);
        var BackendClient=createBackendClient(mocks);
        BackendClient.SetLastSessionTime(0);
        BackendClient.getLiveEntriesForMediaServer();
        process.nextTick(function(){
            console.log(BackendClient.GetlastSessionTime());
            console.log(BackendClient.lastSessionTime);
            expect(BackendClient.GetlastSessionTime()).to.eql(FakeTime);
            done();
        });
    });
    it ("Session expired, but error occur, check that promise is failed",function(done){
        KalturaClientMock = {
            KalturaClient : sinon.stub().returns({
                session : {
                    start : sinon.stub().callsArgWith(0,null,'1')
                },
                setSessionId: sinon.stub()
            })
        };
        var mocks = {
            './logger/logger': sinon.stub().returns(loggerMock),
            './kaltura-client-lib/KalturaClient' : KalturaClientMock
        };
        var sessionDurationTest=config.get('backendClient').ksSessionRefreshIntervalMinutes* 60 * 1000;
        var FakeTime=sessionDurationTest+1;
        clock = sinon.useFakeTimers(FakeTime);
        var BackendClient=createBackendClient(mocks);
        BackendClient.SetLastSessionTime(0);
        var promise = BackendClient.getLiveEntriesForMediaServer();

        console.log(BackendClient.GetlastSessionTime());
        console.log(BackendClient.lastSessionTime);
        //expect(BackendClient.getLiveEntriesForMediaServer()
        promise.then(function(){
            done(new Error("Expected getLiveEntries to fail"));
        }, function(){
            done();
        });
    });
});