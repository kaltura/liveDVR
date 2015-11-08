/**
 * Created by Ron.Yadgar on 11/3/2015.
 */
var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var config = require('../../common/Configuration');
var assert=require('assert')
describe('Backend client facdefgstory spec', function() {
    var loggerMock = {
        info: sinon.stub(),
        error: sinon.stub(),
        debug: sinon.stub(),
        warn: sinon.stub()
    };
    var createBackendClient = function (mocks) {
        var BackendClientCtor = proxyquire('../../lib/BackendClient', mocks);
        return BackendClientCtor;
    };

    it("Session expired, check for creating new session", function (done) {
        KalturaClientMock = {
            KalturaClient: sinon.stub().returns({
                session: {
                    start: sinon.stub().callsArgWith(0, '1')
                },
                setSessionId: sinon.stub(),
                liveStream: {
                    listAction: sinon.stub().callsArgWith(0,'1')
                }
            })
        };
        var mocks = {
            './logger/logger': sinon.stub().returns(loggerMock),
            './kaltura-client-lib/KalturaClient': KalturaClientMock
        };
        var sessionDurationTest = config.get('backendClient').ksSessionRefreshIntervalMinutes * 60 * 1000;
        var fakeTime = sessionDurationTest + 1;
        clock = sinon.useFakeTimers(fakeTime);
        var BackendClient = createBackendClient(mocks);
        BackendClient.SetLastSessionTime(0);
        BackendClient.getLiveEntriesForMediaServer().then(
            function () {
                console.log(BackendClient.GetlastSessionTime());
                console.log('Promise Succsed');
                expect(BackendClient.GetlastSessionTime()).to.eql(fakeTime);
                done();
            },
            function(err)
            {
                console.log('Promise failed');
                done(err);
            });
    });
    it ("Promise should be failed, after error occurred, in the create new session",function(done){
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

        promise.then(function(){
            done(new Error("Expected getLiveEntries to fail"));
        }, function(){
            done();
        });
    });
    it("Calling the function .getLiveEntriesForMediaServer() twice, check that function create new session is called once!",function(done){
        setSessionIdMock=sinon.spy();
        KalturaClientMock = {
            KalturaClient : sinon.stub().returns({
                session : {
                    start : sinon.stub().callsArgWith(0,'1')
                },
                setSessionId: setSessionIdMock,
                liveStream: {
                    listAction: sinon.stub().callsArgWith(0, '1')
                }
            })
        };
        var mocks = {
            './logger/logger': sinon.stub().returns(loggerMock),
            './kaltura-client-lib/KalturaClient' : KalturaClientMock
        };
        var FakeTime=1;
        clock = sinon.useFakeTimers(FakeTime);
        var BackendClient=createBackendClient(mocks);
        expect(setSessionIdMock.callCount).to.eql(0);
        BackendClient.getLiveEntriesForMediaServer()
            .then(function(){
                expect(setSessionIdMock.callCount).to.eql(1);
                clock = sinon.useFakeTimers(FakeTime+1);
                return BackendClient.getLiveEntriesForMediaServer();
            })
            .then(function(){
                expect(setSessionIdMock.callCount).to.eql(1);
                done();
            }).catch(function(err){
                done(err);
            })
    });
    it("Check that getLiveEntriesForMediaServer's return object has an appropriate form",function(done){
        item_obj_example1={
            dvrStatus:0,
            id:"0_aaa"
        };
        item_obj_example2={
            dvrStatus:1,
            id:"0_bbb"
        };
        objsTest=[];
        objsTest.push({"dvrWindow":100,"entryId":"0_aaa"});
        objsTest.push({"dvrWindow":7200,"entryId":"0_bbb"});
        var results={};
        results.objects=[];
        results.objects.push(item_obj_example1);
        results.objects.push(item_obj_example2);
        setSessionIdMock=sinon.stub();
        KalturaClientMock = {
            KalturaClient : sinon.stub().returns({
                session : {
                    start : sinon.stub().callsArgWith(0,'1')
                },
                setSessionId: setSessionIdMock,
                liveStream: {
                    listAction: sinon.stub().callsArgWith(0,results)
                }
            })
        };
        var mocks = {
            './logger/logger': sinon.stub().returns(loggerMock),
            './kaltura-client-lib/KalturaClient' : KalturaClientMock
        };
        var BackendClient=createBackendClient(mocks);
        BackendClient.getLiveEntriesForMediaServer()
            .then(function(objs){
                console.log(JSON.stringify(objs));
                expect(objs).to.eql(objsTest);
                done();
            }).catch(function(err){
                done(err);
            })
    });
    it("Should return error, since client.liveStream.listAction's cb is failed to get live entries",function(done){
        setSessionIdMock=sinon.stub();
        KalturaClientMock = {
            KalturaClient : sinon.stub().returns({
                session : {
                    start : sinon.stub().callsArgWith(0,'1')
                },
                setSessionId: setSessionIdMock,
                liveStream: {
                    listAction: sinon.stub().callsArgWith(0,null)
                }
            })
        };
        var mocks = {
            './logger/logger': sinon.stub().returns(loggerMock),
            './kaltura-client-lib/KalturaClient' : KalturaClientMock
        };
        var BackendClient=createBackendClient(mocks);
        BackendClient.getLiveEntriesForMediaServer()
            .then(function(){
                done("Should return error");
            }).catch(function(){
                done();
            })
    });
});
