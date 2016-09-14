/**
 * Created by lilach.maliniak on 21/08/2016.
 */
var _ = require('underscore');
var config = require('../../../common/Configuration');
var HlsChecksumRegressionValidator = require('./hlsChecksumRegressionValidator');
var HlsAnalysisRegressionValidator = require('./hlsAnalysisRegressionValidaotor');
var analysis = config.get('regressionAdapter').analysis;

var getValidator = function(entryConfig, flavors, last_chunklist_index) {

    if (analysis) {
        return new HlsAnalysisRegressionValidator(entryConfig, flavors, last_chunklist_index);
    } else {
        return new HlsChecksumRegressionValidator(entryConfig, flavors, last_chunklist_index);
    }
}

module.exports = {
    getValidator: getValidator
}

