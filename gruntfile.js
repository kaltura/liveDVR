/**
 * Created by elad.benedict on 8/12/2015.
 */
var match = require('matchdep');

module.exports = function (grunt) {
    'use strict';

    var userConfig = require('./grunt-config.js');

    grunt.file.expand('./node_modules/grunt-*/tasks').forEach(grunt.loadTasks);
    grunt.initConfig(userConfig);

    grunt.loadNpmTasks('grunt-execute');

    grunt.loadTasks('./lib/grunt/tasks');
    grunt.loadTasks('./lib/grunt/config');


    // Default task(s).
   // grunt.registerTask('default', ['jshint:dev', 'execute:regression_test', 'unit-test:dev', 'component-test:dev', 'mocha_istanbul:dev']);
    grunt.registerTask('default', ['jshint:dev', 'unit-test:dev', 'component-test:dev', 'regression-tests:dev', 'mocha_istanbul:dev']);
};
