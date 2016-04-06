/**
 * Created by igors on 3/30/16.
 */
var PlaylistUtils = require('./../../lib/utils/playlist-utils');
var config = require('./../../common/Configuration');
var MP4WriteStream=require('./../../lib/MP4WriteStream');
var logger = require('./../../lib/logger/logger')(module);
var path = require('path');
var Q = require('q');
var fs = require('fs');
var util = require('util');
var PackagerPlayList = require('./../../lib/manifest/PlaylistGenerator');

config.set('preserveOriginalChunk',false);

var stdDevTest = function() {
    var stats = new PlaylistUtils.Stats(1000);

    for (var i = 0; i < 10000; i++) {
        var r = Math.random() * 100 * (i % 2 ? 1 : -1);

        stats.addSample(r);

        console.log("adding value %d stddev=%d avg=%d", r.toFixed(3), stats.stdDev.toFixed(3), stats.avg.toFixed(3));
    }

    console.log("stdev=%d avg=%d", stats.stdDev.toFixed(3), stats.avg.toFixed(3));

    stats.addSample(1000000);

    console.log("stdev=%d avg=%d", stats.stdDev.toFixed(3), stats.avg.toFixed(3));
};

var mp4FilesPath = __dirname + '/../../node_addons/FormatConverter/resources/mp4/';

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
        path: mp4FilesPath +'media-u774d8hoj_w20128143_1.mp4' },
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
        path: mp4FilesPath +'media-u774d8hoj_w20128143_2.mp4' },
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
        path: mp4FilesPath +'media-u774d8hoj_w20128143_3.mp4' },
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
        path: mp4FilesPath +'media-u774d8hoj_w20128143_4.mp4' },
    { startTime: 1459270852949,
        sig: 'AC251ED8D03B5E388ECAF27B7AC870DA',
        video:
        { duration: 10426.7,
            firstDTS: 1459270852962,
            firstEncoderDTS: 46797,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 10389.333333333334,
            firstDTS: 1459270852949,
            firstEncoderDTS: 46784,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_5.mp4' },
    { startTime: 1459270863463,
        sig: 'C7C7A08DE228D0024FA1E24412CD4E70',
        video:
        { duration: 10385.7,
            firstDTS: 1459270863471,
            firstEncoderDTS: 57224,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 10325.333333333332,
            firstDTS: 1459270863463,
            firstEncoderDTS: 57216,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_6.mp4' },
    { startTime: 1459270873580,
        sig: 'FA2AB633B8C5055B18A1A83DF97E2170',
        video:
        { duration: 10427.699999999999,
            firstDTS: 1459270873605,
            firstEncoderDTS: 67609,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 10389.333333333334,
            firstDTS: 1459270873580,
            firstEncoderDTS: 67584,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_7.mp4' },
    { startTime: 1459270884095,
        sig: '953C9281A8D6702CC8A9F64EC8A45433',
        video:
        { duration: 10427.699999999999,
            firstDTS: 1459270884115,
            firstEncoderDTS: 78036,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 10389.333333333334,
            firstDTS: 1459270884095,
            firstEncoderDTS: 78016,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_8.mp4' },
    { startTime: 1459270894608,
        sig: '8DF2C3E358C9AAC6635A1FEFDCD74447',
        video:
        { duration: 10427.699999999999,
            firstDTS: 1459270894623,
            firstEncoderDTS: 88463,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 10389.333333333334,
            firstDTS: 1459270894608,
            firstEncoderDTS: 88448,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_9.mp4' },
    { startTime: 1459270905166,
        sig: 'B3639CAA3FFA4B62946F199A39F3A966',
        video:
        { duration: 10427.699999999999,
            firstDTS: 1459270905176,
            firstEncoderDTS: 98890,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 10389.333333333334,
            firstDTS: 1459270905166,
            firstEncoderDTS: 98880,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_10.mp4' },
    { startTime: 1459270915302,
        sig: 'EB4A788A4341FCFA9C91595E082B65FB',
        video:
        { duration: 3127.7,
            firstDTS: 1459270915308,
            firstEncoderDTS: 109318,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 3093.3333333333335,
            firstDTS: 1459270915302,
            firstEncoderDTS: 109312,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_11.mp4' },
    { startTime: 1459270918767,
        sig: '1FB7D3A20D842277B8F7F989DD65AEFB',
        video:
        { duration: 8174.7,
            firstDTS: 1459270918767,
            firstEncoderDTS: 112446,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 8149.333333333333,
            firstDTS: 1459270918769,
            firstEncoderDTS: 112448,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_12.mp4' },
    { startTime: 1459270926693,
        sig: '6C2A19B108C6DB14E9A2E1A8485FE682',
        video:
        { duration: 12219.699999999999,
            firstDTS: 1459270926693,
            firstEncoderDTS: 120621,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 12117.333333333332,
            firstDTS: 1459270926712,
            firstEncoderDTS: 120640,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_13.mp4' },
    { startTime: 1459270938954,
        sig: '34C8D28C6FC2F2EA816BD059324B90BB',
        video:
        { duration: 11636.699999999999,
            firstDTS: 1459270938995,
            firstEncoderDTS: 132841,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 11605.333333333334,
            firstDTS: 1459270938954,
            firstEncoderDTS: 132800,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_14.mp4' },
    { startTime: 1459270950686,
        sig: '5E2AFC02073844CA1C7A6A4053DF3ED0',
        video:
        { duration: 10092.7,
            firstDTS: 1459270950716,
            firstEncoderDTS: 144478,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 10069.333333333332,
            firstDTS: 1459270950686,
            firstEncoderDTS: 144448,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_15.mp4' },
    { startTime: 1459270960548,
        sig: '0F4A0A5B3C791DB28C5CECE2D8BB8AF1',
        video:
        { duration: 13012.7,
            firstDTS: 1459270960559,
            firstEncoderDTS: 154571,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 12949.333333333334,
            firstDTS: 1459270960548,
            firstEncoderDTS: 154560,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_16.mp4' },
    { startTime: 1459270973617,
        sig: 'C7307AC10F6A2F1C74ADBEF971CF8CF2',
        video:
        { duration: 2585.7000000000003,
            firstDTS: 1459270973649,
            firstEncoderDTS: 167584,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 2581.333333333333,
            firstDTS: 1459270973617,
            firstEncoderDTS: 167552,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_17.mp4' },
    { startTime: 1459270976443,
        sig: 'EC35AF1C12E7FDF0B21DDA177CAA9823',
        video:
        { duration: 12929.7,
            firstDTS: 1459270976443,
            firstEncoderDTS: 170170,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 12885.333333333334,
            firstDTS: 1459270976449,
            firstEncoderDTS: 170176,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_18.mp4' },
    { startTime: 1459270989125,
        sig: '221B6CCBC25292322B0EEBFB22A805A2',
        video:
        { duration: 10051.7,
            firstDTS: 1459270989125,
            firstEncoderDTS: 183100,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 10005.333333333332,
            firstDTS: 1459270989129,
            firstEncoderDTS: 183104,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_19.mp4' },
    { startTime: 1459270999258,
        sig: 'ED24F185DF8D81B5540CF9336692767D',
        video:
        { duration: 8008.699999999999,
            firstDTS: 1459270999258,
            firstEncoderDTS: 193151,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 7957.333333333334,
            firstDTS: 1459270999259,
            firstEncoderDTS: 193152,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_20.mp4' },
    { startTime: 1459271007466,
        sig: '6C6CFE736E1E4F1C8C696668CDAF2672',
        video:
        { duration: 10677.699999999999,
            firstDTS: 1459271007473,
            firstEncoderDTS: 201159,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 10645.333333333334,
            firstDTS: 1459271007466,
            firstEncoderDTS: 201152,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_21.mp4' },
    { startTime: 1459271017901,
        sig: '11EA09A29C9952492C74148E9ACE913D',
        video:
        { duration: 11302.699999999999,
            firstDTS: 1459271017901,
            firstEncoderDTS: 211837,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 11221.333333333334,
            firstDTS: 1459271017904,
            firstEncoderDTS: 211840,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_22.mp4' },
    { startTime: 1459271029254,
        sig: '7FED0D1028210B284F34AD3E4E209E6C',
        video:
        { duration: 8132.7,
            firstDTS: 1459271029290,
            firstEncoderDTS: 223140,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 8085.333333333333,
            firstDTS: 1459271029254,
            firstEncoderDTS: 223104,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_23.mp4' },
    { startTime: 1459271037544,
        sig: '96B4EF7F2515DAB9D604CCCF247A1DEC',
        video:
        { duration: 9133.699999999999,
            firstDTS: 1459271037585,
            firstEncoderDTS: 231273,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 9109.333333333334,
            firstDTS: 1459271037544,
            firstEncoderDTS: 231232,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_24.mp4' },
    { startTime: 1459271046570,
        sig: 'D905899EBED95C8651D117066799B840',
        video:
        { duration: 13012.7,
            firstDTS: 1459271046593,
            firstEncoderDTS: 240407,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 13013.333333333334,
            firstDTS: 1459271046570,
            firstEncoderDTS: 240384,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_25.mp4' },
    { startTime: 1459271059482,
        sig: '779DD88ABDBA84FD9EE23DAF00A2BF53',
        video:
        { duration: 8299.699999999999,
            firstDTS: 1459271059482,
            firstEncoderDTS: 253420,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 8213.333333333332,
            firstDTS: 1459271059502,
            firstEncoderDTS: 253440,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_26.mp4' },
    { startTime: 1459271067964,
        sig: 'E9A0788D0AFC8CC6363D4822CA1F1919',
        video:
        { duration: 10426.7,
            firstDTS: 1459271067988,
            firstEncoderDTS: 261720.00000000003,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 10389.333333333334,
            firstDTS: 1459271067964,
            firstEncoderDTS: 261696.00000000003,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_27.mp4' },
    { startTime: 1459271078474,
        sig: 'EB50783C75255B0DC4999E7613BF7782',
        video:
        { duration: 10426.7,
            firstDTS: 1459271078493,
            firstEncoderDTS: 272147,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 10389.333333333334,
            firstDTS: 1459271078474,
            firstEncoderDTS: 272128,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_28.mp4' },
    { startTime: 1459271088656,
        sig: 'F2E10A87C1727ED3AD8614F812D4A91E',
        video:
        { duration: 8174.7,
            firstDTS: 1459271088670,
            firstEncoderDTS: 282574,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 8149.333333333333,
            firstDTS: 1459271088656,
            firstEncoderDTS: 282560,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_29.mp4' },
    { startTime: 1459271097051,
        sig: '6C7828CC51BD3E123FC76D33FBE757C4',
        video:
        { duration: 10426.7,
            firstDTS: 1459271097051,
            firstEncoderDTS: 290749,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 10389.333333333334,
            firstDTS: 1459271097054,
            firstEncoderDTS: 290752,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_30.mp4' },
    { startTime: 1459271107146,
        sig: 'E7FB4F4EBFAD15EE33875E78089D668E',
        video:
        { duration: 10051.7,
            firstDTS: 1459271107146,
            firstEncoderDTS: 301176,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 10005.333333333332,
            firstDTS: 1459271107154,
            firstEncoderDTS: 301184,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_31.mp4' },
    { startTime: 1459271117366,
        sig: '052AA7FD9A120465C97BD5BFAD3FF6B9',
        video:
        { duration: 9925.7,
            firstDTS: 1459271117366,
            firstEncoderDTS: 311228,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 9877.333333333332,
            firstDTS: 1459271117370,
            firstEncoderDTS: 311232,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_32.mp4' },
    { startTime: 1459271127371,
        sig: 'F92E7C2AC0D5F12D8DEF57378B65F53D',
        video:
        { duration: 12262.7,
            firstDTS: 1459271127373,
            firstEncoderDTS: 321154,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 12181.333333333332,
            firstDTS: 1459271127371,
            firstEncoderDTS: 321152,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_33.mp4' },
    { startTime: 1459271139674,
        sig: '86E4200DE8F36BE04BAEBC8EDBF10D04',
        video:
        { duration: 8717.7,
            firstDTS: 1459271139714,
            firstEncoderDTS: 333416,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 8725.333333333334,
            firstDTS: 1459271139674,
            firstEncoderDTS: 333376,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_34.mp4' },
    { startTime: 1459271148178,
        sig: '6F5E4F104E6945359DCF139F5B65CA67',
        video:
        { duration: 11011.699999999999,
            firstDTS: 1459271148178,
            firstEncoderDTS: 342133,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 10965.333333333334,
            firstDTS: 1459271148189,
            firstEncoderDTS: 342144,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_35.mp4' },
    { startTime: 1459271159270,
        sig: '05BA76DB5CD37857373714F2B20702D1',
        video:
        { duration: 7215.7,
            firstDTS: 1459271159270,
            firstEncoderDTS: 353144,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 7125.333333333334,
            firstDTS: 1459271159278,
            firstEncoderDTS: 353152,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_36.mp4' },
    { startTime: 1459271166654,
        sig: '237184C7DAC63F2EEB1E2D6E727B5C0A',
        video:
        { duration: 9759.7,
            firstDTS: 1459271166694,
            firstEncoderDTS: 360360,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 9749.333333333332,
            firstDTS: 1459271166654,
            firstEncoderDTS: 360320,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_37.mp4' },
    { startTime: 1459271176192,
        sig: '07D5DC363F8F4D905CA0CA3627BF32EC',
        video:
        { duration: 11093.7,
            firstDTS: 1459271176200,
            firstEncoderDTS: 370120,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 11029.333333333334,
            firstDTS: 1459271176192,
            firstEncoderDTS: 370112,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_38.mp4' },
    { startTime: 1459271187345,
        sig: '46292456CB0AF4FAF8A1ABAA0A01F702',
        video:
        { duration: 8925.7,
            firstDTS: 1459271187375,
            firstEncoderDTS: 381214,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 8917.333333333334,
            firstDTS: 1459271187345,
            firstEncoderDTS: 381184,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_39.mp4' },
    { startTime: 1459271196425,
        sig: 'AD512382480CF0B7C100C302C23EDCE1',
        video:
        { duration: 11844.699999999999,
            firstDTS: 1459271196425,
            firstEncoderDTS: 390140,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 11797.333333333332,
            firstDTS: 1459271196429,
            firstEncoderDTS: 390144,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_40.mp4' },
    { startTime: 1459271207978,
        sig: '280A433CCB9F6A0861FE07C98C779412',
        video:
        { duration: 15306.699999999999,
            firstDTS: 1459271207979,
            firstEncoderDTS: 401985,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 15253.333333333334,
            firstDTS: 1459271207978,
            firstEncoderDTS: 401984,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_41.mp4' },
    { startTime: 1459271223266,
        sig: 'FD8B2B5118EBC26F7178063914EB7282',
        video:
        { duration: 9092.7,
            firstDTS: 1459271223278,
            firstEncoderDTS: 417292,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 9045.333333333334,
            firstDTS: 1459271223266,
            firstEncoderDTS: 417280,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_42.mp4' },
    { startTime: 1459271232520,
        sig: 'AF53D267ACEE4D39802064FD5B4056A3',
        video:
        { duration: 6673.7,
            firstDTS: 1459271232536,
            firstEncoderDTS: 426384,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 6613.333333333333,
            firstDTS: 1459271232520,
            firstEncoderDTS: 426368,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_43.mp4' },
    { startTime: 1459271239382,
        sig: '585DAF7CC1B00C8FF584B1E45748A527',
        video:
        { duration: 8132.7,
            firstDTS: 1459271239416,
            firstEncoderDTS: 433058,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 8085.333333333333,
            firstDTS: 1459271239382,
            firstEncoderDTS: 433024,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_44.mp4' },
    { startTime: 1459271247260,
        sig: 'A9528D91EEA2B4CC274171A86FF57E9A',
        video:
        { duration: 9467.7,
            firstDTS: 1459271247299,
            firstEncoderDTS: 441191,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 9429.333333333334,
            firstDTS: 1459271247260,
            firstEncoderDTS: 441152,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_45.mp4' },
    { startTime: 1459271256940,
        sig: 'EC15DC577C41F437296FF94D6192AF3F',
        video:
        { duration: 11093.7,
            firstDTS: 1459271256975,
            firstEncoderDTS: 450659,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 11093.333333333334,
            firstDTS: 1459271256940,
            firstEncoderDTS: 450624,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_46.mp4' },
    { startTime: 1459271267704,
        sig: '915C066A1376637108251E4BDA50C504',
        video:
        { duration: 12387.7,
            firstDTS: 1459271267704,
            firstEncoderDTS: 461753,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 12309.333333333332,
            firstDTS: 1459271267711,
            firstEncoderDTS: 461760,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_47.mp4' },
    { startTime: 1459271280138,
        sig: '191F8FDA2C99E0140C8089C8072768B5',
        video:
        { duration: 7591.700000000001,
            firstDTS: 1459271280166,
            firstEncoderDTS: 474140,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 7573.333333333333,
            firstDTS: 1459271280138,
            firstEncoderDTS: 474112,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_48.mp4' },
    { startTime: 1459271287962,
        sig: '7D5A6709DB6B12D417B3B6AA348EEAFF',
        video:
        { duration: 9509.7,
            firstDTS: 1459271287965,
            firstEncoderDTS: 481731,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 9429.333333333334,
            firstDTS: 1459271287962,
            firstEncoderDTS: 481728,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_49.mp4' },
    { startTime: 1459271297182,
        sig: 'EF4D061E78CB8B58764BEF933FDA8C45',
        video:
        { duration: 15848.699999999999,
            firstDTS: 1459271297223,
            firstEncoderDTS: 491241,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 15829.333333333332,
            firstDTS: 1459271297182,
            firstEncoderDTS: 491200,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_50.mp4' },
    { startTime: 1459271313087,
        sig: 'A99218C88A4F4ABCD5C44C7E8050D0AC',
        video:
        { duration: 3920.7000000000003,
            firstDTS: 1459271313105,
            firstEncoderDTS: 507090,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 3861.3333333333335,
            firstDTS: 1459271313087,
            firstEncoderDTS: 507072,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_51.mp4' },
    { startTime: 1459271317241,
        sig: '680E2C64AA0EE92DE79598BA3B84A89C',
        video:
        { duration: 13679.7,
            firstDTS: 1459271317276,
            firstEncoderDTS: 511011,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 13653.333333333334,
            firstDTS: 1459271317241,
            firstEncoderDTS: 510976,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_52.mp4' },
    { startTime: 1459271330897,
        sig: '7046239882F1CD24039DB6474B734573',
        video:
        { duration: 7799.7,
            firstDTS: 1459271330916,
            firstEncoderDTS: 524691,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 7765.333333333333,
            firstDTS: 1459271330897,
            firstEncoderDTS: 524672,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_53.mp4' },
    { startTime: 1459271338452,
        sig: '09F7D6C296824ABAB0988AB56E00AE2D',
        video:
        { duration: 11219.699999999999,
            firstDTS: 1459271338462,
            firstEncoderDTS: 532490,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 11157.333333333334,
            firstDTS: 1459271338452,
            firstEncoderDTS: 532480,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_54.mp4' },
    { startTime: 1459271349860,
        sig: '9D078E43955A2C02127B2B3233001B00',
        video:
        { duration: 10426.7,
            firstDTS: 1459271349890,
            firstEncoderDTS: 543710,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 10389.333333333334,
            firstDTS: 1459271349860,
            firstEncoderDTS: 543680,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_55.mp4' },
    { startTime: 1459271360372,
        sig: 'BFFAC82D4C76F119A1F309CF86DE2F7D',
        video:
        { duration: 9133.699999999999,
            firstDTS: 1459271360397,
            firstEncoderDTS: 554137,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 9109.333333333334,
            firstDTS: 1459271360372,
            firstEncoderDTS: 554112,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_56.mp4' },
    { startTime: 1459271369272,
        sig: '727BE57F6460EA9A0666AFA25EDD95E5',
        video:
        { duration: 9300.7,
            firstDTS: 1459271369279,
            firstEncoderDTS: 563271,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 9237.333333333334,
            firstDTS: 1459271369272,
            firstEncoderDTS: 563264,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_57.mp4' },
    { startTime: 1459271378634,
        sig: '2B3025AE871AB89E6CFBB72C1ABB6BD0',
        video:
        { duration: 10510.7,
            firstDTS: 1459271378662,
            firstEncoderDTS: 572572,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 10453.333333333334,
            firstDTS: 1459271378634,
            firstEncoderDTS: 572544,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_58.mp4' },
    { startTime: 1459271389335,
        sig: '483C0AADE95ECB18DDE69BF44F2BF504',
        video:
        { duration: 8799.699999999999,
            firstDTS: 1459271389378,
            firstEncoderDTS: 583083,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 8789.333333333334,
            firstDTS: 1459271389335,
            firstEncoderDTS: 583040,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_59.mp4' },
    { startTime: 1459271397919,
        sig: '6071E7D3435930E05CD4202DAD0F28CE',
        video:
        { duration: 9842.7,
            firstDTS: 1459271397930,
            firstEncoderDTS: 591883,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 9813.333333333332,
            firstDTS: 1459271397919,
            firstEncoderDTS: 591872,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_60.mp4' },
    { startTime: 1459271407857,
        sig: 'BE5E8D3CF306D12F7A155711268D15BB',
        video:
        { duration: 8341.699999999999,
            firstDTS: 1459271407857,
            firstEncoderDTS: 601726,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 8277.333333333332,
            firstDTS: 1459271407859,
            firstEncoderDTS: 601728,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_61.mp4' },
    { startTime: 1459271416385,
        sig: 'A495FD5D42238C1D2590CE5847F5E582',
        video:
        { duration: 15264.699999999999,
            firstDTS: 1459271416405,
            firstEncoderDTS: 610068,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 15253.333333333334,
            firstDTS: 1459271416385,
            firstEncoderDTS: 610048,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_62.mp4' },
    { startTime: 1459271431626,
        sig: 'A705EEDD23B6ACAA016A171682E38487',
        video:
        { duration: 5880.7,
            firstDTS: 1459271431626,
            firstEncoderDTS: 625333,
            wrapEncoderDTS: 95443718 },
        audio:
        { duration: 5845.333333333334,
            firstDTS: 1459271431637,
            firstEncoderDTS: 625344,
            wrapEncoderDTS: 95443718 },
        path: mp4FilesPath +'media-u774d8hoj_w20128143_63.mp4' }
];

var generateFileInfos = function() {

    var baseDir = __dirname + './../../node_addons/FormatConverter/resources/input/';

    var fileList = [
        'media-u774d8hoj_w20128143_1.ts_saved.ts',
        'media-u774d8hoj_w20128143_2.ts_saved.ts',
        'media-u774d8hoj_w20128143_3.ts_saved.ts',
        'media-u774d8hoj_w20128143_4.ts_saved.ts',
        'media-u774d8hoj_w20128143_5.ts_saved.ts',
        'media-u774d8hoj_w20128143_6.ts_saved.ts',
        'media-u774d8hoj_w20128143_7.ts_saved.ts',
        'media-u774d8hoj_w20128143_8.ts_saved.ts',
        'media-u774d8hoj_w20128143_9.ts_saved.ts',
        'media-u774d8hoj_w20128143_10.ts_saved.ts',
        'media-u774d8hoj_w20128143_11.ts_saved.ts',
        'media-u774d8hoj_w20128143_12.ts_saved.ts',
        'media-u774d8hoj_w20128143_13.ts_saved.ts',
        'media-u774d8hoj_w20128143_14.ts_saved.ts',
        'media-u774d8hoj_w20128143_15.ts_saved.ts',
        'media-u774d8hoj_w20128143_16.ts_saved.ts',
        'media-u774d8hoj_w20128143_17.ts_saved.ts',
        'media-u774d8hoj_w20128143_18.ts_saved.ts',
        'media-u774d8hoj_w20128143_19.ts_saved.ts',
        'media-u774d8hoj_w20128143_20.ts_saved.ts',
        'media-u774d8hoj_w20128143_21.ts_saved.ts',
        'media-u774d8hoj_w20128143_22.ts_saved.ts',
        'media-u774d8hoj_w20128143_23.ts_saved.ts',
        'media-u774d8hoj_w20128143_24.ts_saved.ts',
        'media-u774d8hoj_w20128143_25.ts_saved.ts',
        'media-u774d8hoj_w20128143_26.ts_saved.ts',
        'media-u774d8hoj_w20128143_27.ts_saved.ts',
        'media-u774d8hoj_w20128143_28.ts_saved.ts',
        'media-u774d8hoj_w20128143_29.ts_saved.ts',
        'media-u774d8hoj_w20128143_30.ts_saved.ts',
        'media-u774d8hoj_w20128143_31.ts_saved.ts',
        'media-u774d8hoj_w20128143_32.ts_saved.ts',
        'media-u774d8hoj_w20128143_33.ts_saved.ts',
        'media-u774d8hoj_w20128143_34.ts_saved.ts',
        'media-u774d8hoj_w20128143_35.ts_saved.ts',
        'media-u774d8hoj_w20128143_36.ts_saved.ts',
        'media-u774d8hoj_w20128143_37.ts_saved.ts',
        'media-u774d8hoj_w20128143_38.ts_saved.ts',
        'media-u774d8hoj_w20128143_39.ts_saved.ts',
        'media-u774d8hoj_w20128143_40.ts_saved.ts',
        'media-u774d8hoj_w20128143_41.ts_saved.ts',
        'media-u774d8hoj_w20128143_42.ts_saved.ts',
        'media-u774d8hoj_w20128143_43.ts_saved.ts',
        'media-u774d8hoj_w20128143_44.ts_saved.ts',
        'media-u774d8hoj_w20128143_45.ts_saved.ts',
        'media-u774d8hoj_w20128143_46.ts_saved.ts',
        'media-u774d8hoj_w20128143_47.ts_saved.ts',
        'media-u774d8hoj_w20128143_48.ts_saved.ts',
        'media-u774d8hoj_w20128143_49.ts_saved.ts',
        'media-u774d8hoj_w20128143_50.ts_saved.ts',
        'media-u774d8hoj_w20128143_51.ts_saved.ts',
        'media-u774d8hoj_w20128143_52.ts_saved.ts',
        'media-u774d8hoj_w20128143_53.ts_saved.ts',
        'media-u774d8hoj_w20128143_54.ts_saved.ts',
        'media-u774d8hoj_w20128143_55.ts_saved.ts',
        'media-u774d8hoj_w20128143_56.ts_saved.ts',
        'media-u774d8hoj_w20128143_57.ts_saved.ts',
        'media-u774d8hoj_w20128143_58.ts_saved.ts',
        'media-u774d8hoj_w20128143_59.ts_saved.ts',
        'media-u774d8hoj_w20128143_60.ts_saved.ts',
        'media-u774d8hoj_w20128143_61.ts_saved.ts',
        'media-u774d8hoj_w20128143_62.ts_saved.ts',
        'media-u774d8hoj_w20128143_63.ts_saved.ts'
    ];

    var downloadFile = function (url, stream, timeout) {

        var def = Q.defer(),
            tm,
            onError = function () {
                def.reject(new Error('timeout ' + url));
                if (tm) {
                    clearTimeout(tm);
                }
            };

        try {
            var req = fs.createReadStream(url);

            if (timeout) {
                tm = setTimeout(onError, timeout);
            }

            stream.on('end', function (retVal) {
                if (tm) {
                    clearTimeout(tm);
                }
                def.resolve(retVal);
            });

            req.on('error', onError)
                .pipe(stream);

        }
        catch (err) {
            onError(err);
        }
        return def.promise;
    };

    var promises = fileList.map(function (chunkPath) {
        var fullPath = path.join(baseDir, chunkPath);
        var mp4Conv = new MP4WriteStream(fullPath, logger);
        return downloadFile(fullPath, mp4Conv);
    });

    Q.all(promises).then(function (results) {
        results.forEach(function (fi) {
            console.log(util.inspect(fi));
        })
    });
};

function WorkerItem(flavor){
    this.flavor = flavor;
}

WorkerItem.prototype.clone = function(from,timeBias,uniqueSig) {
    var that = this;

    if(!from) {
        throw new Error('bad onput');
    }



    if (from.video) {
        if(!that.video) {
            that.video = {};
        }
        that.video.firstDTS = from.video.firstDTS + timeBias;
        that.video.firstEncoderDTS = from.video.firstEncoderDTS;
        that.video.duration = from.video.duration;
        that.video.wrapEncoderDTS = from.video.wrapEncoderDTS;
    } else {
        delete that.video;
    }

    if(from.audio){
        if(!that.audio) {
            that.audio = {};
        }
        that.audio.firstDTS = from.audio.firstDTS + timeBias;
        that.audio.firstEncoderDTS = from.audio.firstEncoderDTS;
        that.audio.duration = from.audio.duration;
        that.audio.wrapEncoderDTS = from.audio.wrapEncoderDTS;
    } else {
        delete that.audio;
    }

    if(uniqueSig){
        var fakedMd5 = that.video.firstDTS.toFixed(0);
        that.sig = fakedMd5 + from.sig.slice(0,fakedMd5.length);
    } else {
        that.sig = from.sig;
    }
    that.path = from.path;

    return this;
};

function FlavorWorker(testName,playlist,chunkList,flavorId,iterations){
    this.playlist = playlist;
    this.chunkList = new Array(chunkList)[0];
    this.flavorId = flavorId;
    this.counter = 0;
    this.iterations = iterations;
    this.testName = testName;
    this.workerItem = new WorkerItem(flavorId);
    this.listDuration = this.chunkList[this.chunkList.length-1].video.firstDTS
        + this.chunkList[this.chunkList.length-1].video.duration - this.chunkList[0].video.firstDTS;
}

var bootstrapFileCount = 0;

FlavorWorker.prototype.beginIteration = function() {
    var that = this;

    var nextItem = that.chunkList[that.counter % that.chunkList.length];

    that.workerItem.clone(nextItem,that.sesionStartTimeDiff,true);

    var waitTime = Math.max(0,that.workerItem.video.firstDTS - Date.now());

    that.tm = setTimeout(that.completeIteration, waitTime,that);
};

FlavorWorker.prototype.completeIteration = function(self){
    var that = self;

    that.updatePromise = Q.all(that.playlist.update([that.workerItem]))
        .then(function (chunksToRemove) {
            console.log(that.testName + " - " + that.flavorId + " " + util.inspect(chunksToRemove));
        })
        .catch(function (err) {
            console.log(that.testName + " - " + that.flavorId + " " + err);
        })
        .finally(function(){
            that.updatePromise = null;
        });

    that.counter++;
    if (that.iterations && that.counter >= that.iterations) {
        return;
    }
    if( (that.counter % that.chunkList.length) === 0){
        //console.log("testName: testing encoder timestamp discontinuity");
        that.sesionStartTimeDiff += that.listDuration;
    }

    that.beginIteration();
};

FlavorWorker.prototype.start = function() {
    var that = this;

    that.sesionStartTimeDiff = Date.now() - that.chunkList[0].video.firstDTS
            - that.chunkList.slice(0,bootstrapFileCount).reduce(function(val,item){
                return item.video.duration + val;
       },0);

    that.beginIteration();

    return that;
};

FlavorWorker.prototype.stop = function () {
    var that = this;

    if(that.tm ) {
        clearTimeout(that.tm);
        that.tm = null;
    }
    return that.updatePromise || Q.resolve();
};

var available_tests = [
    'test continuous stream',
    'test stream with discontinuities single flavor',
    'test stream with encoder timestamp wrap'
];

var enabled_tests = [
   // 'test stream with encoder timestamp wrap'
    'test continuous stream'
//    'test stream with discontinuities single flavor'
]

var runSession = function(testName,flavors,iterations) {

    if(enabled_tests.indexOf(testName) < 0){
        console.log("test \"%s\" is disabled, skipping",testName);
        return Q.resolve();
    }

    console.log(testName);

    var playlistPath = path.join(mp4FilesPath,'playlist.json');

    var playlist = new PlaylistGenerator({
            entryId:'abc123',
           dvrWindow:7200
        } ,logger);

    var def = Q.defer();
    playlist.start().then( function() {

        var diagTimer = setInterval(function(){
            console.log(util.inspect(playlist.getDiagnostics()));
        },10000);

        var flavorWorkers =  flavors.map(function(f){
            return new FlavorWorker(testName,playlist, f.list, f.flavor,iterations).start();
        });

        var done = function(){

            clearInterval(diagTimer);

            Q.AllSettled(flavorWorkers.map(function(worker){
                worker.stop();
            }))
                .then( function() {
                    playlist.stop();
                })
                .then( function() {
                    def.resolve(testName);
                });
        };

        process.on('SIGINT',done);

    }).catch(function(err){
        def.reject(testName + " -" + err);
    });

    return def.promise;
};

var createDiscontinuities = function(list,n){

    var nextHoleStart = 0, holeSize = 0;

    return list.filter(function(fi){
        if(nextHoleStart < n) {
            nextHoleStart += fi.video.duration;
            return true;
        } else if(holeSize < n){
            if(holeSize === 0) {
                console.log("createDiscontinuities. hole at %d file=%s",fi.video.firstDTS,fi.path);
            }
            holeSize += fi.video.duration;
            return false;
        } else {
            console.log("createDiscontinuities. end of hole at %d file=%s",fi.video.firstDTS,fi.path);
            nextHoleStart = holeSize = 0;
            nextHoleStart += fi.video.duration;
            return true;
        }
    });
};


var createEncoderWrap = function(list){

    var offset = PlaylistUtils.addWithOverflow(list[0].video.wrapEncoderDTS - (list[0].video.duration  / 2 + list[0].video.firstEncoderDTS),list[0].video.wrapEncoderDTS);
    console.log("createEncoderWrap shifting every encoder dts by %d firstEncoderDTS=%d duration=%d wrap at %d",
        offset,list[0].video.firstEncoderDTS,list[0].video.duration,list[0].video.wrapEncoderDTS);

    return list.map(function(fi){

        var obj = {};

        Object.keys(fi).forEach( function(p) {
            if( fi.hasOwnProperty(p) ){
                obj[p] = fi[p];
            }
        });

        obj.video.firstEncoderDTS = PlaylistUtils.addWithOverflow(obj.video.firstEncoderDTS + offset,obj.video.wrapEncoderDTS);
        if(obj.audio) {
            obj.audio.firstEncoderDTS = PlaylistUtils.addWithOverflow(obj.audio.firstEncoderDTS + offset,obj.audio.wrapEncoderDTS);
        }


        return obj;
    });
};

var numOfFiles = 5;


// test # 1 test run of files
//config.set('dontInitializePlaylist',true);

runSession('test continuous stream',[{list:fileInfos.slice(0,numOfFiles),flavor:1},{list:fileInfos.slice(0,numOfFiles),flavor:2}])
    .then( function() {
        return runSession('test stream with discontinuities single flavor',
            [{
                list: createDiscontinuities(fileInfos.slice(0,32), 60000),
                flavor: 1
            }])
            .then(function (msg) {
                console.log(msg);
            })
            .catch(function (err) {
                console.log(err);
            })
            .finally(function () {
                return runSession('test stream with encoder timestamp wrap',
                    [{
                        list: createEncoderWrap(fileInfos.slice(0,5)),
                        flavor: 1
                    }])
            });
    });






