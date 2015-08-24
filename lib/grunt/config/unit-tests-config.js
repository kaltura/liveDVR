/**
 * Created by elad.benedict on 8/12/2015.
 */

module.exports = function (grunt) {
    'use strict';

    grunt.config.set('unit-test', {
        dev: {
            options: {
                reporter: 'spec',
                require: 'chai',
                timeout: 10000
            },
            src: ['<%=unit_tests%>']
        },
        ci: {
            options: {
                reporter: 'xunit',
                require: 'chai',
                timeout: 10000,
                captureFile: '<%=reports_dir%>/unit-tests-report.xml'
            },
            src: ['<%=unit_tests%>']
        }
    });
};
