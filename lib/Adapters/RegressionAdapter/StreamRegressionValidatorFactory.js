/**
 * Created by lilach.maliniak on 21/08/2016.
 */
var _ = require('underscore');
var config = require('../../../common/Configuration');
var hlsStreamRegressionValidator = require('./hlsStreamRegressionValidator');
var hlsAnalysisStreamRegressionValidator = require('./hlsAnalysisStreamRegressionValidaotor');
var analysis = config.get('regressionAdapter').analysis;

var getValidator = function(entryConfig, flavors, last_chunklist_index) {

    if (analysis) {
        return new hlsAnalysisStreamRegressionValidator(entryConfig, flavors, last_chunklist_index);
    } else {
        return new hlsStreamRegressionValidator(entryConfig, flavors, last_chunklist_index);
    }
}


module.exports = {
    getValidator: getValidator
}

