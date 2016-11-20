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
    recording : 'tests/recording/*.js'
    
};
