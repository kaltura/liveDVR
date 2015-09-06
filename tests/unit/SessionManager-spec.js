/**
 * Created by elad.benedict on 9/6/2015.
 */

var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var Q = require('q');

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

        var mocks = {
            'q-io/fs' : {},
            'glob' : {},
            'config' : {}
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
            mocks.glob = sinon.stub().callsArgWith(2, null, []);
        });
        sm.isNewSession('1111').then(function(result){
            expect(result).to.equal(true);
            done();
        }).done(null, function(err){
            done(err);
        });

    });

    it('should return false when there are several manifests, one of which was created recently', function(done)
    {
        var stat = sinon.stub();
        stat.withArgs('1').returns(Q({node : { mtime : 10000}}));
        stat.withArgs('2').returns(Q({node : { mtime : 20000}}));

        var sm = createSessionManager(function(mocks){
            mocks.glob = sinon.stub().callsArgWith(2, null, ['1', '2']);
            mocks['q-io/fs'].stat = stat;
        });

        clock.tick(21000);

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
        stat.withArgs('1').returns(Q({node : { mtime : 10000}}));
        stat.withArgs('2').returns(Q({node : { mtime : 20000}}));

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