/**
 * Created by lilach.maliniak on 21/08/2016.
 */

class StreamRegressionValidatorBase {

    constructor(config, flavors, last_chunklist_index) {
        this.entryId = config.entryId;
        this.flavors = flavors;
        this.config = config.validator;
        this.last_chunklist_index = last_chunklist_index;
    }
}

StreamRegressionValidatorBase.prototype.init = function() {};
StreamRegressionValidatorBase.prototype.createDestinationDir = function() {};
StreamRegressionValidatorBase.prototype.addChunklist = function() {};
StreamRegressionValidatorBase.prototype.saveResultsToFile = function() {};
StreamRegressionValidatorBase.prototype.validateResults = function() {};
StreamRegressionValidatorBase.prototype.validateSingleFlavor = function() {};

module.exports = StreamRegressionValidatorBase;