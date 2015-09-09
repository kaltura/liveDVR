/**
 * Created by elad.benedict on 9/8/2015.
 */

var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var Q = require('q');
var fs = require('fs');
var parser = require('../../lib/promise-m3u8');

describe('EndListAppender spec', function() {

    var clock;
    var sessionDuration = 1000;
    var m3u8ObjPromise;

    beforeEach(function () {
        clock = sinon.useFakeTimers();
    });

    afterEach(function () {
        clock.restore();
    });

    var createEndListAppender = function(customizeMocks){
        var loggerMock = {
            info : sinon.stub(),
            error : sinon.stub()
        };

        var expectedManifestContent = fs.readFileSync(__dirname + '/../resources/simpleManifest.m3u8', 'utf8');

        m3u8ObjPromise = parser.parseM3U8(expectedManifestContent, { verbatim : true});

        var parserMock = {
            parseM3U8 : sinon.stub().returns(m3u8ObjPromise)
        };

        var sessionManagerMock = {
            getSessionDuration : sinon.stub().returns(sessionDuration)
        };

        var qioMock = {
            write : sinon.stub().returns(Q())
        };

        var persistenceFormatMock = {
            getAllStoredEntries : sinon.stub(),
            getEntryFullPath : sinon.stub()
        };

        var globMock = sinon.stub().callsArgWith(2, null, ['/fullPath/1/a/m.m3u8', '/fullPath/1/b/m.m3u8', '/fullPath/3/a/m.m3u8']);

        var mocks = {
            './logger/logger' : loggerMock,
            './promise-m3u8' : parserMock,
            './SessionManager' : sessionManagerMock,
            'q-io/fs' : qioMock,
            './PersistenceFormat' : persistenceFormatMock,
            'glob' : globMock

        };

        if (customizeMocks)
        {
            customizeMocks(mocks);
        }

        var endlistAppenderCtor = proxyquire('../../lib/EndListAppender', mocks);
        return new endlistAppenderCtor();
    };

    it('should scan all entries upon init', function(done){
        var customizeMocks = function(mocks){
            mocks['./PersistenceFormat'].getAllStoredEntries.returns(Q(['1','2','3']));
        };

        var endlistAppender = createEndListAppender(customizeMocks);
        endlistAppender.init().then(function(){
            expect(Object.keys(endlistAppender._entriesToProcess).length).to.equal(3);
            done();
        }).done(null, function(err){
            done(err);
        });
    });

    it('should add end list to a manifest without endlist', function(done){

        var qioMock;

        var customizeMocks = function(mocks){
            qioMock = mocks['q-io/fs'];
            mocks['./PersistenceFormat'].getAllStoredEntries.returns(Q(['1']));
            mocks['./PersistenceFormat'].getEntryFullPath.returns('/fullPath/1');
            mocks['glob'] = sinon.stub().callsArgWith(2, null, ['/fullPath/1/a/m.m3u8']);
        };

        var endlistAppender = createEndListAppender(customizeMocks);
        endlistAppender.init().then(function() {
            endlistAppender.on('entryProcessingCompleted', function () {
                m3u8ObjPromise.then(function (manifest) {
                    expect(manifest.get('playlistType')).to.equal('VOD');
                    expect(qioMock.write.callCount).to.be.at.least(1);
                    done();
                }).done(null, function (err) {
                    done(err);
                });
            });
            clock.tick(sessionDuration);
        });
    });

    it('should not add end list to a manifest which already has endlist', function(done){

        var expectedManifestContent = fs.readFileSync(__dirname + '/../resources/simpleManifestWithEndList.m3u8', 'utf8');

        var parserMock = {
            parseM3U8 : sinon.stub().returns(parser.parseM3U8(expectedManifestContent, { verbatim : true}))
        };

        var qioMock;

        var customizeMocks = function(mocks){
            qioMock = mocks['q-io/fs'];
            mocks['./PersistenceFormat'].getAllStoredEntries.returns(Q(['1']));
            mocks['./PersistenceFormat'].getEntryFullPath.returns('/fullPath/1');
            mocks['glob'] = sinon.stub().callsArgWith(2, null, ['/fullPath/1/a/m.m3u8']);
            mocks['./promise-m3u8'] = parserMock;
        };

        var endlistAppender = createEndListAppender(customizeMocks);
        endlistAppender.init().then(function() {
            endlistAppender.on('entryProcessingCompleted', function () {
                m3u8ObjPromise.then(function () {
                    expect(qioMock.write.callCount).to.equal(0);
                    done();
                }).done(null, function (err) {
                    done(err);
                });
            });
            clock.tick(sessionDuration);
        });
    });

    it('should add an entry upon addEntry call', function(done){

        var qioMock;

        var customizeMocks = function(mocks){
            qioMock = mocks['q-io/fs'];
            mocks['./PersistenceFormat'].getAllStoredEntries.returns(Q(['1']));
            mocks['./PersistenceFormat'].getEntryFullPath.returns('/fullPath/1');
            mocks['glob'] = sinon.stub().callsArgWith(2, null, ['/fullPath/1/a/m.m3u8']);
        };

        var endlistAppender = createEndListAppender(customizeMocks);
        endlistAppender.init().then(function() {
            endlistAppender.addEntry('someEntryId');
            expect(endlistAppender._entriesToProcess['someEntryId']).not.to.be.an('undefined');
            done();
        }).done(null, function(err){
            done(err);
        });
    });

    it('should only add an entry once', function(done){

        var qioMock;

        var customizeMocks = function(mocks){
            qioMock = mocks['q-io/fs'];
            mocks['./PersistenceFormat'].getAllStoredEntries.returns(Q(['1']));
            mocks['./PersistenceFormat'].getEntryFullPath.returns('/fullPath/1');
            mocks['glob'] = sinon.stub().callsArgWith(2, null, ['/fullPath/1/a/m.m3u8']);
        };

        var endlistAppender = createEndListAppender(customizeMocks);
        endlistAppender.init().then(function() {
            endlistAppender.addEntry('someEntryId');
            var entryTimeoutObj = endlistAppender._entriesToProcess['someEntryId'];
            endlistAppender.addEntry('someEntryId');
            expect(endlistAppender._entriesToProcess['someEntryId']).to.eql(entryTimeoutObj);
            done();
        }).done(null, function(err){
            done(err);
        });
    });

    it('should successfully remove an entry to be processed', function(done){

        var qioMock;

        var customizeMocks = function(mocks){
            qioMock = mocks['q-io/fs'];
            mocks['./PersistenceFormat'].getAllStoredEntries.returns(Q(['1']));
            mocks['./PersistenceFormat'].getEntryFullPath.returns('/fullPath/1');
            mocks['glob'] = sinon.stub().callsArgWith(2, null, ['/fullPath/1/a/m.m3u8']);
        };

        var endlistAppender = createEndListAppender(customizeMocks);
        endlistAppender.init().then(function() {
            expect(endlistAppender._entriesToProcess['1']).not.to.be.an('undefined');
            endlistAppender.removeEntry('1');
            expect(endlistAppender._entriesToProcess['someEntryId']).to.be.an('undefined');
            done();
        }).done(null, function(err){
            done(err);
        });
    });

    it('should succeed "removing" an entry which is not in the entry list', function(done){

        var qioMock;

        var customizeMocks = function(mocks){
            qioMock = mocks['q-io/fs'];
            mocks['./PersistenceFormat'].getAllStoredEntries.returns(Q(['1']));
            mocks['./PersistenceFormat'].getEntryFullPath.returns('/fullPath/1');
            mocks['glob'] = sinon.stub().callsArgWith(2, null, ['/fullPath/1/a/m.m3u8']);
        };

        var endlistAppender = createEndListAppender(customizeMocks);
        endlistAppender.init().then(function() {
            expect(endlistAppender._entriesToProcess['1111']).to.be.an('undefined');
            endlistAppender.removeEntry('1111');
            expect(endlistAppender._entriesToProcess['someEntryId']).to.be.an('undefined');
            done();
        }).done(null, function(err){
            done(err);
        });
    });
});