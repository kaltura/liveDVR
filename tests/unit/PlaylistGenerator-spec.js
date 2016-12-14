/**
 * Created by igors on 7/12/16.
 */

var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var Q = require('q');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe('Playlist Generator spec', function() {

    var config = require('./../../common/Configuration');
    config.set('logToConsole',false);
    const pc = config.get('playlistConfig');
    pc.debug = false;
    pc.skipPathCheck = true
    config.set('playlistConfig',pc);
    var fs = require('fs');
    var path = require('path');
    var PlaylistGenerator = require('./../../lib/playlistGenerator/PlaylistGenerator');
    var Playlist = require('./../../lib/playlistGenerator/Playlist');
    var _ = require('underscore');
    var t = require('tmp');
    const err_utils = require('./../../lib/utils/error-utils');
    const maxClipsPerFlavor=config.get('maxClipsPerFlavor');

    sinon.stub(require('./../../lib/utils/fs-utils'), "writeFileAtomically", () => Q.resolve())
    sinon.stub(require('q-io/fs'), "read", () => Q.resolve())
    sinon.stub(require('q-io/fs'), "remove", () => Q.resolve())

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
            path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
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
            path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_2.mp4',
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
            path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_3.mp4' ,
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
            path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_4.mp4' ,
            flavor: "32" }
    ];

    //this.timeout(0);

    var createPlaylistGenerator = function(windowSize,playlist){

        config.set('rootFolderPath',t.dirSync().name);

        windowSize = windowSize || 100;

        var entry = {
                entryId:'abc',
                playWindow:windowSize,
                getStreamInfo:function(){
                    return {
                        getAllFlavors:function(){
                            return Q.resolve('');
                        }
                    }
                }
            };

        var plGen = new PlaylistGenerator(entry);

        return plGen.initializeStart()
            .then(() => {
                return plGen;
            })
            .catch((error) => {
                return Q.resolve(plGen);
            })
            .finally(() => {
                return plGen;
            }) ;
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

        var items = n.path.split('_');
        items.last = Math.ceil(n.startTime) + '.mp4';
        n.path = items.join('_');
        return n;
    };

    let saveAsTsMock = () => {
        return Q.resolve();
    };

    var updatePlaylist = function(plGen,fis){
        _.each(fis,(fi)=>{
            fi.saveAsTS = saveAsTsMock
            if(!fi.path){
                fi.path = fi.chunkName;
            }
        });
        return Q.allSettled(plGen.update(fis)).then(function(){
            return Q.resolve(jsonize(plGen));
        });
    };

    var batchAppend = function(ch,n,arr){
        arr = arr || [];
        arr.push(ch);
        for(var j = 0; j < n; j++) {
            arr.push(offsetFileInfo(arr.last));
        }
        return arr;
    };

    function validatePlaylistGen(plGen,done){
        expect(plGen.validate()).to.be.eql(true);
        if(done)
            done()
    }

    var checkKeyFrames = function(playlist){
        _.each(playlist.inner.sequences,function(seq){
            _.each(seq.clips,function(c){
                _.each(c.inner.sources,function(src) {
                    if(src.isVideo) {
                        expect(src.keyFrameDurations.length).to.be.eql(src.inner.durations.length);
                        let totalKeyFrameDuration = _.reduce(src.keyFrameDurations,(result,kf)=>{
                            return result + kf.sum()
                        },0);
                        expect(totalKeyFrameDuration).to.be.eql(src.inner.durations.sum());
                    }
                });
            });
        });
    };

    describe('basics', function() {

       // this.timeout(0)
        it('should produce valid diagnostics', function (done) {
            createPlaylistGenerator().then(function (plGen) {

                let fs1 = {"startTime":1476396840775,"sig":"842168C088B2E6F3FAFEC7AC857069E1","video":{"duration":89551653.688889,"firstDTS":1476396840814,"firstEncoderDTS":5901623,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2400]},"audio":{"duration":4605.977778,"firstDTS":1476396840775,"firstEncoderDTS":5901584.1,"wrapEncoderDTS":95443718},"metaData":{"resolution":[1280,720],"fileSize_kbits":6632,"framerate":25,"keyFrameDistance":44775828,"bitrate_kbps":0},"path":"/web/content/kLive/live/0_fgq2oej6/32/18/u0qvfgs93-591.mp4","flavor":"32","chunkName":"u0qvfgs93-591.mp4","targetDuration":4289076000,"windowSize":85781520000,"url":"http://pa-live-publish102.kaltura.com:1935/kLive/_definst_/0_fgq2oej6_32"};
                updatePlaylist(plGen, [fs1]).then((result) => {

                    plGen.playlistImp.ptsReference.absolute = 1476390938546;
                    plGen.playlistImp.ptsReference.pts = 0;
                    plGen.on('diagnosticsInfo',(diag)=>{
                        expect(diag.ptsDelta).to.not.be.eql(null);
                        expect(diag.clockDelta).to.not.be.eql(null);
                    });

                    let ovfl = {"startTime":1476396854614,"sig":"8CE845B6194E971AF2FF86CFCEE0B620",
                        "video":{"duration":4800,"firstDTS":1476396854614,"firstEncoderDTS":95453276.688889,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2400]},"audio":{"duration":4736.866667,"firstDTS":1476402751245,"firstEncoderDTS":5906190.088889,"wrapEncoderDTS":95443718},"metaData":{"resolution":[1280,720],"fileSize_kbits":6932,"framerate":25,"keyFrameDistance":2400,"bitrate_kbps":1444},"path":"/web/content/kLive/live/0_fgq2oej6/32/18/u0qvfgs93-592.mp4","flavor":"32","chunkName":"u0qvfgs93-592.mp4","targetDuration":4289076000,"windowSize":85781520000,"url":"http://pa-live-publish102.kaltura.com:1935/kLive/_definst_/0_fgq2oej6_32"};
                    return updatePlaylist(plGen, [ovfl]);
                })
                    .then((result)=>{
                        expect(result.sequences[0].clips[0].sources[0].durations.length).eql(1);
                        validatePlaylistGen(plGen,done);
                    })
                    .catch(function (err) {
                        done(err);
                    });
            });
        });

        it('playlist generator should be successfully created , started and stopped', function (done) {
            createPlaylistGenerator().then(function(plGen) {
                return plGen.stop();
            })
            .then(done,(err)=>done(err))
        });

        it('playlist generator should not generate playlist until all flavors are ready', function (done) {

            var fv1 = {
                startTime: 1459270805911,
                sig: 'C53429E60F33B192FD124A2CC22C8717',
                video:
                {
                    duration: 16000,
                    firstDTS: 1459270805994,
                    firstEncoderDTS: 83,
                    wrapEncoderDTS: 95443718,
                    keyFrameDTS:[0,8000]
                },
                path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
                flavor: "32"
            }, fv2 = {
                startTime: 1459270805911,
                sig: 'C53429E60F33B192FD124A2CC22C8717',
                video:
                {
                    duration: 16000,
                    firstDTS: 1459270805994 - 1000,
                    firstEncoderDTS: 83,
                    wrapEncoderDTS: 95443718 - 1000,
                    keyFrameDTS:[0,8000]
                },
                path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
                flavor: "33"
            };

            let plGen;
            createPlaylistGenerator()
                .then(function(plgen) {
                    plGen = plgen
                     // force playlist to generate flavors
                   plGen.playlistImp.getSequenceForFlavor(fv1.flavor)
                   plGen.playlistImp.getSequenceForFlavor(fv2.flavor)

                   return updatePlaylist(plGen,[fv1])
                 })
                .then(function(playlist){
                    expect(_.size(playlist.durations)).to.be.eql(0)

                    return updatePlaylist(plGen,[fv2])
                })
                .then( (playlist) => {
                    expect(_.size(playlist.durations)).to.be.eql(1)
                    expect(playlist.durations[0]).to.be.above(0)
                    expect(playlist.firstClipStartOffset).to.be.least(0)
                    validatePlaylistGen(plGen,done);
                })
                .catch(err => {
                    done(err)
                })
        });

        //this.timeout(0);
        it('playlist generator should preserve key frame state when serialized back and forth', function (done) {

            var fis = batchAppend({
                startTime: 1459270805911,
                sig: 'C53429E60F33B192FD124A2CC22C8717',
                video:
                {
                    duration: 16000,
                    firstDTS: 1459270805994,
                    firstEncoderDTS: 83,
                    wrapEncoderDTS: 95443718,
                    keyFrameDTS:[0,8000]
                },
                path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
                flavor: "32"
            },1);
            fis[1].video.keyFrameDTS = [0];

            createPlaylistGenerator().then(function(plGen) {
                return updatePlaylist(plGen,fis).then(function(playlist){
                    var playlist2 = new Playlist('test2',playlist);
                    checkKeyFrames(playlist2);
                    validatePlaylistGen(plGen,done);
                })
            }).catch((err)=>done(err))
        });

        it('playlist generator should keep key frames duration in sync with chunk duration', function (done) {

            var fis = batchAppend({
                startTime: 1459270805911,
                sig: 'C53429E60F33B192FD124A2CC22C8717',
                video:
                {
                    duration: 16000,
                    firstDTS: 1459270805994,
                    firstEncoderDTS: 83,
                    wrapEncoderDTS: 95443718,
                    keyFrameDTS:[0,8000]
                },
                path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
                flavor: "32"
            },2);

            fis[1].video.firstDTS        += 333;
            fis[1].video.firstEncoderDTS += 333;
            fis[2].video.firstDTS        -= 111;
            fis[2].video.firstEncoderDTS -= 111;

            createPlaylistGenerator().then(function(plGen) {
                return updatePlaylist(plGen,fis).then(function(playlist){
                    checkKeyFrames(plGen.playlistImp);
                    validatePlaylistGen(plGen,done);
                })
            }).catch((err)=>done(err))
        });


        it('should correctly serialize from existing playlist and to JSON', function (done) {
            var expectedPlaylist = fs.readFileSync(path.join(__dirname, '/../resources/playlist.json'), 'utf8');

            var playlist = new Playlist('test', JSON.parse(expectedPlaylist));

            expectedPlaylist = JSON.parse(expectedPlaylist);

            // toJSON will do all the job of transforming Playlist object to json string
            let serializedPlaylist = JSON.parse(JSON.stringify(playlist));

            //compare  all fields but history
            expect(_.isEqual(_.omit(serializedPlaylist,['history']),_.omit(expectedPlaylist,['history']))).to.eql(true);
            done();
        });

        it('playlist generator reset', function (done) {
            var expectedPlaylist = fs.readFileSync(path.join(__dirname, '/../resources/playlist.json'), 'utf8');
            createPlaylistGenerator(3600,expectedPlaylist).then(function(plGen) {
                expect(_.every(jsonize(plGen).sequences,function(s){
                    return s.clips.length !== 0;
                })).to.be.eql(true);
                return plGen.reset().then(function(){
                    expect(_.every(jsonize(plGen).sequences,function(s){
                       return s.clips.length === 0;
                    })).to.be.eql(true);
                })
            }) .then(done,(err)=>done(err))
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
                        wrapEncoderDTS: 95443718,
                        keyFrameDTS: [0,2000,4000,6000,8000,10000,12000,14000]
                    },
                    path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
                    flavor: "32"
                };
                updatePlaylist(plGen, [fi]).then(function (result) {
                    expect(result.durations[0]).to.eql(Math.ceil(fi.video.duration));
                    validatePlaylistGen(plGen,done);
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
                    path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
                    flavor: "32"
                };
                updatePlaylist(plGen, [fi]).then(function (result) {
                    expect(result.durations[0]).to.eql(Math.ceil(fi.audio.duration));
                    validatePlaylistGen(plGen,done);
                }).catch(function (err) {
                    done(err);
                });
            });
        });

        it('handle dts for 26 hours', function(done)
        {
            var fi = { startTime: 1459270805911,
                sig: 'C53429E60F33B192FD124A2CC22C8717',
                video:
                { duration: 95443718 / 10,
                    firstDTS: 1459270805911,
                    firstEncoderDTS: 95443718-100,
                    wrapEncoderDTS: 95443718,
                    keyFrameDTS: [0,2000,4000,6000,8000,10000,12000,14000] },
                path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
                flavor: "32"
            };

            var input = batchAppend(fi,500),
                expectedDuration = Math.ceil(_.reduce(input,function(val,fi){
                    return val + fi.video.duration;
                },0));

            createPlaylistGenerator(expectedDuration*2).then( function(plGen) {

                updatePlaylist(plGen,input).then(function(obj) {
                    expect(obj.durations.length).to.eql(1);
                    expect(obj.durations[0]).to.eql(expectedDuration);
                    validatePlaylistGen(plGen,done);
                }).catch(function(err){
                    done(err);
                });
            });
        });

        //this.timeout(oldTimeout);

        it('handle dts wrap', function(done)
        {
            var before = { startTime: 1459270805911,
                sig: 'C53429E60F33B192FD124A2CC22C8717',
                video:
                { duration: 16224.699999999999,
                    firstDTS: 1459270805911,
                    firstEncoderDTS: 95443718-100,
                    wrapEncoderDTS: 95443718,
                    keyFrameDTS: [0,2000,4000,6000,8000,10000,12000,14000] },
                path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
                flavor: "32"
            }, after = offsetFileInfo(before);

            createPlaylistGenerator().then( function(plGen) {
                updatePlaylist(plGen,[before,after]).then(function(obj) {
                    expect(obj.durations[0]).to.eql(Math.ceil(before.video.duration)+Math.ceil(after.video.duration));
                    validatePlaylistGen(plGen,done);
                }).catch(function(err){
                    done(err);
                });
            });
        });

        it('handle reference pts to pts distance getting larger than dts wrap value', function(done)
        {
            var referencePTS = { startTime: 1459270805911,
                sig: 'C53429E60F33B192FD124A2CC22C8717',
                video:
                { duration: 16224.699999999999,
                    firstDTS: 1459270805911,
                    firstEncoderDTS: 95443718-100,
                    wrapEncoderDTS: 95443718,
                    keyFrameDTS: [0,2000,4000,6000,8000,10000,12000,14000]
                    },
                path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
                flavor: "32"
            }, afterManyHours = offsetFileInfo(referencePTS,referencePTS.video.wrapEncoderDTS / 2);

            createPlaylistGenerator().then( function(plGen) {
                updatePlaylist(plGen,[referencePTS,afterManyHours]).then(function(obj) {
                    expect(sum(obj.durations)).to.eql(Math.ceil(referencePTS.video.duration+afterManyHours.video.duration));
                    expect(obj.sequences[0].clips.length).to.eql(2);
                    validatePlaylistGen(plGen,done);
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
                    path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
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

                    obj.sequences[0].clips.forEach(function(c,index) {
                        expect(sum(c.keyFrameDurations)).to.eql(sum(c.sources[0].durations) - plGen.playlistImp.sequences[0].clips[index].sources[0].keyFrameDurations.last.last);
                        expect(c.firstKeyFrameOffset).to.eql(c.sources[0].offset);
                    });
                    validatePlaylistGen(plGen,done);
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
                    path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
                    flavor: "32"
                }, after = offsetFileInfo(before, 100000);

                updatePlaylist(plGen, [before, after]).then(function (obj) {
                    expect(obj.durations.length).to.eql(2);
                    expect(obj.durations[0]).to.eql(Math.ceil(before.audio.duration));
                    expect(obj.durations[1]).to.eql(Math.ceil(after.audio.duration));
                    expect(obj.clipTimes.length).to.eql(2);
                    expect(obj.sequences[0].clips.length).to.eql(2);
                    expect(obj.sequences[0].firstKeyFrameOffset).to.be.undefined;
                    expect(obj.sequences[0].keyFrameDurations).to.be.undefined;
                    expect(obj.clipTimes[1]).to.eql(minDTS(after));
                    expect(obj.sequences[0].clips[1].sources[0].offset).to.eql(0);
                    expect(obj.sequences[0].clips[0].sources[0].offset).to.eql(0);
                    validatePlaylistGen(plGen,done);
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
                path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
                flavor: "32"
            }, before_flv1 = deepCloneFileInfo(before);

            before_flv1.flavor = "33";


            createPlaylistGenerator(Math.ceil(before.video.duration * 2 / 1000)).then(function (plGen) {

                var  after_flv1 = offsetFileInfo(before_flv1,100000),
                    after_flv12 = offsetFileInfo(after_flv1),
                    after = offsetFileInfo(before,100000);

                updatePlaylist(plGen, [before,before_flv1, after,after_flv1]).then(function (obj) {
                    expect(obj.durations.length).to.eql(2);
                    expect(obj.clipTimes.length).to.eql(2);

                    var afterArr = batchAppend(after,10),
                        afterArr_flv1 = batchAppend(after_flv12,10);

                    return updatePlaylist(plGen,afterArr.concat(afterArr_flv1)).then(function (obj) {
                        expect(obj.durations.length).to.eql(1);
                        expect(obj.clipTimes.length).to.eql(1);
                        _.each(plGen.playlistImp.inner.sequences,function(seq){
                            expect(seq.clips.length).to.be.eql(plGen.playlistImp.inner.durations.length);
                        });
                        validatePlaylistGen(plGen,done);
                    });
                }).catch(function (err) {
                    done(err);
                });
            });
        });


        it('should defer window rolling until first clip is empty', function (done) {
            // insert *large* clip
            var before = { startTime: 1459270805911,
                sig: 'C53429E60F33B192FD124A2CC22C8717',
                video:
                { duration: 20000,
                    firstDTS: 1459270805911,
                    firstEncoderDTS: 95443718,
                    wrapEncoderDTS: 95443718,
                    keyFrameDTS: [0,2000,4000,6000,8000,10000,12000,14000,16000,18000]},
                path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
                flavor: "32"
            };

            var windowSec = 35;

            createPlaylistGenerator(windowSec).then(function (plGen) {

                var beforeArr = batchAppend(before,2);

                var after = offsetFileInfo(before,100000);
                after.video.duration = 6000;
                after.video.keyFrameDTS = _.filter(after.video.keyFrameDTS,function(dts){
                   return dts < after.video.duration;
                });
                var afterArr = batchAppend(after,10);

                var expectedDuration1,expectedDuration2;

                updatePlaylist(plGen, beforeArr.concat([after])).then(function (obj) {
                    expect(obj.durations.length).to.eql(2);
                    expect(obj.clipTimes.length).to.eql(2);
                    expectedDuration1 = obj.durations[0];
                    expectedDuration2 = obj.durations[1];
                    // add chunk 16 sec. -> 20 + 16 + 16 = 52.
                    // which is > 36, however 52-20 < 36, so nothing should happen
                    return updatePlaylist(plGen, afterArr).then(function (obj) {
                        expect(obj.durations.length).to.eql(2);
                        expect(obj.sequences[0].clips[1].sources[0].durations.length).to.eql(11);
                        expect(obj.durations[0]).to.eql(expectedDuration1-before.video.duration);
                        expect(obj.durations[1]).to.eql(after.video.duration * obj.sequences[0].clips[1].sources[0].durations.length);
                        expect(sum(obj.durations)).to.be.above(2 * windowSec*1000 + after.video.duration);
                        expect(obj.clipTimes.length).to.eql(2);
                        validatePlaylistGen(plGen,done);
                    });
                }).catch(function (err) {
                    done(err);
                });
            });
        });

        it('should conceal clips with zero duration', function (done) {
            createPlaylistGenerator(3600000).then(function (plGen) {

                var dataArr=[{"startTime":1473003964827,"sig":"E51C3FE8815B0055C175FE1128FAFF66","video":{"duration":11999.666666666666,"firstDTS":1473003964827,"firstEncoderDTS":0,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,1999,3999,5999,7999,9999]},"audio":{"duration":11981.488888888889,"firstDTS":1473003964827,"firstEncoderDTS":0,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_1.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_1.ts","targetDuration":12000,"windowSize":216000},
                    {"startTime":1473003986826,"sig":"8E33A02D818CFFFD306A6EA5B877FFA9","video":{"duration":10000.666666666668,"firstDTS":1473003986826,"firstEncoderDTS":21999,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.344444444445,"firstDTS":1473003986839.5222,"firstEncoderDTS":22012.522222222222,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_3.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_3.ts","targetDuration":12000,"windowSize":216000},
                    {"startTime":1473004006694,"sig":"ACB64928FC0D2C8E671ECEEBB446CA5A","video":{"duration":9999.666666666666,"firstDTS":1473004006694,"firstEncoderDTS":41866,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004006693.578,"firstEncoderDTS":41865.57777777778,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_5.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_5.ts","targetDuration":12000,"windowSize":216000},
                    {"startTime":1473004026687,"sig":"6CA2C78F21EFC91651407E52519DDAEA","video":{"duration":9799.666666666668,"firstDTS":1473004026695,"firstEncoderDTS":61866,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9822.033333333333,"firstDTS":1473004026686.9556,"firstEncoderDTS":61857.955555555556,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_7.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_7.ts","targetDuration":12000,"windowSize":216000},
                    {"startTime":1473004046404,"sig":"783B46BD63EBAC350FEE28B07796CEBA","video":{"duration":9999.666666666666,"firstDTS":1473004046429,"firstEncoderDTS":81666,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004046404.3555,"firstEncoderDTS":81641.35555555555,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_9.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_9.ts","targetDuration":12000,"windowSize":216000},
                    {"startTime":1473003976809,"sig":"2425259580ED576738F77EB6824FE3AA","video":{"duration":10000.666666666668,"firstDTS":1473003976826,"firstEncoderDTS":11999,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473003976808.5,"firstEncoderDTS":11981.5,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_2.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_2.ts","targetDuration":12000,"windowSize":216000},
                    {"startTime":1473003996802,"sig":"E2994D4917BDA873D3358BC6DC15139A","video":{"duration":9866.666666666668,"firstDTS":1473003996827,"firstEncoderDTS":31999,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,3867,5867,7867]},"audio":{"duration":9891.688888888888,"firstDTS":1473003996801.8777,"firstEncoderDTS":31973.877777777776,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_4.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_4.ts","targetDuration":12000,"windowSize":216000},
                    {"startTime":1473004016655,"sig":"AEDE1DCC690CEE860C33DA0F3A91D887","video":{"duration":9999.666666666666,"firstDTS":1473004016694,"firstEncoderDTS":51866,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.022222222224,"firstDTS":1473004016654.9333,"firstEncoderDTS":51826.933333333334,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_6.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_6.ts","targetDuration":12000,"windowSize":216000},
                    {"startTime":1473004036429,"sig":"415A530B68C2AA3C2BF0EB901C1BAB80","video":{"duration":9999.666666666666,"firstDTS":1473004036429,"firstEncoderDTS":71666,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004036443,"firstEncoderDTS":71680,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_8.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_8.ts","targetDuration":12000,"windowSize":216000},
                    {"startTime":1473003964827,"sig":"05FDB706951CA17CE67D685D07CE3147","video":{"duration":11932.666666666666,"firstDTS":1473003964827,"firstEncoderDTS":0,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,1933,3933,5933,7933,9933]},"audio":{"duration":11981.488888888889,"firstDTS":1473003964827,"firstEncoderDTS":0,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_1.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_1.ts","targetDuration":12000,"windowSize":216000},
                    {"startTime":1473003986826,"sig":"D375A45C6C329EDE38E881BD8514A957","video":{"duration":9999.666666666666,"firstDTS":1473003986826,"firstEncoderDTS":21933,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.344444444445,"firstDTS":1473003986839.5222,"firstEncoderDTS":22012.522222222222,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_3.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_3.ts","targetDuration":12000,"windowSize":216000},
                    {"startTime":1473004006694,"sig":"D23DA98104552490F50597D54A42C50B","video":{"duration":10000.666666666668,"firstDTS":1473004006694,"firstEncoderDTS":41799,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004006693.578,"firstEncoderDTS":41865.57777777778,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_5.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_5.ts","targetDuration":12000,"windowSize":216000},
                    {"startTime":1473004026687,"sig":"6D9134EA67EB31695B2F639335E21F12","video":{"duration":9800.666666666666,"firstDTS":1473004026695,"firstEncoderDTS":61799,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9822.033333333333,"firstDTS":1473004026686.9556,"firstEncoderDTS":61857.955555555556,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_7.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_7.ts","targetDuration":12000,"windowSize":216000},
                    {"startTime":1473004046404,"sig":"2BE6B03FD670E14B8DD288B9BF7FBBB4","video":{"duration":10000.666666666668,"firstDTS":1473004046429,"firstEncoderDTS":81599,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004046404.3555,"firstEncoderDTS":81641.35555555555,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_9.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_9.ts","targetDuration":12000,"windowSize":216000},
                    {"startTime":1473003976809,"sig":"2425259580ED576738F77EB6824FE3AA","video":{"duration":10000.666666666668,"firstDTS":1473003976826,"firstEncoderDTS":11999,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473003976808.5,"firstEncoderDTS":11981.5,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_2.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_2.ts","targetDuration":12000,"windowSize":216000},
                    {"startTime":1473003996802,"sig":"E2994D4917BDA873D3358BC6DC15139A","video":{"duration":9866.666666666668,"firstDTS":1473003996827,"firstEncoderDTS":31999,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,3867,5867,7867]},"audio":{"duration":9891.688888888888,"firstDTS":1473003996801.8777,"firstEncoderDTS":31973.877777777776,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_4.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_4.ts","targetDuration":12000,"windowSize":216000},
                    {"startTime":1473004016655,"sig":"AEDE1DCC690CEE860C33DA0F3A91D887","video":{"duration":9999.666666666666,"firstDTS":1473004016694,"firstEncoderDTS":51866,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.022222222224,"firstDTS":1473004016654.9333,"firstEncoderDTS":51826.933333333334,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_6.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_6.ts","targetDuration":12000,"windowSize":216000},
                    {"startTime":1473004036429,"sig":"415A530B68C2AA3C2BF0EB901C1BAB80","video":{"duration":9999.666666666666,"firstDTS":1473004036429,"firstEncoderDTS":71666,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004036443,"firstEncoderDTS":71680,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_8.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_8.ts","targetDuration":12000,"windowSize":216000},
                    {"startTime":1473004056430,"sig":"62AE027797CCF2CD961F0CE36AA1A04E","video":{"duration":9999.666666666666,"firstDTS":1473004056430,"firstEncoderDTS":91666,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004056436.3777,"firstEncoderDTS":91672.37777777779,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_10.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_10.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004056430,"sig":"FE412075F2B4549573EB969DB8F6CAD0","video":{"duration":10000.666666666668,"firstDTS":1473004056430,"firstEncoderDTS":91599,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004056436.3777,"firstEncoderDTS":91672.37777777779,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_10.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_10.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004066398,"sig":"507A6C2DD1208F074CAC906B183E4ED0","video":{"duration":9866.666666666668,"firstDTS":1473004066430,"firstEncoderDTS":101599,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,5867,7867]},"audio":{"duration":9891.688888888888,"firstDTS":1473004066397.7444,"firstEncoderDTS":101633.74444444444,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_11.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_11.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004066398,"sig":"B03D9DBB5128DC753AD6274F5909A95D","video":{"duration":9866.666666666668,"firstDTS":1473004066430,"firstEncoderDTS":101666,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,5867,7867]},"audio":{"duration":9891.688888888888,"firstDTS":1473004066397.7444,"firstEncoderDTS":101633.74444444444,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_11.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_11.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004076355,"sig":"47B29EDE659C7F62562E135BC5F1A37C","video":{"duration":9999.666666666666,"firstDTS":1473004076363,"firstEncoderDTS":111533,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004076355.4443,"firstEncoderDTS":111525.44444444445,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_12.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_12.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004076355,"sig":"47B29EDE659C7F62562E135BC5F1A37C","video":{"duration":9999.666666666666,"firstDTS":1473004076363,"firstEncoderDTS":111533,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004076355.4443,"firstEncoderDTS":111525.44444444445,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_12.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_12.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004086363,"sig":"698478D1936C221FA890F9EAB667A86E","video":{"duration":9999.666666666666,"firstDTS":1473004086363,"firstEncoderDTS":121533,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.344444444445,"firstDTS":1473004086386.4666,"firstEncoderDTS":121556.46666666666,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_13.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_13.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004086317,"sig":"E505EFFA77D88FF08029081E18012195","video":{"duration":9999.666666666666,"firstDTS":1473004086363,"firstEncoderDTS":121466,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004086316.8,"firstEncoderDTS":121486.8,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_13.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_13.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004096415,"sig":"B8FEBA70C033122ECA22C0C429ECCAE8","video":{"duration":9999.666666666666,"firstDTS":1473004096430,"firstEncoderDTS":131533,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004096414.8223,"firstEncoderDTS":131517.82222222222,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_14.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_14.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004096415,"sig":"6F14E18D53927942BD1BF40DC0B59B31","video":{"duration":9999.666666666666,"firstDTS":1473004096430,"firstEncoderDTS":131466,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004096414.8223,"firstEncoderDTS":131517.82222222222,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_14.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_14.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004106363,"sig":"C2C118F5AFDFE814300B5E3432646462","video":{"duration":9799.666666666668,"firstDTS":1473004106363,"firstEncoderDTS":141533,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,1800,3800,5800,7800]},"audio":{"duration":9752.366666666667,"firstDTS":1473004106378.8445,"firstEncoderDTS":141548.84444444446,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_15.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_15.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004106363,"sig":"E91054C12D38CABFB1B9092B83DD425F","video":{"duration":9799.666666666668,"firstDTS":1473004106363,"firstEncoderDTS":141466,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,1800,3800,5800,7800]},"audio":{"duration":9752.366666666667,"firstDTS":1473004106378.8445,"firstEncoderDTS":141548.84444444446,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_15.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_15.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004116131,"sig":"60ABC40F12129009523E1D8CF1988E31","video":{"duration":9999.666666666666,"firstDTS":1473004116163,"firstEncoderDTS":151266,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004116131.2222,"firstEncoderDTS":151301.22222222225,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_16.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_16.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004116131,"sig":"2551D529B815D298FF2EBF68D1832418","video":{"duration":9999.666666666666,"firstDTS":1473004116163,"firstEncoderDTS":151333,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004116131.2222,"firstEncoderDTS":151301.22222222225,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_16.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_16.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004126162,"sig":"586649BBD2DA261506C9CFDADC7BC506","video":{"duration":9999.666666666666,"firstDTS":1473004126163,"firstEncoderDTS":161333,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004126162.2444,"firstEncoderDTS":161332.24444444446,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_17.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_17.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004126162,"sig":"3C392AB8D3038FD5151BF7378EBDD2BB","video":{"duration":9999.666666666666,"firstDTS":1473004126163,"firstEncoderDTS":161266,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004126162.2444,"firstEncoderDTS":161332.24444444446,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_17.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_17.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004136124,"sig":"FE78638C11962390A28A4F4ABC7A7BA3","video":{"duration":9866.666666666668,"firstDTS":1473004136163,"firstEncoderDTS":171333,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,7866]},"audio":{"duration":9891.7,"firstDTS":1473004136123.6,"firstEncoderDTS":171293.6,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_18.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_18.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004136124,"sig":"6E60D4248B52BA910A966913B248FED2","video":{"duration":9866.666666666668,"firstDTS":1473004136163,"firstEncoderDTS":171266,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,7867]},"audio":{"duration":9891.7,"firstDTS":1473004136123.6,"firstEncoderDTS":171293.6,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_18.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_18.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004146015,"sig":"9E502918629DF0BBB671156A88EBBBA4","video":{"duration":9999.666666666666,"firstDTS":1473004146029,"firstEncoderDTS":181133,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004146015.311,"firstEncoderDTS":181185.3111111111,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_19.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_19.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004146015,"sig":"60F40C2FD9B635E803A7769A6B928E90","video":{"duration":10000.666666666668,"firstDTS":1473004146029,"firstEncoderDTS":181199,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004146015.311,"firstEncoderDTS":181185.3111111111,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_19.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_19.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004156029,"sig":"4DA2C77EFBB9F33F5486AE81A42B82A6","video":{"duration":9999.666666666666,"firstDTS":1473004156029,"firstEncoderDTS":191133,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004156046.3223,"firstEncoderDTS":191216.32222222222,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_20.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_20.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004156029,"sig":"7212381841CB06F33F51569F061E7F8C","video":{"duration":10000.666666666668,"firstDTS":1473004156029,"firstEncoderDTS":191199,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004156046.3223,"firstEncoderDTS":191216.32222222222,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_20.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_20.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004166009,"sig":"8A61D2A867624A23380EB8117ACEA31D","video":{"duration":10000.666666666668,"firstDTS":1473004166030,"firstEncoderDTS":201199,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004166008.689,"firstEncoderDTS":201177.6888888889,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_21.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_21.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004166009,"sig":"507CCC6D0297172C7C0ED6FF03E36DF2","video":{"duration":9999.666666666666,"firstDTS":1473004166030,"firstEncoderDTS":201133,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004166008.689,"firstEncoderDTS":201177.6888888889,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_21.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_21.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004176030,"sig":"AA56E7DF6BA0C7279B200C1C4E1A9EFA","video":{"duration":9800.666666666666,"firstDTS":1473004176030,"firstEncoderDTS":211199,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,3800,5800,7800]},"audio":{"duration":9752.366666666667,"firstDTS":1473004176039.7112,"firstEncoderDTS":211208.7111111111,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_22.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_22.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004176030,"sig":"CA6C2FAE75226341EBA1C0E87326C0D9","video":{"duration":9799.666666666668,"firstDTS":1473004176030,"firstEncoderDTS":211133,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,3800,5800,7800]},"audio":{"duration":9752.366666666667,"firstDTS":1473004176039.7112,"firstEncoderDTS":211208.7111111111,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_22.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_22.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004185792,"sig":"4DB63E7C6E9FE45F1D65BED267AA9A24","video":{"duration":10000.666666666668,"firstDTS":1473004185830,"firstEncoderDTS":220999,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004185792.0889,"firstEncoderDTS":220961.0888888889,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_23.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_23.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004185792,"sig":"936D43BA2579EF09F0B174D4AB43D3A9","video":{"duration":9999.666666666666,"firstDTS":1473004185830,"firstEncoderDTS":220933,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004185792.0889,"firstEncoderDTS":220961.0888888889,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_23.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_23.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004195824,"sig":"4FD071FF392E090B2484B60BAE6C397C","video":{"duration":10000.666666666668,"firstDTS":1473004195831,"firstEncoderDTS":230999,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004195824.111,"firstEncoderDTS":230992.11111111112,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_24.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_24.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004195824,"sig":"4FD071FF392E090B2484B60BAE6C397C","video":{"duration":10000.666666666668,"firstDTS":1473004195831,"firstEncoderDTS":230999,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004195824.111,"firstEncoderDTS":230992.11111111112,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_24.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_24.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004205831,"sig":"7C83691D92525C8851838937FA417024","video":{"duration":9866.666666666668,"firstDTS":1473004205831,"firstEncoderDTS":240999,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9822.033333333333,"firstDTS":1473004205855.1333,"firstEncoderDTS":241023.13333333333,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_25.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_25.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004205785,"sig":"C319812D5BB2096620BEB922B729089F","video":{"duration":9866.666666666668,"firstDTS":1473004205831,"firstEncoderDTS":240933,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9891.7,"firstDTS":1473004205785.4666,"firstEncoderDTS":240953.46666666665,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_25.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_25.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004215677,"sig":"8A58EC99035284158E47CD6BDD3FD934","video":{"duration":9999.666666666666,"firstDTS":1473004215698,"firstEncoderDTS":250866,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004215677.1667,"firstEncoderDTS":250845.16666666666,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_26.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_26.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004215677,"sig":"8A58EC99035284158E47CD6BDD3FD934","video":{"duration":9999.666666666666,"firstDTS":1473004215698,"firstEncoderDTS":250866,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004215677.1667,"firstEncoderDTS":250845.16666666666,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_26.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_26.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004225698,"sig":"299504D50B75E8DA5CE3762FF7BEA97C","video":{"duration":9999.666666666666,"firstDTS":1473004225698,"firstEncoderDTS":260866,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004225708.189,"firstEncoderDTS":260876.18888888886,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_27.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_27.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004225698,"sig":"299504D50B75E8DA5CE3762FF7BEA97C","video":{"duration":9999.666666666666,"firstDTS":1473004225698,"firstEncoderDTS":260866,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004225708.189,"firstEncoderDTS":260876.18888888886,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_27.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_27.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004235670,"sig":"82671CD3FAC7F91926AA8DF87881FF5D","video":{"duration":9999.666666666666,"firstDTS":1473004235698,"firstEncoderDTS":270866,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004235669.5557,"firstEncoderDTS":270837.55555555556,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_28.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_28.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004235670,"sig":"BF0950347DE56D879956F319D2487FA9","video":{"duration":10000.666666666668,"firstDTS":1473004235698,"firstEncoderDTS":270799,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004235669.5557,"firstEncoderDTS":270837.55555555556,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_28.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_28.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004245699,"sig":"A45FA676C79377566A913971E3FBF6B1","video":{"duration":9799.666666666668,"firstDTS":1473004245699,"firstEncoderDTS":280866,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,5800,7800]},"audio":{"duration":9752.377777777778,"firstDTS":1473004245701.5667,"firstEncoderDTS":280868.56666666665,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_29.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_29.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004245699,"sig":"A45FA676C79377566A913971E3FBF6B1","video":{"duration":9799.666666666668,"firstDTS":1473004245699,"firstEncoderDTS":280866,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,5800,7800]},"audio":{"duration":9752.377777777778,"firstDTS":1473004245701.5667,"firstEncoderDTS":280868.56666666665,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_29.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_29.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004255454,"sig":"B3B76614C011E65F8293CC1EC3DEB48B","video":{"duration":9999.666666666666,"firstDTS":1473004255499,"firstEncoderDTS":290666,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004255453.9556,"firstEncoderDTS":290620.9555555555,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_30.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_30.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004255454,"sig":"0D481EE1E23AA609284F1F44789205DC","video":{"duration":10000.666666666668,"firstDTS":1473004255499,"firstEncoderDTS":290599,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004255453.9556,"firstEncoderDTS":290620.9555555555,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_30.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_30.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004265485,"sig":"82CF1F2AFDF923A23FD40B97EEC43C89","video":{"duration":9999.666666666666,"firstDTS":1473004265499,"firstEncoderDTS":300666,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004265484.9778,"firstEncoderDTS":300651.9777777778,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_31.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_31.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004265485,"sig":"82CF1F2AFDF923A23FD40B97EEC43C89","video":{"duration":9999.666666666666,"firstDTS":1473004265499,"firstEncoderDTS":300666,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004265484.9778,"firstEncoderDTS":300651.9777777778,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_31.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_31.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004275500,"sig":"CD46E4CFE68530CAECCBC08D127F45BC","video":{"duration":9999.666666666666,"firstDTS":1473004275500,"firstEncoderDTS":310666,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004275516.9888,"firstEncoderDTS":310682.98888888885,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_32.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_32.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004275500,"sig":"CD46E4CFE68530CAECCBC08D127F45BC","video":{"duration":9999.666666666666,"firstDTS":1473004275500,"firstEncoderDTS":310666,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004275516.9888,"firstEncoderDTS":310682.98888888885,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_32.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_32.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004285478,"sig":"1A3B9BD67C6D3FFB3BB0345894163C5F","video":{"duration":9866.666666666668,"firstDTS":1473004285500,"firstEncoderDTS":320666,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,1867,3867,5867,7867]},"audio":{"duration":9891.688888888888,"firstDTS":1473004285478.3555,"firstEncoderDTS":320644.35555555555,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_33.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_33.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004285478,"sig":"1A3B9BD67C6D3FFB3BB0345894163C5F","video":{"duration":9866.666666666668,"firstDTS":1473004285500,"firstEncoderDTS":320666,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,1867,3867,5867,7867]},"audio":{"duration":9891.688888888888,"firstDTS":1473004285478.3555,"firstEncoderDTS":320644.35555555555,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_33.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_33.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004295367,"sig":"35C6EA1431C8C537428BD3F7000B17C7","video":{"duration":9999.666666666666,"firstDTS":1473004295367,"firstEncoderDTS":330533,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,3999,5999,7999]},"audio":{"duration":9961.355555555556,"firstDTS":1473004295370.0557,"firstEncoderDTS":330536.05555555556,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_34.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_34.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004295367,"sig":"35C6EA1431C8C537428BD3F7000B17C7","video":{"duration":9999.666666666666,"firstDTS":1473004295367,"firstEncoderDTS":330533,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,3999,5999,7999]},"audio":{"duration":9961.355555555556,"firstDTS":1473004295370.0557,"firstEncoderDTS":330536.05555555556,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_34.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_34.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004305333,"sig":"B8DCDA87DE4F726BD247E7C84ABDDBC6","video":{"duration":10000.666666666668,"firstDTS":1473004305368,"firstEncoderDTS":340532,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004305333.4111,"firstEncoderDTS":340497.4111111111,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_35.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_35.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004305333,"sig":"B8DCDA87DE4F726BD247E7C84ABDDBC6","video":{"duration":10000.666666666668,"firstDTS":1473004305368,"firstEncoderDTS":340532,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004305333.4111,"firstEncoderDTS":340497.4111111111,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_35.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_35.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004315364,"sig":"885CBDA698183F546CFDFE1F33DB0637","video":{"duration":9800.666666666666,"firstDTS":1473004315368,"firstEncoderDTS":350532,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,7800]},"audio":{"duration":9822.033333333333,"firstDTS":1473004315364.4333,"firstEncoderDTS":350528.43333333335,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_36.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_36.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004315364,"sig":"885CBDA698183F546CFDFE1F33DB0637","video":{"duration":9800.666666666666,"firstDTS":1473004315368,"firstEncoderDTS":350532,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,7800]},"audio":{"duration":9822.033333333333,"firstDTS":1473004315364.4333,"firstEncoderDTS":350528.43333333335,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_36.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_36.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004325102,"sig":"47E5C418F8D4295553AC84CBA175EDEF","video":{"duration":10000.666666666668,"firstDTS":1473004325102,"firstEncoderDTS":360332,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004325120.4778,"firstEncoderDTS":360350.47777777776,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_37.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_37.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004325102,"sig":"7DE0EEDA32B461E9894CF4B4705D66F4","video":{"duration":9999.666666666666,"firstDTS":1473004325102,"firstEncoderDTS":360266,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004325120.4778,"firstEncoderDTS":360350.47777777776,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_37.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_37.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004335082,"sig":"56E213A7C3575D2F4533D5980EBA8503","video":{"duration":10000.666666666668,"firstDTS":1473004335102,"firstEncoderDTS":370332,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004335081.8333,"firstEncoderDTS":370311.8333333333,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_38.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_38.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004335082,"sig":"56E213A7C3575D2F4533D5980EBA8503","video":{"duration":10000.666666666668,"firstDTS":1473004335102,"firstEncoderDTS":370332,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004335081.8333,"firstEncoderDTS":370311.8333333333,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_38.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_38.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004345102,"sig":"384FACCB89C4FCBF040DD53E47A6FBAC","video":{"duration":10000.666666666668,"firstDTS":1473004345102,"firstEncoderDTS":380332,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004345112.8555,"firstEncoderDTS":380342.85555555555,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_39.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_39.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004345102,"sig":"384FACCB89C4FCBF040DD53E47A6FBAC","video":{"duration":10000.666666666668,"firstDTS":1473004345102,"firstEncoderDTS":380332,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004345112.8555,"firstEncoderDTS":380342.85555555555,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_39.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_39.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004355142,"sig":"A2D464A7A9E92862AD67D02102F31BA3","video":{"duration":9866.666666666668,"firstDTS":1473004355170,"firstEncoderDTS":390332,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,3867,5867,7867]},"audio":{"duration":9891.688888888888,"firstDTS":1473004355142.2222,"firstEncoderDTS":390304.22222222225,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_40.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_40.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004355142,"sig":"A2D464A7A9E92862AD67D02102F31BA3","video":{"duration":9866.666666666668,"firstDTS":1473004355170,"firstEncoderDTS":390332,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,3867,5867,7867]},"audio":{"duration":9891.688888888888,"firstDTS":1473004355142.2222,"firstEncoderDTS":390304.22222222225,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_40.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_40.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004364967,"sig":"70246A7BFB6A8D13B4F1BB1B0EFC625B","video":{"duration":9999.666666666666,"firstDTS":1473004364970,"firstEncoderDTS":400199,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.344444444445,"firstDTS":1473004364966.922,"firstEncoderDTS":400195.92222222226,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_41.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_41.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004364967,"sig":"F87A1712B7870EEFBFB3E1E80F8844A5","video":{"duration":10000.666666666668,"firstDTS":1473004364970,"firstEncoderDTS":400132,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.344444444445,"firstDTS":1473004364966.922,"firstEncoderDTS":400195.92222222226,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_41.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_41.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004374928,"sig":"2C624B36F5C2DD3348F76AC4305917A3","video":{"duration":9999.666666666666,"firstDTS":1473004374970,"firstEncoderDTS":410199,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004374928.2778,"firstEncoderDTS":410157.27777777775,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_42.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_42.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004374928,"sig":"9E60499DD9401B5050F3BCCF79DC4573","video":{"duration":10000.666666666668,"firstDTS":1473004374970,"firstEncoderDTS":410132,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004374928.2778,"firstEncoderDTS":410157.27777777775,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_42.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_42.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004384960,"sig":"F4F1729EC0B27C852A5EE5E6C8C7A39B","video":{"duration":11800.666666666666,"firstDTS":1473004384971,"firstEncoderDTS":420132,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000,9800]},"audio":{"duration":11772.511111111111,"firstDTS":1473004384960.3,"firstEncoderDTS":420188.30000000005,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_43.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_43.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004384960,"sig":"9CC80EC9AB4E2E624E57C019DD619263","video":{"duration":11799.666666666668,"firstDTS":1473004384971,"firstEncoderDTS":420199,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000,9800]},"audio":{"duration":11772.511111111111,"firstDTS":1473004384960.3,"firstEncoderDTS":420188.30000000005,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_43.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_43.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004396733,"sig":"1050E641FF3AF83D625A66C5AE734634","video":{"duration":9999.666666666666,"firstDTS":1473004396771,"firstEncoderDTS":431999,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.022222222224,"firstDTS":1473004396732.811,"firstEncoderDTS":431960.81111111114,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_44.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_44.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004396733,"sig":"1050E641FF3AF83D625A66C5AE734634","video":{"duration":9999.666666666666,"firstDTS":1473004396771,"firstEncoderDTS":431999,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.022222222224,"firstDTS":1473004396732.811,"firstEncoderDTS":431960.81111111114,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_44.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_44.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004406764,"sig":"88E308B2FED02F2C308FCBDE19D2F57A","video":{"duration":9999.666666666666,"firstDTS":1473004406771,"firstEncoderDTS":441999,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004406763.8333,"firstEncoderDTS":441991.8333333333,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_45.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_45.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004406764,"sig":"88E308B2FED02F2C308FCBDE19D2F57A","video":{"duration":9999.666666666666,"firstDTS":1473004406771,"firstEncoderDTS":441999,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004406763.8333,"firstEncoderDTS":441991.8333333333,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_45.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_45.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004416772,"sig":"5153D5158233F7D9BE7D929382F011EA","video":{"duration":9999.666666666666,"firstDTS":1473004416772,"firstEncoderDTS":451999,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004416795.8555,"firstEncoderDTS":452022.85555555555,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_46.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_46.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004416772,"sig":"5153D5158233F7D9BE7D929382F011EA","video":{"duration":9999.666666666666,"firstDTS":1473004416772,"firstEncoderDTS":451999,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004416795.8555,"firstEncoderDTS":452022.85555555555,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_46.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_46.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004426757,"sig":"5BCBCFE2DC246B9F24FE0B09EAE54D29","video":{"duration":9866.666666666668,"firstDTS":1473004426772,"firstEncoderDTS":461999,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,3867,5867,7867]},"audio":{"duration":9891.688888888888,"firstDTS":1473004426757.2222,"firstEncoderDTS":461984.22222222225,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_47.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_47.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004426757,"sig":"5BCBCFE2DC246B9F24FE0B09EAE54D29","video":{"duration":9866.666666666668,"firstDTS":1473004426772,"firstEncoderDTS":461999,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,3867,5867,7867]},"audio":{"duration":9891.688888888888,"firstDTS":1473004426757.2222,"firstEncoderDTS":461984.22222222225,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_47.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_47.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004436640,"sig":"8CAB33BCDB17EB46FF06A2E49333597C","video":{"duration":9999.666666666666,"firstDTS":1473004436640,"firstEncoderDTS":471866,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.344444444445,"firstDTS":1473004436649.922,"firstEncoderDTS":471875.92222222226,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_48.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_48.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004436640,"sig":"CE5BE5309EC4C2DA7A6DE1C88E8BCAAC","video":{"duration":9999.666666666666,"firstDTS":1473004436640,"firstEncoderDTS":471799,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.344444444445,"firstDTS":1473004436649.922,"firstEncoderDTS":471875.92222222226,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_48.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_48.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004446611,"sig":"404DECD59B384EE4D1019471769822F5","video":{"duration":9999.666666666666,"firstDTS":1473004446640,"firstEncoderDTS":481866,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004446611.2778,"firstEncoderDTS":481837.2777777778,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_49.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_49.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004446611,"sig":"404DECD59B384EE4D1019471769822F5","video":{"duration":9999.666666666666,"firstDTS":1473004446640,"firstEncoderDTS":481866,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004446611.2778,"firstEncoderDTS":481837.2777777778,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_49.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_49.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004456640,"sig":"7C7BE2339EDA0F935DE7C848B428D064","video":{"duration":9866.666666666668,"firstDTS":1473004456640,"firstEncoderDTS":491866,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9822.033333333333,"firstDTS":1473004456642.3,"firstEncoderDTS":491868.3,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_50.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_50.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004456640,"sig":"25FFE30FDBB1B5103B301844E8BA7808","video":{"duration":9866.666666666668,"firstDTS":1473004456640,"firstEncoderDTS":491799,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9822.033333333333,"firstDTS":1473004456642.3,"firstEncoderDTS":491868.3,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_50.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_50.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004466398,"sig":"BD1BDFA2AA719B60B1BD663860C29549","video":{"duration":10000.666666666668,"firstDTS":1473004466440,"firstEncoderDTS":501732,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004466398.3445,"firstEncoderDTS":501690.34444444446,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_51.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_51.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004466398,"sig":"BD1BDFA2AA719B60B1BD663860C29549","video":{"duration":10000.666666666668,"firstDTS":1473004466440,"firstEncoderDTS":501732,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004466398.3445,"firstEncoderDTS":501690.34444444446,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_51.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_51.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004476429,"sig":"459D7CBA2E7661DD77F86D0A8C02DAC4","video":{"duration":10000.666666666668,"firstDTS":1473004476440,"firstEncoderDTS":511732,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004476429.3555,"firstEncoderDTS":511721.35555555555,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_52.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_52.ts","targetDuration":12000,"windowSize":240000}, {"startTime":1473004476429,"sig":"459D7CBA2E7661DD77F86D0A8C02DAC4","video":{"duration":10000.666666666668,"firstDTS":1473004476440,"firstEncoderDTS":511732,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004476429.3555,"firstEncoderDTS":511721.35555555555,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_52.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_52.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004486440,"sig":"F7D2F6F7D8873A452E93CAFFB4BD21FD","video":{"duration":10000.666666666668,"firstDTS":1473004486440,"firstEncoderDTS":521732,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004486460.3777,"firstEncoderDTS":521752.3777777777,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_53.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_53.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004486440,"sig":"F7D2F6F7D8873A452E93CAFFB4BD21FD","video":{"duration":10000.666666666668,"firstDTS":1473004486440,"firstEncoderDTS":521732,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004486460.3777,"firstEncoderDTS":521752.3777777777,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_53.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_53.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004496422,"sig":"35BE4C909365FDBB38F596B34B40488B","video":{"duration":9800.666666666666,"firstDTS":1473004496440,"firstEncoderDTS":531732,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,5800,7800]},"audio":{"duration":9822.033333333333,"firstDTS":1473004496421.7444,"firstEncoderDTS":531713.7444444445,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_54.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_54.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004496422,"sig":"86C05F38DDFEADFD2AC2C5A4B02E0A9A","video":{"duration":9799.666666666668,"firstDTS":1473004496440,"firstEncoderDTS":531666,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,5800,7800]},"audio":{"duration":9822.033333333333,"firstDTS":1473004496421.7444,"firstEncoderDTS":531713.7444444445,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_54.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_54.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004506307,"sig":"C50C5F7138F62325DD522A2BFCE215FE","video":{"duration":10000.666666666668,"firstDTS":1473004506307,"firstEncoderDTS":541532,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004506310.7778,"firstEncoderDTS":541535.7777777778,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_55.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_55.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004506307,"sig":"A92271E794F854C183180D9A69864718","video":{"duration":9999.666666666666,"firstDTS":1473004506307,"firstEncoderDTS":541466,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004506310.7778,"firstEncoderDTS":541535.7777777778,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_55.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_55.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004516273,"sig":"A66AF208CCC3B2B766402B65461A4740","video":{"duration":9999.666666666666,"firstDTS":1473004516308,"firstEncoderDTS":551466,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004516273.1445,"firstEncoderDTS":551497.1444444444,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_56.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_56.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004516273,"sig":"961FEE4A76AC3D91E1BDFFC776DA4108","video":{"duration":10000.666666666668,"firstDTS":1473004516308,"firstEncoderDTS":551532,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004516273.1445,"firstEncoderDTS":551497.1444444444,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_56.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_56.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004526304,"sig":"643B141DDF76EE0C2C48611B62EEE971","video":{"duration":10000.666666666668,"firstDTS":1473004526308,"firstEncoderDTS":561532,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.344444444445,"firstDTS":1473004526304.1667,"firstEncoderDTS":561528.1666666667,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_57.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_57.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004526304,"sig":"C1112FB7CD6369D6408E418175E82EDC","video":{"duration":9999.666666666666,"firstDTS":1473004526308,"firstEncoderDTS":561466,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.344444444445,"firstDTS":1473004526304.1667,"firstEncoderDTS":561528.1666666667,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_57.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_57.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004536267,"sig":"34BB757B0C22C1195B24DE981ACDF972","video":{"duration":9866.666666666668,"firstDTS":1473004536309,"firstEncoderDTS":571532,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,1867,3867,5867,7867]},"audio":{"duration":9891.688888888888,"firstDTS":1473004536266.5222,"firstEncoderDTS":571489.5222222223,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_58.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_58.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004536267,"sig":"34BB757B0C22C1195B24DE981ACDF972","video":{"duration":9866.666666666668,"firstDTS":1473004536309,"firstEncoderDTS":571532,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,1867,3867,5867,7867]},"audio":{"duration":9891.688888888888,"firstDTS":1473004536266.5222,"firstEncoderDTS":571489.5222222223,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_58.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_58.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004546158,"sig":"1FC78B9EC3000750532D110E8ECE7DBF","video":{"duration":10000.666666666668,"firstDTS":1473004546176,"firstEncoderDTS":581332,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004546158.2222,"firstEncoderDTS":581381.2222222222,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_59.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_59.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004546158,"sig":"F44D334EB8E3BDD01D7934220BB2898E","video":{"duration":9999.666666666666,"firstDTS":1473004546176,"firstEncoderDTS":581399,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031.011111111111,"firstDTS":1473004546158.2222,"firstEncoderDTS":581381.2222222222,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_59.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_59.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004556176,"sig":"8047F2EF5CC431C762F72BDE65930853","video":{"duration":9999.666666666666,"firstDTS":1473004556176,"firstEncoderDTS":591399,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004556189.2444,"firstEncoderDTS":591412.2444444444,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_60.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_60.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004556176,"sig":"8047F2EF5CC431C762F72BDE65930853","video":{"duration":9999.666666666666,"firstDTS":1473004556176,"firstEncoderDTS":591399,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004556189.2444,"firstEncoderDTS":591412.2444444444,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_60.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_60.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004566152,"sig":"288F37BD2DA1573B2234A49C3545D89D","video":{"duration":9799.666666666668,"firstDTS":1473004566177,"firstEncoderDTS":601399,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,7800]},"audio":{"duration":9822.033333333333,"firstDTS":1473004566151.6,"firstEncoderDTS":601373.6,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_61.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_61.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004566152,"sig":"288F37BD2DA1573B2234A49C3545D89D","video":{"duration":9799.666666666668,"firstDTS":1473004566177,"firstEncoderDTS":601399,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,7800]},"audio":{"duration":9822.033333333333,"firstDTS":1473004566151.6,"firstEncoderDTS":601373.6,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_61.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_61.ts","targetDuration":12000,"windowSize":240000},
                    {"startTime":1473004597930,"sig":"63B31F0DA42814B34EC696D67E076E3A","video":{"duration":7999.666666666666,"firstDTS":1473004597948,"firstEncoderDTS":633199,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000]},"audio":{"duration":8010.877777777777,"firstDTS":1473004597930,"firstEncoderDTS":633181,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_63.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_63.ts","targetDuration":12000,"windowSize":24000},
                    {"startTime":1473004597930,"sig":"6BE7C7961731B673FB6BC25AB741B18C","video":{"duration":8000.666666666668,"firstDTS":1473004597948,"firstEncoderDTS":633132,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000]},"audio":{"duration":8010.877777777777,"firstDTS":1473004597930,"firstEncoderDTS":633181,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_63.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_63.ts","targetDuration":12000,"windowSize":24000},
                    {"startTime":1473004605941,"sig":"0E612D0E6520052A5EFA544164B746B6","video":{"duration":9866.666666666668,"firstDTS":1473004605948,"firstEncoderDTS":641199,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,3867,5867,7867]},"audio":{"duration":9891.7,"firstDTS":1473004605940.8777,"firstEncoderDTS":641191.8777777778,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_64.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_64.ts","targetDuration":12000,"windowSize":48000},
                    {"startTime":1473004605941,"sig":"722854DF0A179ADB5DCE8C2674A28D88","video":{"duration":9866.666666666668,"firstDTS":1473004605948,"firstEncoderDTS":641132,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,3867,5867,7867]},"audio":{"duration":9891.7,"firstDTS":1473004605940.8777,"firstEncoderDTS":641191.8777777778,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_64.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_64.ts","targetDuration":12000,"windowSize":48000},
                    {"startTime":1473004615815,"sig":"DD1FB45B8F528B7771ED791AD14610F6","video":{"duration":9999.666666666666,"firstDTS":1473004615815,"firstEncoderDTS":651066,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004615832.578,"firstEncoderDTS":651083.5777777778,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_65.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_65.ts","targetDuration":12000,"windowSize":72000},
                    {"startTime":1473004615815,"sig":"473B678E7CF38A5406E2B35648170CA7","video":{"duration":9999.666666666666,"firstDTS":1473004615815,"firstEncoderDTS":650999,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004615832.578,"firstEncoderDTS":651083.5777777778,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/32/16/media-uixqcuga0_65.ts.mp4","flavor":"32","chunkName":"media-uixqcuga0_65.ts","targetDuration":12000,"windowSize":72000},
                    {"startTime":1473004625795,"sig":"AB6DF8E638B19D121FA91675BFFA8A16","video":{"duration":9999.666666666666,"firstDTS":1473004625816,"firstEncoderDTS":661066,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,5999,7999]},"audio":{"duration":10031.011111111111,"firstDTS":1473004625794.9443,"firstEncoderDTS":661044.9444444445,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_66.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_66.ts","targetDuration":12000,"windowSize":96000},
                    {"startTime":1473004625795,"sig":"AB6DF8E638B19D121FA91675BFFA8A16","video":{"duration":9999.666666666666,"firstDTS":1473004625816,"firstEncoderDTS":661066,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,5999,7999]},"audio":{"duration":10031.011111111111,"firstDTS":1473004625794.9443,"firstEncoderDTS":661044.9444444445,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/35/16/media-umd70h2ub_66.ts.mp4","flavor":"35","chunkName":"media-umd70h2ub_66.ts","targetDuration":12000,"windowSize":96000},
                    {"startTime":1473004635815,"sig":"CB35291DB8BFF52A6D8D1BB1B0FCA749","video":{"duration":9800.666666666666,"firstDTS":1473004635815,"firstEncoderDTS":671065,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9752.366666666667,"firstDTS":1473004635825.9666,"firstEncoderDTS":671075.9666666667,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_67.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_67.ts","targetDuration":12000,"windowSize":120000},
                    {"startTime":1473004635815,"sig":"CB35291DB8BFF52A6D8D1BB1B0FCA749","video":{"duration":9800.666666666666,"firstDTS":1473004635815,"firstEncoderDTS":671065,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9752.366666666667,"firstDTS":1473004635825.9666,"firstEncoderDTS":671075.9666666667,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_67.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_67.ts","targetDuration":12000,"windowSize":120000},
                    {"startTime":1473004645578,"sig":"C1F6F716BC53503CB09D3E0D437346CB","video":{"duration":10000.666666666668,"firstDTS":1473004645615,"firstEncoderDTS":680865,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031,"firstDTS":1473004645578.3445,"firstEncoderDTS":680828.3444444445,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_68.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_68.ts","targetDuration":12000,"windowSize":144000},
                    {"startTime":1473004645578,"sig":"C1F6F716BC53503CB09D3E0D437346CB","video":{"duration":10000.666666666668,"firstDTS":1473004645615,"firstEncoderDTS":680865,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":10031,"firstDTS":1473004645578.3445,"firstEncoderDTS":680828.3444444445,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_68.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_68.ts","targetDuration":12000,"windowSize":144000},
                    {"startTime":1473004655609,"sig":"8134343774429C62581EAFE74FCF1DDF","video":{"duration":10000.666666666668,"firstDTS":1473004655615,"firstEncoderDTS":690865,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004655609.3667,"firstEncoderDTS":690859.3666666667,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/34/16/media-ugpt23tid_69.ts.mp4","flavor":"34","chunkName":"media-ugpt23tid_69.ts","targetDuration":12000,"windowSize":168000},
                    {"startTime":1473004655609,"sig":"8134343774429C62581EAFE74FCF1DDF","video":{"duration":10000.666666666668,"firstDTS":1473004655615,"firstEncoderDTS":690865,"wrapEncoderDTS":95443718,"keyFrameDTS":[0,2000,4000,6000,8000]},"audio":{"duration":9961.355555555556,"firstDTS":1473004655609.3667,"firstEncoderDTS":690859.3666666667,"wrapEncoderDTS":95443718,"keyFrameDTS":[]},"path":"/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_69.ts.mp4","flavor":"33","chunkName":"media-utwd28xfu_69.ts","targetDuration":12000,"windowSize":168000}


                ];


                updatePlaylist(plGen,dataArr ).then(function (obj) {
                    expect(_.every(obj.durations,function(d){
                        return d > 0;
                    })).to.eql(true);

                    expect(_.every(obj.sequences,function(s){
                        return _.every(s.clips,function(c){
                            return _.every(c.sources,function(src){
                                return src.paths.length > 0;
                            });
                        });
                    })).to.eql(true);

                    validatePlaylistGen(plGen,done);
                }).catch(function (err) {
                    done(err);
                });
            });
        });

        var createClipArray = function(template, gapSize, batchSize)
        {
            let fi = offsetFileInfo(template, gapSize);
            return batchAppend(fi, batchSize);
        };

        it('should limit clips to maximum allowed per flavor', function (done) {
            let plGen
            createPlaylistGenerator(7200000)
                .then((pgen) => {
                    plGen = pgen
                    let fi = {
                        startTime: 1473003986826,
                        sig: "8E33A02D818CFFFD306A6EA5B877FFA9",
                        video: {
                            duration: 10000.666666666668,
                            firstDTS: 1473003986826,
                            firstEncoderDTS: 21999,
                            wrapEncoderDTS: 95443718,
                            keyFrameDTS: [0, 2000, 4000, 6000, 8000]
                        },
                        audio: {
                            duration: 9961.344444444445,
                            firstDTS: 1473003986839.5222,
                            firstEncoderDTS: 22012.522222222222,
                            wrapEncoderDTS: 95443718,
                            keyFrameDTS: []
                        },
                        path: '/Users/igors/kLive_content/live/0_0tqdn8vw/33/16/media-utwd28xfu_3.ts.mp4',
                        flavor: "33",
                        chunkName: "media-utwd28xfu_3.ts",
                        targetDuration: 12000,
                        windowSize: 216000
                    };
                    var clips = [fi];
                    return _.reduce(new Array(200), (promise) => {
                        return promise.then(() => {
                            clips = createClipArray(clips.last, 30000, 10);
                            return updatePlaylist(plGen, clips);
                        });
                    }, Q.resolve());
                })
                .then((playlist) => {
                    console.log(`number of clips: ${playlist.sequences[0].clips.length}, max allowed: ${Number(maxClipsPerFlavor) + 1}`);
                    expect(playlist.sequences[0].clips.length < (1 + maxClipsPerFlavor));
                    validatePlaylistGen(plGen,done);
                })
                .catch(function (err) {
                    console.log(`failed with error: ${err.message}, stack: ${err.stack}`);
                    done(err);
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
                    wrapEncoderDTS: 95443718,
                    keyFrameDTS: [0, 2000, 4000, 8000, 10000, 12000, 14000]
                },
                path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
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
                    expect(obj.durations[0]).to.at.most(plGen.actualWindowSize + fi.video.duration);
                    validatePlaylistGen(plGen,done);
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
                        wrapEncoderDTS: 95443718,
                        keyFrameDTS: [0,2000,4000,8000,10000,12000,14000]
                    },
                    path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
                    flavor: "32"
                };

                var bad = offsetFileInfo(fis, fis.video.duration);
                //scramble firstDTS
                bad.video.firstDTS -= 10000000;

                updatePlaylist(plGen, [fis, bad]).then(function (obj) {
                    expect(obj.durations.length).eql(1);
                    validatePlaylistGen(plGen,done);
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
                        wrapEncoderDTS: 95443718,
                        keyFrameDTS: [0,2000,4000,8000,10000,12000,14000]
                    },
                    path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
                    flavor: "32",
                    chunkName:"/16/media-u774d8hoj_w20128143_1.mp4"
                };

                var bad = offsetFileInfo(fis, 60000);
                //scramble firstDTS
                bad.startTime = bad.video.firstDTS = 0;

                var good = offsetFileInfo(fis, 60000 + bad.video.duration);

                updatePlaylist(plGen, [fis, bad, good]).then(function (result) {
                    expect(result.durations.length).eql(2);
                    expect(result.clipTimes[1]).to.be.within(good.video.firstDTS - 1, good.video.firstDTS + 1);
                    validatePlaylistGen(plGen,done);
                }).catch(function (err) {
                    done(err);
                });
            });
        });


        it('should reject item with overlapping time range', function (done) {
            createPlaylistGenerator().then(function (plGen) {
                var fi = {
                    startTime: 1459270805911,
                    sig: 'C53429E60F33B192FD124A2CC22C8717',
                    video: {
                        duration: 16224.699999999999,
                        firstDTS: 1459270805911,
                        firstEncoderDTS: 83,
                        wrapEncoderDTS: 95443718,
                        keyFrameDTS: [0,2000,4000,8000,10000,12000,14000]
                    },
                    path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
                    flavor: "32"
                }, overlap = offsetFileInfo(fi,-1000);

                plGen.on('diagnosticsAlert',(alert) => {
                    const diagnosticAlerts = require('./../../lib/Diagnostics/DiagnosticsAlerts');
                    expect(alert).to.be.instanceof(diagnosticAlerts.OverlapPtsAlert);
                    expect(alert.args.ptsHigh).to.be.eql(Math.ceil(fi.video.firstDTS+fi.video.duration));
                    expect(alert.args.ptsNew).to.be.eql(Math.ceil(overlap.video.firstDTS));
                });

                updatePlaylist(plGen, [fi, overlap]).then(function (result) {
                    expect(sum(result.durations)).to.eql(Math.ceil(fi.video.duration));
                    expect(result.sequences[0].clips[0].sources[0].paths.length).to.eql(1);
                    validatePlaylistGen(plGen,done);
                }).catch(function (err) {
                    done(err);
                });
            });
        });

        it('should reject (video) item without key frames', function (done) {
            createPlaylistGenerator().then(function (plGen) {

                var fi = {
                    startTime: 1459270805911,
                    sig: 'C53429E60F33B192FD124A2CC22C8717',
                    video: {
                        duration: 16224.699999999999,
                        firstDTS: 1459270805911,
                        firstEncoderDTS: 83,
                        wrapEncoderDTS: 95443718,
                        keyFrameDTS: []
                    },
                    path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
                    flavor: "32"
                };

                plGen.on('diagnosticsAlert',(alert) => {
                    const diagnosticAlerts = require('./../../lib/Diagnostics/DiagnosticsAlerts');
                    expect(alert).to.be.instanceof(diagnosticAlerts.InvalidKeyFramesAlert);
                });

                updatePlaylist(plGen, [fi]).then(function (result) {
                    expect(sum(result.durations)).to.eql(0);
                    validatePlaylistGen(plGen,done);
                }).catch(function (err) {
                    done(err);
                });
            });
        });

        it('should reject first item without absolute timestamp', function (done) {
            createPlaylistGenerator().then(function (plGen) {

                var fi = {
                    startTime: 0,
                    sig: 'C53429E60F33B192FD124A2CC22C8717',
                    video: {
                        duration: 16224.699999999999,
                        firstDTS: 0,
                        firstEncoderDTS: 83,
                        wrapEncoderDTS: 95443718,
                        keyFrameDTS: [0,4000]
                    },
                    path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
                    flavor: "32"
                };

                plGen.on('diagnosticsAlert',(alert) => {
                    const diagnosticAlerts = require('./../../lib/Diagnostics/DiagnosticsAlerts');
                    expect(alert).to.be.instanceof(diagnosticAlerts.NoID3TagAlert);
                });

                updatePlaylist(plGen, [fi]).then(function (result) {
                    expect(sum(result.durations)).to.eql(0);
                    validatePlaylistGen(plGen,done);
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
                        wrapEncoderDTS: 95443718,
                        keyFrameDTS: [0,2000,4000,8000,10000,12000,14000]
                    },
                    path: '/var/tmp/1_abc123/2/16/media-u774d8hoj_w20128143_1.mp4',
                    flavor: "32"
                }, duplicate = offsetFileInfo(fi);

                duplicate.path = fi.path;

                updatePlaylist(plGen, [fi, duplicate]).then(function (result) {
                    expect(result.durations[0]).to.eql(Math.ceil(fi.video.duration));
                    expect(result.sequences[0].clips[0].sources[0].paths.length).to.eql(1);
                    validatePlaylistGen(plGen,done);
                }).catch(function (err) {
                    done(err);
                });
            });
        });
    });

});
