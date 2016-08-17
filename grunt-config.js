/**
 * Created by elad.benedict on 8/12/2015.
 */
module.exports = {

    app_files: {
        js: [ 'lib/**/*.js'],
        json: [ 'lib/**/*.json','package.json'],
        all:['lib/**/**']
    },

    test_files: {
        js: [
            'tests/**/*.js*'
        ]
    },  

    node_files:{
        all:[
            'node_modules/**/**'
        ]
    },

    reports_dir : 'reports',
    unit_tests : 'tests/unit/*.js',
    component_tests : 'tests/component/*.js',
    regression_tests : 'tests/regression/*.js',

    execute: {
        regression_test: {
            options: {
                args: ['run_regression', 'url=http://localhost:8080/kLive/smil:1_oorxcge2_all.smil/chunklist.m3u8', 'entry_path=1_oorxcge2 1', 'result_path=<%=reports_dir%>'],
                before: function(grunt, options){
                    console.log('Hello!');
                },
                after: function(grunt, options){
                    console.log('Bye!');
                }
            },
            src: ['lib/App.js']
        }
    }

};
