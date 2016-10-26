/**
 * Created by lilach.maliniak on 02/08/2016.
 */
/* Todo: add support in multiple reporters both in regression and recording
/*
 Note: running recording from terminal:
 >npm test

 update package.json:

 /*
 Note:
 running recording from terminal:

 option #1:

 update package.json:

 "scripts": {
    "test": "MOCHA_FILE=./reports/last_regression_run/regression-test-report.xml mocha ./tests/regression/regression-spec.js --reporter mocha-junit-reporter --timeout 86400000"
 }

 from terminal run command: npm test

 option #2:
 grunt regression-tests:dev -run_regression -analysis=true -entry_id=1_oorxcge2   -analyzer_ignore_alerts="'INFTagDurationDoesntMatch','BitrateOutsideOfTargetAlert','InvalidKeyFrameIntervalAlert','SegmentCountMismatchAlert'" -entry_path=1_oorxcge2-3  -result_path=reports -analyzer_root=/Users/lilach.maliniak/Desktop/dev/repositories/live-monitor -override=false

 comments:
 >>>>> option #1 uses configMapping.json ad config.json.template configuration
 >>>>> option #2 can use command line args and configuration

 */


module.exports = function (grunt) {
    'use strict';

    grunt.config.set('regression-tests', {

        dev: {
            options: {
                reporter: 'mocha-junit-reporter',
                /*reporterOptions: {
                    mochaFile: './<%=reports_dir%>/last_regression_run/regression-tests-report.xml',
                    properties: {
                        BUILD_ID: process.env.BUILD_NUMBER,
                        useFullSuiteTitle: true,
                        suiteTitleSeparedBy: '.'
                    },
                },*/
                require: 'chai',
                //require: 'mocha-junit-reporter',
                timeout: 86400000,
                captureFile: '<%=reports_dir%>/regression/regression-tests.log'
            },
            src: ['<%=regression_tests%>']
        },
        ci: {
            options: {
                reporter: 'mocha-junit-reporter',
                /*reporterOptions: {
                    mochaFile: './<%=reports_dir%>/last_regression_run/regression-tests-report.xml',
                    properties: {
                        BUILD_ID: process.env.BUILD_NUMBER,
                        useFullSuiteTitle: true,
                        suiteTitleSeparedBy: '.'
                    },
                },*/
                //reporter: 'Xunit',
                require: 'chai',
                timeout: 86400000,
                quiet: true,
                captureFile: '<%=reports_dir%>/regression/regression-tests.log'

            },
            src: ['<%=regression_tests%>']
        },
    });
};
