/**
 * Created by elad.benedict on 8/12/2015.
 */

var assert = require("assert");
describe('TestDescribe', function() {
    it('should succeed', function () {
        var testObj = require('../lib/sampleClass.js');
        var result = testObj.doYourThing(1);
        assert.equal(result, 2);
    });
});
