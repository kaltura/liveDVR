/**
 * Created by lilach.maliniak on 21/08/2016.
 */
const Q = require('q');

class RegressionValidatorBase {

    constructor(config, flavors, last_chunklist_index) {
        this.entryId = config.entryId;
        this.flavors = flavors;
        this.config = config.validator;
        this.last_chunklist_index = last_chunklist_index;
    }

    init() {};
    validateAllFlavors(index) { return Q.reject('not implemented'); };
    saveResultsToFile(reason) { return Q.reject('not implemented'); };
}

RegressionValidatorBase.prototype.createDestinationDir = function() {};
RegressionValidatorBase.prototype.addChunklist = function() {};
RegressionValidatorBase.prototype.validateResults = function() {};
RegressionValidatorBase.prototype.validateSingleFlavor = function(flavorId, index) {};

module.exports = RegressionValidatorBase;