/**
 * Created by lilach.maliniak on 25/08/2016.
 */
var ControllerCtor = require('./../../lib/Controller');
var util=require('util');
var _ = require('underscore');
var events = require('events');
var Q = require('q');
var ErrorUtils = require('./../../lib/utils/error-utils');

function onExitLiveController(exit_code) {
    var that = this;
    if (exit_code === 0) {
        // regression passed successfully
        console.log('*************************************************');
        console.log(util.format('*   %s finished successfully  *', that.test_description));
        console.log('*************************************************');
    } else {
        // regression failed!
        console.log('******************************************************');
        console.log(util.format('@@@ %s failed with error %s!!! @@@', that.test_description, exit_code));
        console.log('******************************************************');
    }
    that.exit_code = exit_code;
    that.regressionEndedPromise.resolve(exit_code);
}

class ControllerWrapper extends events.EventEmitter {

    constructor(test_description)
    {
        super();

        let isRegression = test_description.indexOf('regression') >= 0;
        // not working as expected
        //this.setEnv4Test(isRegression);
        let prefix = "";
        this.controller = new ControllerCtor(prefix);
        let adapter = require('./../../lib/Adapters/AdapterFactory.js').getAdapter();
        adapter.setControllerWrapper(this);
        this.test_description = test_description;
        this.regressionEndedPromise = Q.defer();
        this.once('exit', onExitLiveController.bind(this));
    }

    start() {
        var that = this;
        var deferred = Q.defer();

        try {
            
            this.controller.start()
                .catch(function (err) {
                    let err_msg = !isNaN(err) ? util.format('regression failed with exit code %s', err) : util.format('regression failed with error %s', err.message);
                    console.log(err_msg);
                    deferred.resolve(err);
                });

            this.regressionEndedPromise.promise
                .then(function (exit_code) {
                    deferred.resolve(exit_code);
                });
        }
        catch (err) {
            that.logger.error('>>>> caught exception, grunt test failed!!!! . Error: %s', ErrorUtils.error2string(err));
            deferred.resolve(-1);
        }
        return deferred.promise;
    }

    setEnv4Test(isRegression) {
        
        if (isRegression) {
            process.env['MOCHA_FILE'] = './reports/last_regression_run/regression-test-report.xml';
            process.env['PROPERTIES'] = `BUILD_ID:${process.env.BUILD_NUMBER}`;
        } else {
            process.env['MOCHA_FILE'] = './reports/last_recording_run/recording-report.xml';
            process.env['PROPERTIES'] = `BUILD_ID:${process.env.BUILD_NUMBER}`;
        }
    }
}

module.exports = ControllerWrapper;
