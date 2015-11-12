/**
 * Created by Gad.Yaari on 03-Nov-15.
 */

var fs = require('fs');
var chai = require('chai');
var expect =  chai.expect;
var sinon = require('sinon');
var path = require('path');
var m3u8 = require('m3u8');

function createParser() {
    return m3u8.createStream();
}

describe.only('Parse line method', function() {

    var parser;
    beforeEach(function(){
       parser = createParser();
    });
    it('Should check valid m3u8 file first line', function() {
        // Arrange
        var line = "#EXTMU";
        var callbackStub = sinon.stub();
        parser.on('error', callbackStub);
        // Act
        parser.parse(line);
        // Assert
        expect(callbackStub.called).to.eql(true);
    });
    it('Should raise an error whenever a line that expects a number receives a NaN', function() {
        // Arrange
        var line = "#EXT-X-MEDIA-SEQUENCE:";
        var callbackStub = sinon.stub();
        parser.on('error', callbackStub);
        // Act
        parser.parseLine(line);
        // Assert
        expect(callbackStub.called).to.eql(true);
    });

    it('Should raise an error whenever an EXT-INF line contains invalid duration', function() {
        //var callbackCalled = false;
        //var line = "#EXTINF:XXXXX,\nmedia-uefvqmelj_b1017600_12.ts"
        //parser.on('error', function(){
        //    callbackCalled = true;
        //});
        //parser.parseLine(line);
        //expect(callbackCalled).to.eql(true);

        // Arrange
        var line = "#EXTINF:XXXXX,\nmedia-uefvqmelj_b1017600_12.ts"
        var callbackStub = sinon.stub();
        parser.on('error', callbackStub);
        // Act
        parser.parseLine(line);
        // Assert
        expect(callbackStub.called).to.eql(true);
    });

    it.only('Should raise an error whenever an EXT-X-STREAM-INF line is not valid', function() {
        // Arrange
        var line = "EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=475136,RESOLUTION=480x270";
        var callbackStub = sinon.stub();
        parser.on('error', callbackStub);
        // Act
        parser.parseLine(line);
        // Assert
        expect(callbackStub.called).to.eql(true);
    });
});

