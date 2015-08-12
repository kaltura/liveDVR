/**
 * Created by elad.benedict on 8/12/2015.
 */
var match = require('matchdep');

module.exports = function (grunt) {
    'use strict';

    var userConfig = require('./grunt-config.js');

    grunt.file.expand('./node_modules/grunt-*/tasks').forEach(grunt.loadTasks);
    grunt.initConfig(userConfig);

    grunt.loadTasks('./lib/tasks');
    grunt.loadTasks('./lib/config');

    // Default task(s).
    grunt.registerTask('default', ['jshint','unit-test']);
};
