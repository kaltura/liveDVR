/**
 * Created by elad.benedict on 8/12/2015.
 */
var match = require('matchdep');

module.exports = function (grunt) {
    'use strict';
    process.env['MOCHA_FILE'] = './reports/junit_test_report.xml';
    process.env['PROPERTIES'] = `BUILD_ID:${process.env.BUILD_NUMBER}`;

    var userConfig = require('./grunt-config.js');

    grunt.file.expand('./node_modules/grunt-*/tasks').forEach(grunt.loadTasks);
    grunt.initConfig(userConfig);
    
    if (process.env.UNIT_TEST_PATH) {
        console.log(`UNIT_TEST_PATH=${process.env.UNIT_TEST_PATH}`);
        userConfig.unit_tests = process.env.UNIT_TEST_PATH;
    }
    
    grunt.loadTasks('./lib/grunt/tasks');
    grunt.loadTasks('./lib/grunt/config');


    // Default task(s).
    grunt.registerTask('default', ['jshint:dev', 'unit-test:dev', 'component-test:dev', 'mocha_istanbul:dev']);
};
