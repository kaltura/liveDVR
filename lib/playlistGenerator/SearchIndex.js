/**
 * Created by igors on 24/11/2016.
 */

const _ = require('underscore')
const path = require ('path')

class SearchIndex {
    constructor(){
        this.map = new Map();
    }

    getItemHash(item){
        return path.basename(item)
    }

    add(item){
        item = this.getItemHash(item)
        let index = this.map.get(item) || 0
        this.map.set(item,index + 1);
    }

    remove(item){
        item = this.getItemHash(item)
        let index = this.map.get(item)
        if(_.isNumber(index) && --index > 0) {
            this.map.set(item, index);
        } else {
            this.map.delete(item);
        }
    }
    has (item){
        item = this.getItemHash(item)
        return this.map.has(item);
    }
}

module.exports = SearchIndex;
