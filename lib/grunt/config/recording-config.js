/**
 * Created by lilach.maliniak on 18/08/2016.
 */

/*
 Note: running recording from terminal:
  >npm test

 update package.json:

 "scripts": {
    "test": "MOCHA_FILE=./reports/last_recording_run/recording-report.xml mocha ./tests/recording/recording-spec.js --reporter mocha-junit-reporter --timeout 86400000"
 }

option #2:
 from command line run:
 grunt recording-test:dev -record -url=http://kalseglive-a.akamaihd.net:80/dc-0/m/pa-live-publish4/kLive/smil:0_6gox09ym_all.smil/playlist.m3u8

 comment:
 >>>> option #1 requires all configuration set in configMapping.json or config.json.template
 >>>> option #2 can use command line args and configuration

 */

module.exports = function (grunt) {
    'use strict';
    
    grunt.config.set('recording-test', {

        dev: {
            options: {
                reporter: 'mocha-junit-reporter',
                /*reporterOptions: {
                     mochaFile: './<%=reports_dir%>/recording/recording-report.xml',
                     properties: {
                         BUILD_ID: process.env.BUILD_NUMBER,
                         useFullSuiteTitle: false
                     },
                 },*/
                //reporter: 'spec',
                require: 'chai',
                timeout: 86400000,
                captureFile: '<%=reports_dir%>/recording/recording.log'
            },
            src: ['<%=recording%>']
        },
        ci: {
            options: {
                //reporter: 'xunit',
                reporter: 'mocha-junit-reporter',
                /*reporterOptions: {
                    mochaFile: './<%=reports_dir%>/recording/recording-report.xml',
                    properties: {
                        BUILD_ID: process.env.BUILD_NUMBER,
                        useFullSuiteTitle: false
                    },
                },*/
                require: 'chai',
                timeout: 86400000,
                quiet : true,
                captureFile: '<%=reports_dir%>/recording/recording.log'

            },
            src: ['<%=recording%>']
        }
    });
};
