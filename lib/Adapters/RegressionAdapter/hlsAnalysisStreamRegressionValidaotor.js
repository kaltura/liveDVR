/**
 * Created by lilach.maliniak on 21/08/2016.
 */
var logger = require('../../../common/logger');
var StreamRegressionValidatorBase = require('./StreamRegressionValidatorBase');

class hlsAnalysisStreamRegressionValidator extends StreamRegressionValidatorBase {
    constructor(config, flavors, last_chunklist_index) {
        super(config, flavors, last_chunklist_index);

        this.logger = logger.getLogger('hlsAnalysisStreamRegressionValidator');

    }
}

module.exports = hlsAnalysisStreamRegressionValidator;