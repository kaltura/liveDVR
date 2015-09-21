/**
 * Created by elad.benedict on 8/23/2015.
 */

var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var path = require('path');
var sinon = require('sinon');

describe('PersistenceFormat spec', function() {

    var configMock = {
        get : sinon.stub().returns("/home/dev/DVR")
    };

    var mocks = {
        './Configuration' : configMock
    };

    it('should get a path for an entry', function(){
        var persistenceFormat = proxyquire('../../common/PersistenceFormat', mocks);
        var entryDestPath = persistenceFormat.getEntryFullPath('1_bla');
        expect(entryDestPath).to.equal(path.join('/home/dev/DVR', '1_bla'));
    });

    it('should get a path for a flavor', function(){
        var persistenceFormat = proxyquire('../../common/PersistenceFormat', mocks);
        var entryDestPath = persistenceFormat.getFlavorFullPath('1_bla', 400000);
        expect(entryDestPath).to.equal(path.join('/home/dev/DVR', '1_bla', '400000'));
    });
});