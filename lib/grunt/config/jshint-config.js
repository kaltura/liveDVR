/**
 * Created by elad.benedict on 8/12/2015.
 */

module.exports = function (grunt) {
    'use strict';

    grunt.config.set('jshint', {
            dev: {
                src: [
                    '<%= app_files.js%>', '<%=test_files.js%>'
                ],
                options: {
                    jshintrc: true,
                    reporter: require('jshint-junit-reporter'),
                    ignores: ['lib/kaltura-client-lib/*']
                }
            },

            ci : {
                src: [
                    '<%= app_files.js%>', '<%=test_files.js%>'
                ],
                options: {
                    jshintrc: true,
                    reporter: require('jshint-junit-reporter'),
                    reporterOutput: '<%= reports_dir %>/jshint-results.xml',
                    ignores: ['lib/kaltura-client-lib/*']
                }
            }
        }
    );
};