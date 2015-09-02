/**
 * Created by elad.benedict on 8/26/2015.
 */
/*jshint -W030 */ // Ignore "Expected an assignment or function call and instead saw an expression" warning wrongfully raised for chai expectations

var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

describe('Backend client factory spec', function() {

    var createBackendClientFactory = function(customizeMocks){

        configurationMock = {
            get : sinon.stub()
        };

        var mocks = {
            './Configuration' : configurationMock
        };

        if (customizeMocks) {
            customizeMocks(mocks);
        }

        var backendClientFactoryCtor = proxyquire('../../lib/BackendClientFactory', mocks);
        return backendClientFactoryCtor;
    };

    it('should return mock in case configuration mandates so', function()
    {
        var mocks;
        var backendClientFactory = createBackendClientFactory(function(m){
            mocks = m;
        });

        mocks['./Configuration'].get.withArgs('mockBackend').returns(true);
        var backendClient = backendClientFactory.getBackendClient();
        expect(backendClient.getLiveEntriesForMediaServer).to.not.be.undefined;
    });

    it('should return real client in case configuration mandates so', function()
    {
        var mocks;
        var backendClientFactory = createBackendClientFactory(function(m){
            mocks = m;
        });

        mocks['./Configuration'].get.withArgs('mockBackend').returns(false);

        var backendClient = backendClientFactory.getBackendClient();
        expect(backendClient.getLiveEntriesForMediaServer).to.not.be.undefined;
    });
});