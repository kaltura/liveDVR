/**
 * Created by lilach.maliniak on 18/08/2016.
 */

var fs = require('fs');

module.exports = function (grunt) {
    'use strict';

    grunt.registerMultiTask('recording-test', 'Run HLS stream recording', function() {


        var c = {};
        c[this.target] = grunt.config.get('recording-test')[this.target];
        grunt.config.set('mochaTest',c);

        var reportsDir = grunt.config.get('reports_dir');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir);
        }

        grunt.task.run('mochaTest:' + this.target);
    });

};
