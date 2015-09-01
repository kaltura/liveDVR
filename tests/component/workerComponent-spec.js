/**
 * Created by elad.benedict on 8/31/2015.
 */

var chai = require('chai');
var expect = chai.expect;
var Q = require('Q');
var config = require('../../lib/Configuration');
var tmp = require('tmp');
var path = require('path');
var _ = require('underscore');
var fs = require('fs');

describe('Worker component spec', function() {

    var networkClientMock;
    var tmpFolderObj;
    var wowzaMock;

    before(function(){
        config.set('pollingInterval', 50);
        config.set('mockNetwork', true);
        config.set('mockBackend', true);

        config.set("mediaServer:hostname", "mediaServerHost");
        config.set("applicationName", "kLive");

        tmpFolderObj = tmp.dirSync({unsafeCleanup : true});
        config.set('rootFolderPath', tmpFolderObj.name);
        config.set('logFileName', path.join(tmpFolderObj.name, 'filelog-info.log'));

        networkClientMock = require('../../lib/NetworkClientFactory').getNetworkClient();
        wowzaMock = require('../mocks/wowzaMock')(networkClientMock);
    });

    var validateFlavor = function(flavor){
        var filesInFlavorFolder = fs.readdirSync(path.join(tmpFolderObj.name, '12345', flavor));
        var expectedFileNamePattern = new RegExp(flavor + ".*\.ts$");
        var tsFiles = _.filter(filesInFlavorFolder, function(f){
            return f.match(expectedFileNamePattern);
        });
        expect(tsFiles.length).to.be.equal(24);
    };

    var validateFlavors = function(){
        _.each(['475136', '987136', '679936'], validateFlavor);
    };

    it('should download all chunks when there are no errors', function (done) {
        this.timeout(5000);
        var worker = require('../../lib/Worker');
        worker.start();
        Q.delay(3000).then(function(){
            validateFlavors();
            done();
        }).done(null, function(err){
            done(err);
        });
    });
});