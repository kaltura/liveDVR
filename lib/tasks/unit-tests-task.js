/**
 * Created by elad.benedict on 8/12/2015.
 */

var fs = require('fs');

module.exports = function (grunt) {
    'use strict';

    grunt.registerMultiTask('unit-test', 'Run unit tests', function() {

        var c = grunt.config.get('unit-test');
        grunt.config.set('mochaTest',c);

        var reportsDir = grunt.config.get('reports_dir');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir);
        }

        process.env.ReportOutputFile = process.env.ReportOutputFile || reportsDir + '/unit-tests-results.xml';

        grunt.task.run('mochaTest');
    });
};
