/**
 * Created by elad.benedict on 8/12/2015.
 */

module.exports = function (grunt) {
    'use strict';

    grunt.config.set('jshint', {
            dev: {
                src: ['gruntfile.js', 'lib/**/*.js*', 'tests/**/*.js*'],
                options: {
                    jshintrc: '.jshintrc',
                    reporter: require('jshint-junit-reporter'),
                    ignores: ['lib/kaltura-client-lib/*'],
                    reporterOutput: '<%= reports_dir %>/jshint-results.xml'
                }
            },
            ci : {
                src: ['gruntfile.js', 'lib/**/*.js*', 'tests/**/*.js*'],
                options: {
                    jshintrc: '.jshintrc',
                    reporter: require('jshint-junit-reporter'),
                    reporterOutput: '<%= reports_dir %>/jshint-results.xml',
                    ignores: ['lib/kaltura-client-lib/*']
                }
            }
        }
    );
};