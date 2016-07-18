/**
 * Created by lilach.maliniak on 17/07/2016.
 */
var _ = require('underscore');
var Q = require('q');
var fs = require('fs');

function validate() {

    // todo: consult with Guy what is better, to pass all params in this or as separate args.
    var that = this;
    var deferred = Q.defer();
    var diff = {};
    var valid = true;
    var do_validate = !that.override;

   try {
       if (do_validate) {
           // prepare list of all the items in regression results ground truth that
           // are different or do not exist in results of this test run
           p = _.each(that.regression_results_db, function (flavor_obj, flavorId) {
               that.logger.debug('[%s] %s: %s', that.entryId, flavorId, JSON.stringify(flavor_obj, null, 2));
               diff[flavorId] = {};
               // prepare array of all different items between this_run_results and results_ground_truth
               q = _.each(flavor_obj, function (value, subject) {
                   diff[flavorId][subject] = [];
                   var res = _.filter(_.keys(value), (function (key) {
                       return that.this_run_results[flavorId][subject][key] === undefined ||
                           parseInt(value[key]) != parseInt(that.this_run_results[flavorId][subject][key])
                   }));
                   diff[flavorId][subject] = res;
                   valid = res.length === 0 && valid;
               });

           });
       }
    } catch (ex) {
       that.logger.error('[%s] caught exception during regression tests results validation. Validation didn\'t complete!!!. Error: %s', that.entryId, err);
       valid = false;
    } finally {
       if (valid && do_validate) {
           diff['result'] = 'regression test passed successfully';
       }
       // validation failed!
       else if (!valid) {
           diff['result'] = 'regression test failed';
       }
       else {
           diff['result'] = 'validation skipped. config \'override\' value=true';
       }
       var result_path = that.config.path;
       result_path += '/' + that.entryId + '_regression_test_result.log';
       // save diff
       fs.writeFile(result_path, JSON.stringify(diff, null, 2), function (write_err) {
           if (write_err) {
               that.logger.error('[%s] failed to save regression test validation errors to %s. Error: %s', that.entryId, result_path, write_err);
               deferred.reject('save test result failed');
           }
           else {
               that.logger.debug('[%s] successfully saved regression test result to %s.', that.entryId, result_path);
               if (valid) {
                   deferred.resolve('validation passed');
               }
               else {
                   deferred.reject('validation failed');
               }
           }
       });
    }

   return deferred.promise
       .then( function() {
           that.logger.info('[%s] regression test passed successfully', that.entryId);
        })
       .catch( function(err) {
           that.logger.info('[%s] regression test failed (reason: %s)!!!', that.entryId, err);
       });

}

module.exports = {
    validateRegressionResults : validate
}
