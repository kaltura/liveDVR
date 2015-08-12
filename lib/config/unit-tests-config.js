/**
 * Created by elad.benedict on 8/12/2015.
 */

module.exports = function (grunt) {
    'use strict';

    grunt.config.set('unit-test', {
            options: {
                reporter: 'spec',
                require: 'chai',
                timeout: 10000
            },
            src: ['<%=unit_tests%>']
    });
};
