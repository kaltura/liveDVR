/**
 * Created by ron.yadgar on 01/01/2017.
 */
const Q = require('q');
const qio = require('q-io/fs');
const path = require('path');
const _ = require('underscore');
const ErrorUtils = require('./utils/error-utils');
const logger = require('../common/logger').getLogger("EventManager");
const config = require('./../common/Configuration');
class EventManager {
    constructor() {
        this.modules = [];
        let modulesConfig = config.get('plugins');
        _.each(modulesConfig, (module)=>{
            if (module.enable){
                logger.info("Found module [%s] enable", module.name);
                let modulePath = path.join('plugins',module.name, module.fileName);
                let moduleObj = require('./'+ modulePath);
                let moduleInstance = new moduleObj(module);
                this.modules.push(moduleInstance);
            }
        });


    }
    getEvents(entryObj) {
        let observers = [];
        _.each(this.modules, (module)=>{
            let observer = module.getEvents(entryObj);
            if (observer != undefined){
                logger.info("[%s] Found module [%s] subscribed to %s",entryObj.entryId, module.name,  _.keys(observer));
                observers.push(observer);
            }
        })
        return observers
    }
}
let eventManager = new EventManager()
module.exports = eventManager