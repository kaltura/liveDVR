/**
 * Created by igors on 24/11/2016.
 */

const _ = require('underscore')
const path = require ('path')
const loggerModule = require('../../common/logger')

class SearchIndex {
    constructor(loggerInfo){
        this.map = new Map();
        this.logger = loggerModule.getLogger("SearchIndex", loggerInfo);
    }

    getItemHash(item){
        return path.basename(item)
    }

    add(item){
        item = this.getItemHash(item)
        let index = this.map.get(item) || 0
        this.map.set(item,++index);
        this.logger.trace("add.item %s => %d",item,index);
    }

    remove(item){
        item = this.getItemHash(item)
        let index = this.map.get(item)
        if(_.isNumber(index) && --index > 0) {
            this.logger.trace("remove.item %s => %d",item,index);
            this.map.set(item, index);
        } else {
            this.logger.trace("remove.item %s => 0",item);
            this.map.delete(item);
        }
    }
    has (item){
        item = this.getItemHash(item)
        this.logger.trace("has.item %s",item);
        return this.map.has(item);
    }
}

module.exports = SearchIndex;
