/**
 * Created by elad.benedict on 8/12/2015.
 */

var fs = require('fs');

module.exports = function (grunt) {
    'use strict';

    grunt.registerMultiTask('unit-test', 'Run unit tests', function() {


        var c = {};
        c[this.target] = grunt.config.get('unit-test')[this.target];
        grunt.config.set('mochaTest',c);

        var reportsDir = grunt.config.get('reports_dir');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir);
        }

        grunt.task.run('mochaTest:' + this.target);
    });
};
