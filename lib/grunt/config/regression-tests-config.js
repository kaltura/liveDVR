/**
 * Created by lilach.maliniak on 02/08/2016.
 */

module.exports = function (grunt) {
    'use strict';

    grunt.config.set('regression-tests', {

        dev: {
            options: {
                reporter: 'mocha-junit-reporter',
                reporterOptions: {
                    mochaFile: './<%=reports_dir%>/regression-tests-report.xml',
                    properties: {
                        build_id: '$BUILD_NUMBER',
                        useFullSuiteTitle: true,
                        suiteTitleSeparedBy: '.'
                    },
                },
                require: 'chai',
                timeout: 86400000,
                captureFile: '<%=reports_dir%>/regression-tests-report.log'
            },
            src: ['<%=regression_tests%>']
        },
        ci: {
            options: {
              /*  reporter: 'mocha-junit-reporter',
                reporterOptions: {
                    mochaFile: './<%=reports_dir%>/regression-tests-report.xml',
                    properties: {
                        BUILD_ID: "$BUILD_NUMBER",
                        useFullSuiteTitle: true,
                        suiteTitleSeparedBy: '.'
                    },
                },*/
                reporter: 'Xunit',
                //require: 'chai',
                timeout: 86400000,
                quiet: true,
                captureFile: '<%=reports_dir%>/regression-tests-report.xml'

            },
            src: ['<%=regression_tests%>']
        },
    });
};
