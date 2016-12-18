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
                timeout: 10000,
                captureFile: '<%=reports_dir%>/unit-tests.log'
            },
            src: ['<%=unit_tests%>']
        },
        ci: {
            options: {
                reporter: 'mocha-junit-reporter',
                require: 'chai',
                timeout: 10000,
                captureFile: '<%=reports_dir%>/unit-tests.log'
            },
            src: ['<%=unit_tests%>']
        }
    });
};
