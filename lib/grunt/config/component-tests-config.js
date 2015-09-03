/**
 * Created by elad.benedict on 9/2/2015.
 */

module.exports = function (grunt) {
    'use strict';

    grunt.config.set('component-test', {
        dev: {
            options: {
                reporter: 'spec',
                require: 'chai',
                timeout: 10000
            },
            src: ['<%=component_tests%>']
        },
        ci: {
            options: {
                reporter: 'xunit',
                require: 'chai',
                timeout: 10000,
                quiet : true,
                captureFile: '<%=reports_dir%>/component-tests-report.xml'

            },
            src: ['<%=component_tests%>']
        }
    });
};
