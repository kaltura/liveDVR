/**
 * Created by lilach.maliniak on 21/08/2016.
 */

class RegressionValidatorBase {

    constructor(config, flavors, last_chunklist_index) {
        this.entryId = config.entryId;
        this.flavors = flavors;
        this.config = config.validator;
        this.last_chunklist_index = last_chunklist_index;
    }

    init() {};
    validateAllFlavors(index) {};
}

RegressionValidatorBase.prototype.createDestinationDir = function() {};
RegressionValidatorBase.prototype.addChunklist = function() {};
RegressionValidatorBase.prototype.saveResultsToFile = function() {};
RegressionValidatorBase.prototype.validateResults = function() {};
RegressionValidatorBase.prototype.validateSingleFlavor = function() {};

module.exports = RegressionValidatorBase;