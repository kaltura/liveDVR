/**
 * Created by elad.benedict on 8/26/2015.
 */
/*jshint -W030 */ // Ignore "Expected an assignment or function call and instead saw an expression" warning wrongfully raised for chai expectations

var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

describe('Network client factory spec', function() {

    var createNetworkClientFactory = function(customizeMocks){

        configurationMock = {
            get : sinon.stub()
        };

        var mocks = {
            './Configuration' : configurationMock
        };

        if (customizeMocks) {
            customizeMocks(mocks);
        }

        var networkClientFactoryCtor = proxyquire('../../lib/NetworkClientFactory', mocks);
        return networkClientFactoryCtor;
    };

    it('should return mock in case configuration mandates so', function()
    {
        var mocks;
        var networkClientFactory = createNetworkClientFactory(function(m){
            mocks = m;
        });

        mocks['./Configuration'].get.withArgs('mockNetwork').returns(true);
        var networkClient = networkClientFactory.getNetworkClient();
        expect(networkClient.read).to.not.be.undefined;
    });

    it('should return real client in case configuration mandates so', function()
    {
        var mocks;
        var networkClientFactory = createNetworkClientFactory(function(m){
            mocks = m;
        });

        mocks['./Configuration'].get.withArgs('mockNetwork').returns(false);

        var networkClient = networkClientFactory.getNetworkClient();
        expect(networkClient.read).to.not.be.undefined;
    });
});
