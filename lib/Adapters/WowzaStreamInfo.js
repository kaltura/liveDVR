/**
 * Created by gadyaari on 07/02/2016.
 */

const m3u8Parser = require('./../manifest/promise-m3u8');
const networkClient = require('./../NetworkClientFactory').getNetworkClient();
const Q = require('q');
const _ = require('underscore');
const url = require('url');
const util=require('util');
const StreamInfo=require('./BaseAdapter.js').StreamInfo;
const loggerModule = require('../../common/logger');
const config = require('../../common/Configuration');
const promiseUtils = require('../utils/promise-utils');


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
    let mediaServerBaseUrl = getFullLiveUrl(this._baseUrl, this.entryId, flavorId);
    let mediaServerChunklistUrl = url.resolve(mediaServerBaseUrl, 'chunklist.m3u8');
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
        })
        .catch(err => {
            this.logger.info(`URL response: ${err}`);
            return Q.reject();
        });
}

WowzaStreamInfo.prototype.getAllFlavors = function() {

    let flavorsArray = [];
    return promiseUtils.retryPromise(() => {
        //get all flavors that are not not ready
        let flavorsToTest = _.difference(this.flavorParamsIds, _.pluck(flavorsArray, 'name'));

        //check if chunklist exists and if there is at least one .ts
        let promiseArr = _.map(flavorsToTest, (flavorId) => {
            return addFlavor.bind(this)(flavorId, flavorsArray);
        });

        return promiseUtils.promisesAllFulfilled(promiseArr);
    }, 5000, config.get('numOfManifestRetries'), "All flavors are not ready")
    .then( () => {
        this.logger.debug('All flavors are up and ready');
        // In case any racing happened between async calls, make sure no duplicated flavors are returned
        return _.uniq(flavorsArray);
    }).catch( ()=> {
        if (flavorsArray.length === 0) {
            this.logger.warn("All flavors not ready yet");
            return Q.reject(new Error("Flavors not ready in wowza"));
        }
        else {
            this.logger.warn("Not all flavors were ready; continuing with %j",flavorsArray);
            return _.uniq(flavorsArray);
        }
    });
};
