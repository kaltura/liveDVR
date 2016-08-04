/**
 * Created by lilach.maliniak on 17/07/2016.
 */
var _ = require('underscore');
var fs = require('fs');
var qio = require('q-io/fs');
var ErrorUtils = require('../../utils/error-utils');
var Q = require('q');
var _ = require('underscore');

function validate(do_validate, errors) {

    // todo: consult with Guy what is better, to pass all params in this or as separate args.
    var that = this;
    var diff = {};
    var valid = true;

   try {
       if (do_validate) {
           // prepare list of all the items in regression results ground truth that
           // are different or do not exist in results of this test run
            _.each(that.regression_results_db, function (flavor_obj, flavorId) {
                if (that.flavors.indexOf(flavorId) > -1) {
                   that.logger.debug('[%s] %s: %s', that.entryId, flavorId, JSON.stringify(that.this_run_results[flavorId], null, 2));
                   diff[flavorId] = {};
                   // prepare array of all different items between this_run_results and results_ground_truth
                    _.each(flavor_obj, function (value, subject) {
                       diff[flavorId][subject] = [];
                       var res = _.filter(_.keys(value), (function (key) {
                           return that.this_run_results[flavorId][subject][key] === undefined ||
                               !isNaN(value[key]) && parseInt(value[key]) != parseInt(that.this_run_results[flavorId][subject][key]) ||
                               isNaN(value[key]) && value[key].localeCompare(that.this_run_results[flavorId][subject][key]) != 0
                       }));
                       diff[flavorId][subject] = res;
                       valid = res.length === 0 && valid;

                   });
               } else {
                 that.logger.info('@@@@ skipping validation of flavors not configured for entry %s', that.entryId);
               }

           });
       }
    } catch (err) {
       that.logger.error('[%s] caught exception during regression tests results validation. Validation didn\'t complete!!!. Error: %s', that.entryId, ErrorUtils.error2string(err));
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
           if (error === undefined) {
               diff['result'] = 'validation skipped. config \'override\' value=true';
           }
           else {
               _.extend(diff, errors);
           }
       }
       var result_path = that.config.path;
       result_path += '/' + that.entryId + '_regression_test_result.json';
       // save diff
       return qio.write(result_path, JSON.stringify(diff, null, 2))
           .catch (function(err) {
               that.logger.error('[%s] failed to save regression test result to %s. Error: %s', that.entryId, result_path, ErrorUtils.error2string(err));
           })
           .then( function() {
               that.logger.debug('[%s] successfully saved regression test result to %s.', that.entryId, result_path);
               if (valid) {
                   that.logger.info('[%s] %s', that.entryId, diff['result']);
               }
               else {
                   that.logger.info('[%s] regression test failed!!!', that.entryId);
                   return Q.reject('regression failed');
               }
           })

    }

}

module.exports = {
    validateRegressionResults : validate
}
