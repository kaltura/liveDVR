/**
 * Created by elad.benedict on 9/6/2015.
 */

var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var Q = require('q');
var config = require('../../common/Configuration');
var path = require('path');

describe('Session manager spec', function() {

    var sessionManager;
    var clock;

    beforeEach(function () {
        clock = sinon.useFakeTimers();
        sessionManager = createSessionManager();
    });

    afterEach(function () {
        clock.restore();
    });

    var createSessionManager = function(customizeMocks){
        var loggerMock = sinon.stub().returns({
            info: sinon.stub(),
            error: sinon.stub(),
            debug: sinon.stub()
        });

        var mocks = {
            'q-io/fs' : {
                exists : sinon.stub().returns(Q(true))
            },
            './logger/logger' : loggerMock
        };

        if (customizeMocks) {
            customizeMocks(mocks);
        }

        var sessionManager = proxyquire('../../lib/SessionManager', mocks);
        return sessionManager;
    };

    it('should return true when there is no folder of the entry', function(done)
    {
        var sm = createSessionManager(function(mocks){
            mocks['q-io/fs'].exists = sinon.stub().returns(Q(false));
        });
        sm.isNewSession('1111').then(function(result){
            expect(result).to.equal(true);
            done();
        }).done(null, function(err){
            done(err);
        });
    });

    it('should return false when the timestamp is recent', function(done)
    {
        var stat = sinon.stub();
        config.set('sessionDuration', 100000);
        var rootFolder = config.get('rootFolderPath');
        timestampPath = path.join(rootFolder, '1111', 'sessionTimestamp');
        stat.withArgs(timestampPath).returns(Q({node : { mtime : new Date(10000)}}));

        var sm = createSessionManager(function(mocks){
            mocks.glob = sinon.stub().callsArgWith(2, null, ['1', '2']);
            mocks['q-io/fs'].stat = stat;
        });

        sm.isNewSession('1111').then(function(result){
            expect(result).to.equal(false);
            done();
        }).done(null, function(err){
            done(err);
        });
    });

    it('should return true when there are several manifests, all were created in the (distant) past', function(done)
    {
        var stat = sinon.stub();
        stat.withArgs('1').returns(Q({node : { mtime : new Date(10000)}}));
        stat.withArgs('2').returns(Q({node : { mtime : new Date(20000)}}));

        var sm = createSessionManager(function(mocks){
            mocks.glob = sinon.stub().callsArgWith(2, null, ['1', '2']);
            mocks['q-io/fs'].stat = stat;
        });

        clock.tick(21000000);

        sm.isNewSession('1111').then(function(result){
            expect(result).to.equal(true);
            done();
        }).done(null, function(err){
            done(err);
        });
    });
});