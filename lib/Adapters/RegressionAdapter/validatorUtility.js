/**
 * Created by lilach.maliniak on 17/07/2016.
 */
var _ = require('underscore');
var fs = require('fs');
var qio = require('q-io/fs');
var ErrorUtils = require('../../utils/error-utils');
var Q = require('q');
var _ = require('underscore');
var util=require('util');

function validate(do_validate, errors) {

    // todo: consult with Guy what is better, to pass all params in this or as separate args.
    var that = this;
    var diff = {};
    var valid = true;
    let deferred = Q.defer();

   try {
       if (do_validate && errors === undefined) {
           // prepare list of all the items in regression results ground truth that
           // are different or do not exist in results of this test run
            _.each(that.this_run_results, function (flavor_obj, flavorId) {
                if (that.flavors.indexOf(flavorId) > -1) {
                   that.logger.debug('[%s] %s: %s', that.entryId, flavorId, JSON.stringify(that.this_run_results[flavorId], null, 2));
                   diff[flavorId] = {};
                   // prepare array of all different items between this_run_results and results_ground_truth
                    _.each(flavor_obj, function (value, subject) {
                        if (subject.localeCompare('ts') === 0 || subject.localeCompare('m3u8') === 0) {
                            diff[flavorId][subject] = [];
                            var res = _.filter(_.keys(value), (function (key) {
                                return that.regression_results_db[flavorId][subject][key] === undefined ||
                                    !isNaN(value[key]) && parseInt(value[key]) != parseInt(that.regression_results_db[flavorId][subject][key]) ||
                                    isNaN(value[key]) && value[key].localeCompare(that.regression_results_db[flavorId][subject][key]) != 0
                            }));
                            diff[flavorId][subject] = res;
                            valid = res.length === 0 && valid;
                        }
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
       else if (errors != undefined) {
           diff['result'] = 'regression test failed';
           _.extend(diff, errors);
       }
       else {
            diff['result'] = 'validation skipped. config \'override\' value=true';
       }
       var result_path = that.fullpath + that.entryId + '_regression_test_result.json';
       let content = JSON.stringify(diff, null, 2);
       let latest_results_fullPath = `${that.latest_regression_path}${that.entryId}_regression_test_result.json`;

       // save diff
       qio.write(latest_results_fullPath, content)
           .then(() => {
               that.logger.debug(`[${that.entryId}] successfully saved regression test result to ${latest_results_fullPath}`);
               return  qio.write(result_path, content);
           })
           .catch((err) => {
               that.logger.error(`[${that.entryId}] failed to save regression test result to ${latest_results_fullPath}. Error: ${ErrorUtils.error2string(err)}`);
           })
           .then(function()
           {
               let result_msg = util.format('[%s] successfully saved regression test result to %s. content=[%s]', that.entryId, result_path, content);
               console.log(result_msg);
               that.logger.debug(result_msg);

               if (valid) {
                   that.logger.info('[%s] %s', that.entryId, diff['result']);
                   deferred.resolve();
               }
               else {
                   result_msg = util.format('[%s] regression test failed!!!', that.entryId);
                   console.log(result_msg);
                   that.logger.info(result_msg);
                   if (errors) {
                       deferred.reject(errors);
                   } else {
                       deferred.reject(-2);
                   }
               }
           })
           .catch(function (err) {
               that.logger.error('[%s] failed to save regression test result to %s. Error: %s', that.entryId, result_path, ErrorUtils.error2string(err));
               if (valid && !errors) {
                   deferred.reject(-4);
               } else {
                   deferred.reject(errors);
               }
           });
    }

    return deferred.promise;
}

module.exports = {
    validateRegressionResults : validate
}
