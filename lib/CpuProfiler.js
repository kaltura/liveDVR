/**
 * Created by elad.benedict on 12/21/2015.
 */

var profiler = require('v8-profiler');
var fs = require('fs');
var profiling = false;
var config = require('../common/Configuration');
var localFolder = config.get('localFolderPath') || '/tmp';
var path = require('path');

process.on('SIGUSR2', function() {
    if (profiling)
    {
        var profile = profiler.stopProfiling();
        profile.export(function(error, result) {
            fs.writeFileSync(path.join(localFolder,'profile_' + (new Date()).getTime() + '.cpuprofile'), result);
            profile.delete();
        });
    }
    else
    {
        profiler.startProfiling();
    }
    profiling = !profiling;
});
