/**
 * Created by ron.yadgar on 03/01/2017.
 */
const Q = require('q');
class BasePlugin{
    constructor(name) {
        this.name = name
    }
    getEvents(entryObj) {
        return Q.reject("[%s][%s] getEvents function is not implemented")
    }
}
module.exports = BasePlugin