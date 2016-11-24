/**
 * Created by igors on 24/11/2016.
 */

_ = require('underscore')

class SearchIndex {
    constructor(){
        this.map = new Map();
    }

    add(item){
        let index = this.map.get(item) || 0
        this.map.set(item,index + 1);
    }

    remove(item){
        let index = this.map.get(item)
        if(_.isNumber(index) && --index > 0) {
            this.map.set(item, index - 1);
        } else {
            this.map.delete(item);
        }
    }
    has (item){
        return this.map.has(item);
    }
}

module.exports = SearchIndex;
