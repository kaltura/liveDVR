/**
 * Created by AsherS on 8/24/15.
 */

var httpUtils = require('../lib/utils/HTTPUtils');

describe('flavor-downloader tests', function() {


    before(function () {
        //load configuration file

        //define short iterations duration
    });

    it('should download playlist files successfully', function (done) {

        //var expectedManifest = fs.readFileSync(__dirname + '/resources/simpleManifest.m3u8', 'utf8');
        //
        //var m3u8Generator = createManifestGenerator();
        //var promise = m3u8Generator.init();
        //promise.done(function(currentManifest)
        //{
        //    expect(currentManifest.toString()).to.eql(expectedManifest.replace(/[\r]/g, ''));
        //    done();
        //});
    });

    it('should handle failure in one downloaded chunk in playlist', function (done) {

        //generate a playlist with 1 bad chunk

    });

    it('should download files for X seconds (2-3 iterations)', function (done) {


    });

    it('should shutdown downloader after X seconds', function (done) {


    });

    it('should handle non existing dest folder error', function (done) {

    });

    it('should handle non existing dest folder error', function (done) {

    });
});
