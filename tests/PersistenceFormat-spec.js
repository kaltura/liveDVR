/**
 * Created by elad.benedict on 8/23/2015.
 */

var proxyquire = require('proxyquire');
var m3u8 = require('m3u8');
var fs = require('fs');
var sinon = require('sinon');
var Q = require('Q');
var chai = require('chai');
var expect = chai.expect;
var path = require('path');

describe('PersistenceFormat spec', function() {
    it('should get a path for an entry', function(){
        var persistenceFormatCreator = require('../lib/PersistenceFormat');
        var persistenceFormat = persistenceFormatCreator("/basePath");
        var entryDestPath = persistenceFormat.getEntryDestPath('1_bla');
        expect(entryDestPath).to.equal(path.join('/basePath', '1_bla'));
    });

    it('should get a path for a flavor', function(){
        var persistenceFormatCreator = require('../lib/PersistenceFormat');
        var persistenceFormat = persistenceFormatCreator("/basePath");
        var entryDestPath = persistenceFormat.getFlavorDestPath('1_bla', 400000);
        expect(entryDestPath).to.equal(path.join('/basePath', '1_bla', '400000'));
    });
});