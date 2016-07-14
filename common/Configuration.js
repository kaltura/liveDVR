/**
 * Created by elad.benedict on 8/24/2015.
 */

var path = require('path');
var fs = require('fs');
var _ = require('underscore')
var hostname = require('./utils/hostname');
var events = require("events");
var util = require("util");
var Q = require("q");

module.exports = (function(){

    var machineName = hostname.getLocalMachineFullHostname();

    var configTemplateContent = fs.readFileSync(path.join(__dirname, './config/config.json.template'), 'utf8');
    var updatedConfigContent = configTemplateContent.replace('@HOSTNAME@', machineName);
    updatedConfigContent= updatedConfigContent.replace(/~/g,hostname.homedir());

    var configObj = JSON.parse(updatedConfigContent);

    var mappingFilePath = path.join(__dirname, 'config', 'configMapping.json');
    if (fs.existsSync(mappingFilePath))
    {
        var mappingContent = fs.readFileSync(mappingFilePath, 'utf8');
        var mappingObj=JSON.parse(mappingContent);
        _.each(mappingObj,function(value,key) {
            if (machineName.match(key)) {
                assignValues(value, configObj);
            }
        });
    }

    function assignValues(configPropertiesObj, configOutputObj) {
        for (var p in configPropertiesObj) {
            if (configPropertiesObj.hasOwnProperty(p)) {
                if (configPropertiesObj[p] instanceof Object) {
                    assignValues(configPropertiesObj[p], configOutputObj[p]);
                }
                else {
                    configOutputObj[p] = configPropertiesObj[p];
                }
            }
        }
    }

    // setup watch after configuration file
    var options = { file: path.join(__dirname, './config/config.json') };

    var inheritFromEmitter = function (){
        var that = this;

        var emitter = new events.EventEmitter();

        _.each(_.keys(events.EventEmitter.prototype),function(key){
            var member = events.EventEmitter.prototype[key];
            if(_.isFunction(member) && !_.has(that,key) ) {
                that[key] = member.bind(this);
            }
        },emitter);
    };

    var Nconf = {prototype:require('nconf')};

    var loadConfig = function(opts){
        var def = Q.defer();

        this.argv()
            .env()
            .stores.file.load(function(err){
                if(err){
                    def.reject(err);
                } else {
                    def.resolve();
                }
            });
        return def.promise;
    };

    function Configuration(){

        Nconf.prototype.constructor.call(this);

        fs.writeFileSync(options.file, JSON.stringify(configObj, null, 2));

        inheritFromEmitter.call(this);

        this.argv()
            .env()
            .file(options);

        startWatch.call(this);
    }

    util.inherits(Configuration,Nconf);

    var startWatch = function() {
        var that = this;

        try {
            if(that.fsWatch){
                var wOld = that.fsWatch;
                that.fsWatch = null;
                wOld.close();
            }
            that.fsWatch = fs.watch(options.file, {persistent: false})
                .on('rename',function(){
                    startWatch.call(that);
                })
                .on('change',watch.bind(this))
                .on('error', function (err) {
                    console.log('watch file %j error %j', options.file, util.inspect(err));
                    that.emit('configChangeError', err);
                }).on('open', function () {
                    console.log('opened watcher on file %j', options.file);
                });
        } catch(err){
            console.log('startWatch %j while setting a watch on file %j', util.inspect(err), options.file);
        }
    };

    var watch = function (event) {
        var that = this;

        try {
            loadConfig.call(this, options)
                .then(function(){
                that.emit('configChanged');
            })
                .catch(function(err){
                console.log('unable to reload configuration file %j due to %j', options.file, util.inspect(err));
                that.emit('configChangeError', err);
            })
                .done(function(){
                    if(event === 'rename') {
                        startWatch.call(that);
                    }
                });
        } catch (err) {
            console.log('unable to reload configuration file %j due to %j', options.file, util.inspect(err));
            that.emit('configChangeError', err);
            if(event === 'rename') {
                startWatch.call(that);
            }
        }
    };

    return new Configuration();

})();
