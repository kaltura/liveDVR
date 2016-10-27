/**
 * Created by lilach.maliniak on 02/08/2016.
 */

var fs = require('fs');

module.exports = function (grunt) {
    'use strict';

       grunt.registerMultiTask('regression-tests', 'Run regression test', function() {


        var c = {};
        c[this.target] = grunt.config.get('regression-tests')[this.target];
        grunt.config.set('mochaTest',c);

        var reportsDir = grunt.config.get('reports_dir');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir);
        }

        grunt.task.run('mochaTest:' + this.target);
    });

};

    