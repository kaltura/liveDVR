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
                    mochaFile: './<%=reports_dir%>/last_regression_run/junit/regression-tests-report.xml',
                    properties: {
                        build_id:  process.env.BUILD_NUMBER,
                        useFullSuiteTitle: true,
                        suiteTitleSeparedBy: '.'
                    },
                },
                //require: 'chai',
                require: 'mocha-junit-reporter',
                timeout: 86400000,
                captureFile: '<%=reports_dir%>/last_regression_run/regression-tests.log'
            },
            src: ['<%=regression_tests%>']
        },
        ci: {
            options: {
              reporter: 'mocha-junit-reporter',
                reporterOptions: {
                    mochaFile: './<%=reports_dir%>/last_regression_run/junit/regression-tests-report.xml',
                    properties: {
                        BUILD_ID: process.env.BUILD_NUMBER,
                        useFullSuiteTitle: true,
                        suiteTitleSeparedBy: '.'
                    },
                },
                //reporter: 'Xunit',
                require: 'chai',
                timeout: 86400000,
                quiet: true,
                captureFile: '<%=reports_dir%>/last_regression_run/regression-tests.log'

            },
            src: ['<%=regression_tests%>']
        },
    });
};
