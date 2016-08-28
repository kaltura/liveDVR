/**
 * Created by lilach.maliniak on 02/08/2016.
 */

module.exports = function (grunt) {
    'use strict';

    grunt.config.set('regression-tests', {

        dev: {
            options: {
                reporter: 'spec',
                require: 'chai',
                timeout: 86400000,
                captureFile: '<%=reports_dir%>/regression-tests-report.xml'
            },
            src: ['<%=regression_tests%>']
        },
        ci: {
            options: {
                reporter: 'xunit',
                require: 'chai',
                timeout: 86400000,
                quiet : true,
                captureFile: '<%=reports_dir%>/regression-tests-report.xml'

            },
            src: ['<%=regression_tests%>']
        }
    });
};
