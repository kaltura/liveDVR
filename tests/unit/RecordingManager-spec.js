/**
 * Created by ron.yadgar on 21/07/2016.
 */
var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var Q = require('q');
var config = require('../../common/Configuration');
var path = require('path');

describe('Recording manager spec', function() {

    var RecordingManager = proxyquire('./../lib/RecordingManager', mocks);
    it('should return true when there is no folder of the entry', function(done)
    {

    })
    })