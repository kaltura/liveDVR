/**
 * Created by igors on 7/12/16.
 */

var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var Q = require('Q');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe('Playlist Generator spec', function() {

    var config = require('./../../common/Configuration');
    config.set('logToConsole',false);
    var pc = config.get('playlistConfig');
    pc.debug = false;
    config.set('playlistConfig',pc);
    var fs = require('fs');
    var path = require('path');
    var PlaylistGenerator = require('./../../lib/PlaylistGenerator/PlaylistGenerator');
    var Playlist = require('./../../lib/PlaylistGenerator/Playlist');
    var _ = require('underscore');
    var t = require('tmp');

    var fileInfos = [
        { startTime: 1459270805911,
            sig: 'C53429E60F33B192FD124A2CC22C8717',
            video:
            { duration: 16224.699999999999,
                firstDTS: 1459270805994,
                firstEncoderDTS: 83,
                wrapEncoderDTS: 95443718 },
            audio:
            { duration: 16277.333333333334,
                firstDTS: 1459270805911,
                firstEncoderDTS: 0,
                wrapEncoderDTS: 95443718 },
            path: '/var/tmp/media-u774d8hoj_w20128143_1.mp4',
            flavor: "32"
        },
        { startTime: 1459270822434,
            sig: 'CBD793B1A2D5D3FF7A3FB4A888C746F2',
            video:
            { duration: 7131.700000000001,
                firstDTS: 1459270822434,
                firstEncoderDTS: 16308,
                wrapEncoderDTS: 95443718 },
            audio:
            { duration: 7061.333333333334,
                firstDTS: 1459270822446,
                firstEncoderDTS: 16320,
                wrapEncoderDTS: 95443718 },
            path: '/var/tmp/media-u774d8hoj_w20128143_2.mp4',
            flavor: "32" },
        { startTime: 1459270829426,
            sig: 'B3F857AB9FCB2E440BBBD14BDADAC54F',
            video:
            { duration: 12971.7,
                firstDTS: 1459270829442,
                firstEncoderDTS: 23440,
                wrapEncoderDTS: 95443718 },
            audio:
            { duration: 12949.333333333334,
                firstDTS: 1459270829426,
                firstEncoderDTS: 23424,
                wrapEncoderDTS: 95443718 },
            path: '/var/tmp/media-u774d8hoj_w20128143_3.mp4' ,
            flavor: "32"},
        { startTime: 1459270842369,
            sig: 'A3D511E62069A1F10523A2BC435DA977',
            video:
            { duration: 10385.7,
                firstDTS: 1459270842369,
                firstEncoderDTS: 36411,
                wrapEncoderDTS: 95443718 },
            audio:
            { duration: 10325.333333333332,
                firstDTS: 1459270842374,
                firstEncoderDTS: 36416,
                wrapEncoderDTS: 95443718 },
            path: '/var/tmp/media-u774d8hoj_w20128143_4.mp4' ,
            flavor: "32" }
    ];

    var createPlaylistGenerator = function(windowSize){

        config.set('rootFolderPath',t.dirSync().name);

        windowSize = windowSize || 100;

        var entry = {
                entryId:'abc',
                playWindow:windowSize
            };

        var plGen = new PlaylistGenerator(entry,true);
        return plGen.start();
    };

    //convert Playlist class type to plain object
    var jsonize = function(plGen) {
        var retval = JSON.parse(JSON.stringify(plGen.playlistImp));
        expect(retval).to.not.be.empty;
        return retval;
    };

    var deepCloneFileInfo = function(fi) {
        var n = _.clone(fi);
        if(fi.video){
            n.video = _.clone(fi.video);
        }
        if(fi.audio){
            n.audio = _.clone(fi.audio);
        }
        return n;
    };

    // produce fileInfo with all fileds offset by same <offset>
    var offsetFileInfo = function(fi,offset){

        offset = offset || (fi.video ? fi.video.duration : fi.audio.duration);
        var n = deepCloneFileInfo(fi);
        n.startTime += offset;
        if(n.video) {
            n.video.firstDTS += offset;
            n.video.firstEncoderDTS += offset;
            n.video.firstEncoderDTS %= n.video.wrapEncoderDTS;
        }
        if(n.audio) {
            n.audio.firstDTS += offset;
            n.audio.firstEncoderDTS += offset;
            n.audio.firstEncoderDTS %= n.audio.wrapEncoderDTS;
        }
        n.path = n.path.split('.').join('-' + n.startTime + '.');
        return n;
    };

    var updatePlaylist = function(plGen,fis){
        return Q.allSettled(plGen.update(fis)).then(function(){
            return Q.resolve(jsonize(plGen));
        });
    };

    describe('basics', function() {

        it('should correctly serialize from existing playlist and to JSON', function (done) {
            var expectedPlaylist = fs.readFileSync(path.join(__dirname, '/../resources/playlist.json'), 'utf8');

            var playlist = new Playlist('test', JSON.parse(expectedPlaylist));

            expect(JSON.stringify(playlist)).to.eql(expectedPlaylist);
            done();
        });

        it('playlist generator should be successfully created , started and stopped', function () {
            return expect(createPlaylistGenerator().then(function(plGen) {
                return plGen.stop();
            })).to.eventually.be.fullfilled;
        });

        it('should update duration when add an item', function (done) {
            createPlaylistGenerator().then(function (plGen) {
                var fi = {
                    startTime: 1459270805911,
                    sig: 'C53429E60F33B192FD124A2CC22C8717',
                    video: {
                        duration: 16224.699999999999,
                        firstDTS: 1459270805911,
                        firstEncoderDTS: 83,
                        wrapEncoderDTS: 95443718
                    },
                    path: '/var/tmp/media-u774d8hoj_w20128143_1.mp4',
                    flavor: "32"
                };
                updatePlaylist(plGen, [fi]).then(function (result) {
                    expect(result.durations[0]).to.eql(Math.ceil(fi.video.duration));
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
        });

        it('should update duration when add an audio only item', function (done) {
            createPlaylistGenerator().then(function (plGen) {
                var fi = {
                    startTime: 1459270805911,
                    sig: 'C53429E60F33B192FD124A2CC22C8717',
                    audio: {
                        duration: 16224.699999999999,
                        firstDTS: 1459270805911,
                        firstEncoderDTS: 83,
                        wrapEncoderDTS: 95443718
                    },
                    path: '/var/tmp/media-u774d8hoj_w20128143_1.mp4',
                    flavor: "32"
                };
                updatePlaylist(plGen, [fi]).then(function (result) {
                    expect(result.durations[0]).to.eql(Math.ceil(fi.audio.duration));
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
        });



        it('handle dts wrap', function(done)
        {
            var before = { startTime: 1459270805911,
                sig: 'C53429E60F33B192FD124A2CC22C8717',
                video:
                { duration: 16224.699999999999,
                    firstDTS: 1459270805911,
                    firstEncoderDTS: 95443718-100,
                    wrapEncoderDTS: 95443718 },
                path: '/var/tmp/media-u774d8hoj_w20128143_1.mp4',
                flavor: "32"
            }, after = offsetFileInfo(before);

            createPlaylistGenerator().then( function(plGen) {
                updatePlaylist(plGen,[before,after]).then(function(obj) {
                    expect(obj.durations[0]).to.eql(Math.ceil(before.video.duration)+Math.ceil(after.video.duration));
                    done();
                }).catch(function(err){
                    done(err);
                });
            });
        });

    });

    var minDTS = function(fi){
        var retval;
        if(fi.video && fi.audio){
            retval = Math.min(fi.video.firstDTS,fi.audio.firstDTS);
        } else if(fi.video) {
            retval = fi.video.firstDTS;
        } else {
            retval = fi.audio.firstDTS;
        }
        return Math.ceil(retval);
    };

    var sum = function(arr){
        return _.reduce(arr,function(val,s){
            return val + s;
        },0);
    };

    describe('gap handling', function() {
        it('should create gap', function (done) {
            createPlaylistGenerator().then(function (plGen) {

                var before = { startTime: 1459270805911,
                    sig: 'C53429E60F33B192FD124A2CC22C8717',
                    video:
                    { duration: 16224.699999999999,
                        firstDTS: 1459270805911,
                        firstEncoderDTS: 95443718,
                        wrapEncoderDTS: 95443718,
                        keyFrameDTS: [0,2000,4000,6000,8000,10000,12000,14000]},
                    path: '/var/tmp/media-u774d8hoj_w20128143_1.mp4',
                    flavor: "32"
                }, after = offsetFileInfo(before,100000);

                updatePlaylist(plGen, [before, after]).then(function (obj) {
                    expect(obj.durations.length).to.eql(2);
                    expect(obj.durations[0]).to.eql(Math.ceil(before.video.duration));
                    expect(obj.durations[1]).to.eql(Math.ceil(after.video.duration));
                    expect(obj.clipTimes.length).to.eql(2);
                    expect(obj.sequences[0].clips.length).to.eql(2);
                    expect(obj.clipTimes[1]).to.eql(minDTS(after));
                    expect(obj.sequences[0].clips[1].sources[0].offset).to.eql(0);
                    expect(obj.sequences[0].clips[0].sources[0].offset).to.eql(0);

                    expect(sum(obj.sequences[0].keyFrameDurations)).to.eql(Math.ceil(before.video.duration) + 100000);
                    expect(obj.sequences[0].keyFrameDurations.length).to.eql(2 * before.video.keyFrameDTS.length);
                    expect(obj.sequences[0].firstKeyFrameOffset).to.eql(0);
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
        });

        it('should create gap audio only', function (done) {
            createPlaylistGenerator().then(function (plGen) {

                var before = {
                    startTime: 1459270805911,
                    sig: 'C53429E60F33B192FD124A2CC22C8717',
                    audio: {
                        duration: 16224.699999999999,
                        firstDTS: 1459270805911,
                        firstEncoderDTS: 95443718,
                        wrapEncoderDTS: 95443718
                    },
                    path: '/var/tmp/media-u774d8hoj_w20128143_1.mp4',
                    flavor: "32"
                }, after = offsetFileInfo(before, 100000);

                updatePlaylist(plGen, [before, after]).then(function (obj) {
                    expect(obj.durations.length).to.eql(2);
                    expect(obj.durations[0]).to.eql(Math.ceil(before.audio.duration));
                    expect(obj.durations[1]).to.eql(Math.ceil(after.audio.duration));
                    expect(obj.clipTimes.length).to.eql(2);
                    expect(obj.sequences[0].clips.length).to.eql(2);
                    expect(obj.clipTimes[1]).to.eql(minDTS(after));
                    expect(obj.sequences[0].clips[1].sources[0].offset).to.eql(0);
                    expect(obj.sequences[0].clips[0].sources[0].offset).to.eql(0);
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
        });

        it('should roll window over gap', function (done) {
            var before = { startTime: 1459270805911,
                sig: 'C53429E60F33B192FD124A2CC22C8717',
                video:
                { duration: 16224.699999999999,
                    firstDTS: 1459270805911,
                    firstEncoderDTS: 95443718,
                    wrapEncoderDTS: 95443718,
                    keyFrameDTS: [0,2000,4000,6000,8000,10000,12000,14000]},
                path: '/var/tmp/media-u774d8hoj_w20128143_1.mp4',
                flavor: "32"
            };

            createPlaylistGenerator(Math.ceil(before.video.duration * 2 / 1000)).then(function (plGen) {

                var after = offsetFileInfo(before,100000),
                    after1 = offsetFileInfo(after),
                    after2 = offsetFileInfo(after1);

                updatePlaylist(plGen, [before, after]).then(function (obj) {
                    expect(obj.durations.length).to.eql(2);
                    expect(obj.clipTimes.length).to.eql(2);
                    return updatePlaylist(plGen, [after1, after2]).then(function (obj) {
                        expect(obj.durations.length).to.eql(1);
                        expect(obj.clipTimes.length).to.eql(1);
                        done();
                    });
                }).catch(function (err) {
                    done(err);
                });
            });
        });
    });

    describe('rolling window', function() {
        it('should pop item when window rolls on', function (done) {

            var fi = {
                startTime: 1459270805911,
                sig: 'C53429E60F33B192FD124A2CC22C8717',
                video: {
                    duration: 16225,
                    firstDTS: 1459270805911,
                    firstEncoderDTS: 83,
                    wrapEncoderDTS: 95443718
                },
                path: '/var/tmp/media-u774d8hoj_w20128143_1.mp4',
                flavor: "32"
            };

            var fis = [];

            for (var i = 0; i < 6; i++) {
                fi = offsetFileInfo(fi, fi.video.duration);
                fis.push(fi);
            }

            var windowSize = fi.video.duration * 2;

            createPlaylistGenerator(Math.ceil(windowSize / 1000)).then(function (plGen) {
                updatePlaylist(plGen, fis).then(function (obj) {
                    expect(obj.durations[0]).to.at.most(windowSize + fi.video.duration);
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
        });
    });

    describe('anomalities', function() {

        it('should be able to add item despite wrong id 3 tamestamp', function (done) {
            createPlaylistGenerator().then(function (plGen) {

                var fis = {
                    startTime: 1459270805911,
                    sig: 'C53429E60F33B192FD124A2CC22C8717',
                    video: {
                        duration: 16224.699999999999,
                        firstDTS: 1459270805911,
                        firstEncoderDTS: 83,
                        wrapEncoderDTS: 95443718
                    },
                    path: '/var/tmp/media-u774d8hoj_w20128143_1.mp4',
                    flavor: "32"
                };

                var bad = offsetFileInfo(fis, fis.video.duration);
                //scramble firstDTS
                bad.video.firstDTS -= 10000000;

                updatePlaylist(plGen, [fis, bad]).then(function (obj) {
                    expect(obj.durations.length).eql(1);
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
        });


        it('should produce gap despite id3 timestamp = 0', function (done) {
            createPlaylistGenerator().then(function (plGen) {

                var fis = {
                    startTime: 1459270805911,
                    sig: 'C53429E60F33B192FD124A2CC22C8717',
                    video: {
                        duration: 16224.699999999999,
                        firstDTS: 1459270805911,
                        firstEncoderDTS: 83,
                        wrapEncoderDTS: 95443718
                    },
                    path: '/var/tmp/media-u774d8hoj_w20128143_1.mp4',
                    flavor: "32"
                };

                var bad = offsetFileInfo(fis, 60000);
                //scramble firstDTS
                bad.startTime = bad.video.firstDTS = 0;

                var good = offsetFileInfo(fis, 60000 + bad.video.duration);

                updatePlaylist(plGen, [fis, bad, good]).then(function (result) {
                    expect(result.durations.length).eql(2);
                    expect(result.clipTimes[1]).to.be.within(good.video.firstDTS - 1, good.video.firstDTS + 1);
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
        });


        it('should reject item wiht overlapping time range', function (done) {
            createPlaylistGenerator().then(function (plGen) {
                var fi = {
                    startTime: 1459270805911,
                    sig: 'C53429E60F33B192FD124A2CC22C8717',
                    video: {
                        duration: 16224.699999999999,
                        firstDTS: 1459270805911,
                        firstEncoderDTS: 83,
                        wrapEncoderDTS: 95443718
                    },
                    path: '/var/tmp/media-u774d8hoj_w20128143_1.mp4',
                    flavor: "32"
                }, overlap = offsetFileInfo(fi,-1000);

                updatePlaylist(plGen, [fi, overlap]).then(function (result) {
                    expect(result.durations[0]).to.eql(Math.ceil(fi.video.duration));
                    expect(result.sequences[0].clips[0].sources[0].paths.length).to.eql(1);
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
        });

        it('should reject item with duplicate filename', function (done) {
            createPlaylistGenerator().then(function (plGen) {
                var fi = {
                    startTime: 1459270805911,
                    sig: 'C53429E60F33B192FD124A2CC22C8717',
                    video: {
                        duration: 16224.699999999999,
                        firstDTS: 1459270805911,
                        firstEncoderDTS: 83,
                        wrapEncoderDTS: 95443718
                    },
                    path: '/var/tmp/media-u774d8hoj_w20128143_1.mp4',
                    flavor: "32"
                }, duplicate = offsetFileInfo(fi);

                duplicate.path = fi.path;

                updatePlaylist(plGen, [fi, duplicate]).then(function (result) {
                    expect(result.durations[0]).to.eql(Math.ceil(fi.video.duration));
                    expect(result.sequences[0].clips[0].sources[0].paths.length).to.eql(1);
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
        });
    });

});
