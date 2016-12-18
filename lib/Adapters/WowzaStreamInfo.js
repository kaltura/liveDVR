/**
 * Created by gadyaari on 07/02/2016.
 */

var m3u8Parser = require('./../manifest/promise-m3u8');
var networkClient = require('./../NetworkClientFactory').getNetworkClient();
var Q = require('q');
var _ = require('underscore');
var url = require('url');
var util=require('util');
var StreamInfo=require('./BaseAdapter.js').StreamInfo;
var loggerModule = require('../../common/logger');
var config = require('../../common/Configuration');
var promUtils = require('../utils/promise-utils');


function WowzaStreamInfo(baseUrl,entryId, flavorParamsIds, sourceIp) {
    StreamInfo.call(this, entryId, flavorParamsIds);
    this._baseUrl=baseUrl;
    this.sourceIp = sourceIp;
    this.logger = loggerModule.getLogger("WowzaStreamingInfo", "[" + entryId + "] ");
}
util.inherits(WowzaStreamInfo, StreamInfo);

module.exports = WowzaStreamInfo;

// http://localhost:1935/kLive/_definst_/entryId_flavorId/playlist.m3u8
function getFullLiveUrl(baseUrl,entryId, flavor) {
    return baseUrl + "/_definst_/" + entryId + "_" + flavor + "/";

}


function addFlavor(flavorId, flavorsArray) {
    var mediaServerBaseUrl = getFullLiveUrl(this._baseUrl, this.entryId, flavorId);
    var mediaServerChunklistUrl = url.resolve(mediaServerBaseUrl, 'chunklist.m3u8');
    this.logger.info("Sending request for %s", mediaServerChunklistUrl);
    return networkClient.read(mediaServerChunklistUrl)
        .then((content) => {
            this.logger.info("Got response for %s %s", mediaServerChunklistUrl, content.body);
            return m3u8Parser.parseM3U8(content.body, {'verbatim': true})
        })
        .then((m3u8) => {

            if (m3u8 && m3u8.items && m3u8.items.PlaylistItem.length > 0) {
                let flavorObj = {
                    name: flavorId,
                    liveURL: mediaServerChunklistUrl,
                    entryId: this.entryId
                };
                flavorsArray.push(flavorObj);
                this.logger.info("Add flavor %j", flavorObj);

                return Q.resolve(flavorObj);
            } else {
                this.logger.info("Flavor %s not ready yet", flavorId);

                return Q.reject("Flavor not ready");
            }
        });
}

WowzaStreamInfo.prototype.getAllFlavors = function() {

    var flavorsArray = [];
    return promUtils.retryPromise( () => {
        //get all flavors that are not not ready
        let flavorsToTest = _.difference(this.flavorParamsIds,_.pluck(flavorsArray, 'name'));

        //check if chunklist exists and if there is at least one .ts
        let promiseArr = _.map(flavorsToTest, (flavorId) => {
            return addFlavor.bind(this)(flavorId, flavorsArray);
        });

        return Q.all(promiseArr);
    }, 5000, config.get('numOfManifestRetries'), "All flavors are not ready")
    .then( () => {
        return flavorsArray;
    }).catch( ()=> {
        if (flavorsArray.length === 0) {
            this.logger.warn("All flavors not ready yet");
            return Q.reject(new Error("Flavors not ready in wowza"));
        }
        else {
            this.logger.warn("Not all flavors were ready continuing with %j",flavorsArray);
            return flavorsArray;
        }
    });
};
