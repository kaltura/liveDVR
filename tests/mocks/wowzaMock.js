/**
 * Created by elad.benedict on 8/25/2015.
 */

var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var Q = require('q');
var qio = require('q-io/fs');
var sinon = require('sinon');

module.exports = function(networkClientMock) {

    var readFile = function (relativePath) {
        var res = fs.readFileSync(path.join(__dirname, '../resources/liveSessionData', relativePath), 'utf8');
        return Q(res);
    };

    var readManifest = function (flavorFolder, callNumber) {
        var res = readFile(path.join(flavorFolder, callNumber.toString()));
        return Q(res);
    };

    var files = fs.readdirSync(path.join(__dirname, '../resources/liveSessionData'));
    _.chain(files).filter(function (file) {
        return path.extname(file) === '.ts';
    }).forEach(function (file) {
        networkClientMock.read.withArgs(file).returns(readFile(file));
    });

    var masterPlaylist = readFile('playlist.m3u8');
    networkClientMock.read.withArgs('http://mediaServerHost/kLive/smil:0_81ybcbwq_all.smil/playlist.m3u8').returns(masterPlaylist);

    _.chain(_.range(0, 9)).forEach(function (i) {
        networkClientMock.read.withArgs('http://kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish2/kLive/smil:0_81ybcbwq_all.smil/chunklist_b475136.m3u8')
            .onCall(i).returns(readManifest('chunklist_b475136.m3u8', i + 1));

        networkClientMock.read.withArgs('http://kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish2/kLive/smil:0_81ybcbwq_all.smil/chunklist_b679936.m3u8')
            .onCall(i).returns(readManifest('chunklist_b679936.m3u8', i + 1));

        networkClientMock.read.withArgs('http://kalsegsec-a.akamaihd.net/dc-0/m/pa-live-publish2/kLive/smil:0_81ybcbwq_all.smil/chunklist_b987136.m3u8')
            .onCall(i).returns(readManifest('chunklist_b987136.m3u8', i + 1));
    });

    return networkClientMock;
};