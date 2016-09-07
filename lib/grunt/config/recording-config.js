/**
 * Created by lilach.maliniak on 18/08/2016.
 */

module.exports = function (grunt) {
    'use strict';

    grunt.config.set('recording-test', {

        dev: {
            options: {
                reporter: 'mocha-junit-reporter',
                reporterOptions: {
                    mochaFile: './<%=reports_dir%>/regression-tests-report.xml',
                    properties: {
                        BUILD_ID: "$BUILD_NUMBER",
                        useFullSuiteTitle: true,
                        suiteTitleSeparedBy: '.'
                    },
                },
                //reporter: 'spec',
                require: 'chai',
                timeout: 86400000,
                captureFile: '<%=reports_dir%>/recording-report.xml'
            },
            src: ['<%=recording%>']
        },
        ci: {
            options: {
                reporter: 'xunit',
                require: 'chai',
                timeout: 86400000,
                quiet : true,
                captureFile: '<%=reports_dir%>/recording-report.xml'

            },
            src: ['<%=recording%>']
        }
    });
};
