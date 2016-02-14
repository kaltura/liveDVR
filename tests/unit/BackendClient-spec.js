/**
 * Created by Ron.Yadgar on 11/3/2015.
 */

var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var config = require('../../common/Configuration');

describe('Backend client spec', function() {
    var clock;
    afterEach(function () {
        clock.restore();
    });
    var loggerMock = {
        info: sinon.stub(),
        error: sinon.stub(),
        debug: sinon.stub(),
        warn: sinon.stub()
    };
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
    configMock={
        get:function(param){
            if (param==='backendClient'){return {'ksSessionRefreshIntervalMinutes':10}}
            return "Dont_care";
        }
    }
    var createBackendClient = function (customizeMocks) {
        var mocks = {
            './logger/logger': sinon.stub().returns(loggerMock),
            './kaltura-client-lib/KalturaClient': KalturaClientMock,
            './../common/Configuration': configMock
        };

        if (customizeMocks) {
            customizeMocks(mocks);
        }
        var BackendClientCtor = proxyquire('../../lib/BackendClient', mocks);
        return BackendClientCtor;
    };

    it("Session expired, should create new session", function (done) {
        var sessionDurationTest = config.get('backendClient').ksSessionRefreshIntervalMinutes * 60 * 1000;
        var fakeTime = sessionDurationTest + 1;
        clock = sinon.useFakeTimers(fakeTime);
        var BackendClient = createBackendClient();
        BackendClient._setLastSessionTime(0);
        BackendClient.getLiveEntriesForMediaServer().then(
            function () {
                expect(BackendClient._getlastSessionTime()).to.eql(fakeTime);
                done();
            },
            function(err)
            {
                done(err);
            });
    });
    it ("Should return a rejected promise when create session fails",function(done){
        KalturaClientMockUpdate = {
            KalturaClient : sinon.stub().returns({
                session : {
                    start : sinon.stub().callsArgWith(0,null,'1')
                },
                setSessionId: sinon.stub()
            })
        };
        var updateMocks = function (m) {
            m[ './kaltura-client-lib/KalturaClient']=KalturaClientMockUpdate;
           mocks = m;
        };
        var sessionDurationTest=config.get('backendClient').ksSessionRefreshIntervalMinutes* 60 * 1000;
        var fakeTime=sessionDurationTest+1;
        clock = sinon.useFakeTimers(fakeTime);
        var BackendClient=createBackendClient(updateMocks);
        BackendClient._setLastSessionTime(0);
        var promise = BackendClient.getLiveEntriesForMediaServer();

        promise.then(function(){
            done(new Error("Expected promise to fail"));
        }, function(){
            done();
        });
    });
    it("Should not create a new session when a valid session is already available",function(done){
        setSessionIdMock=sinon.spy();
        KalturaClientMockUpdate = {
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
        var updateMocks = function (m) {
            m[ './kaltura-client-lib/KalturaClient']=KalturaClientMockUpdate;
            mocks = m;
        };
        clock = sinon.useFakeTimers(1);
        var BackendClient=createBackendClient(updateMocks);
        expect(setSessionIdMock.callCount).to.eql(0);
        BackendClient.getLiveEntriesForMediaServer()
            .then(function(){
                expect(setSessionIdMock.callCount).to.eql(1);
                clock.tick(1);
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
        objsTest=  [{"dvrWindow":100,"entryId":"0_aaa"}, {"dvrWindow":7200,"entryId":"0_bbb"}];
        var results={};
        results.objects=[item_obj_example1, item_obj_example2];
        setSessionIdMock=sinon.stub();
        KalturaClientMockUpdate = {
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
        configMockUpdate={
            get:function(param){
                if (param==='dvrWindow'){return 7200}
                if (param==='liveDvrWindow'){return 100}
                return "Dont_care";
            }
        }
        var updateMocks = function (m) {
            m[ './kaltura-client-lib/KalturaClient']=KalturaClientMockUpdate;
            m['./../common/Configuration']= configMockUpdate;
            mocks = m;
        };
        var BackendClient=createBackendClient(updateMocks);
        BackendClient.getLiveEntriesForMediaServer()
            .then(function(objs){
                expect(objs).to.eql(objsTest);
                done();
            }).catch(function(err){
                done(err);
            })
    });
    it("Should return error, since client.liveStream.listAction's cb is failed to get live entries",function(done){
        setSessionIdMock=sinon.stub();
        KalturaClientMockUpdate = {
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
        var updateMocks = function (m) {
            m[ './kaltura-client-lib/KalturaClient']=KalturaClientMockUpdate;
            mocks = m;
        };
        var BackendClient=createBackendClient(updateMocks);
        BackendClient.getLiveEntriesForMediaServer()
            .then(function(){
                done("Should return error");
            }).catch(function(){
                done();
            })
    });
});
