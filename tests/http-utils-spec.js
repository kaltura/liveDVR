/**
 * Created by AsherS on 8/24/15.
 */

var httpUtils = require('../lib/utils/HTTPUtils');

describe('http-utils tests', function() {

    it('should download file successfully', function (done) {

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

    it('should fail due to bad url', function (done) {

    });

    it('should fail on 404', function (done) {

    });

    it('should fail on timeout', function (done) {
        //large file, short timeout
    });
});
