/**
 * Created by lilach.maliniak on 21/08/2016.
 */
const Q = require('q');

class RegressionValidatorBase {

    constructor(config, flavors, chunklistIndexes) {
        this.entryId = config.entryId;
        this.flavors = flavors;
        this.config = config.validator;
        this.last_chunklist_index = chunklistIndexes.end_index;
        this.start_chunklist_index = chunklistIndexes.start_index;
    }

    init() {};
    validateAllFlavors(index) { return Q.reject('not implemented'); };
    saveResultsToFile(reason) { return Q.reject('not implemented'); };
    isEntryConfigValid() {
        if (!this.start_chunklist_index || !this.last_chunklist_index ||
            this.start_chunklist_index === -1 || this.last_chunklist_index === -1
            || isNaN(this.start_chunklist_index) || isNaN(this.last_chunklist_index) ||
            this.start_chunklist_index >= this.last_chunklist_index) {
            return false;
        } else {
            return true;
        }
    }
}

RegressionValidatorBase.prototype.createDestinationDir = function() {};
RegressionValidatorBase.prototype.addChunklist = function() {};
RegressionValidatorBase.prototype.validateResults = function() {};
RegressionValidatorBase.prototype.validateSingleFlavor = function(flavorId, index) {};

module.exports = RegressionValidatorBase;