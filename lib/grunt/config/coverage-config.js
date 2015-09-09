/**
 * Created by elad.benedict on 8/20/2015.
 */

module.exports = function (grunt) {
    'use strict';

    grunt.config.set('mocha_istanbul', {
        dev: {
            src: 'tests',
            options: {
                mask: '**/unit/*-spec.js',
                root: './lib',
                check: {
                    lines: 90
                },
                excludes : ['**/*config.js'],
                reportFormats: ['lcov'],
                coverageFolder: '<%= reports_dir %>/coverage'
            }
        },
        ci: {
            src: 'tests',
            options: {
                mask: '**/unit/*-spec.js',
                root: './lib',
                check: {
                    lines: 90
                },
                excludes : ['**/*config.js'],
                reportFormats: ['lcov', 'cobertura'],
                coverageFolder: '<%= reports_dir %>/coverage'
            }
        }
    });
};
