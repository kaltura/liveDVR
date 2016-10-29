var configManinpulator = require('./RegressionConfig.js').getConfig();
var Q = require('q');
var _ = require('underscore');
var fs=require('fs');
var config = require('../../../common/Configuration');
var BaseTestAdapter=require('./../BaseAdapter.js').BaseTestAdapter;
var WowzaStreamInfo=require('./../WowzaStreamInfo.js');
var util=require('util');
var http=require('http');
var ErrorUtils = require('../../utils/error-utils');
var RegressionEngine = require('./RegressionEngine');
var weblogger =  require('../../../common/logger').getLogger("RegressionAdapter-Web");
var regressionAdapterConfig = config.get('regressionAdapter');
var mediaServer = config.get('mediaServer');
var entriesInfo = config.get('regressionAdapter').entries;


// Todo: find solution to following:
// Run folowing tests:
// 1) simulating stream that one or more flavors fail by intention.
// With current implementation (sync of all flavors download),
// the test will be blocked forever.
// 2) simulate disconnections (missing chunklists and overlap of media sequence)

if (!regressionAdapterConfig || !regressionAdapterConfig.enable) {
    return;
}

const master_playlist = {
    '1':   '#EXTM3U\n\
             #EXT-X-STREAM-INF:BANDWIDTH=5187246, URI="index-s32.m3u8", RESOLUTION=1280x720\n\
             playlist.m3u8',
    '2':   '#EXTM3U\n\
             #EXT-X-STREAM-INF:BANDWIDTH=1094569, URI="index-s33.m3u8", RESOLUTION=480x270\n\
             playlist.m3u8',
    '3':   '#EXTM3U\n\
             #EXT-X-STREAM-INF:BANDWIDTH=1447205, URI="index-s34.m3u8", RESOLUTION=640x360\n\
             playlist.m3u8',
    '4':   '#EXTM3U\n\
             #EXT-X-STREAM-INF:BANDWIDTH=2205365, URI="index-s35.m3u8", RESOLUTION=640x360\n\
             playlist.m3u8',
    '5':    '#EXTM3U\n\
             #EXT-X-STREAM-INF:BANDWIDTH=1601536, URI="index-s36.m3u8", RESOLUTION=1280x720\n\
             playlist.m3u8'
};

var regressionEngine;
var httpMock;

function readFile(res, full_path_file, entryId) {
    fs.readFile(full_path_file, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            weblogger.error('[%s] failed to read path=%s, from \'DATA WAREHOUSE\'. Error: %s', entryId, full_path_file, ErrorUtils.error2string(err));
        }
        res.writeHead(200);
        res.end(data);
    });
};

function createServer() {

    try {
        var port  = 64351;
        httpMock = http.createServer(function (req, res) {

            var that = this;

            try {
                var params = {
                    entryId: '',
                    flavorId: '',
                    fullpath: '',
                    filename: '',
                    validate: false,
                    parsed: false,
                    request_type: {
                        chunklist: false,
                        playlist: false,
                        ts: false
                    }
                };

                regressionEngine.resolveUrl(req.url, params)
                    .then(function () {
                        if (params.request_type.chunklist) {
                            regressionEngine.entries[params.entryId].promise_per_flavor[params.flavorId].promise
                                .then(function () {
                                    weblogger.info('Reading [%s], from \'DATA WAREHOUSE\', request url: [%s]', params.fullpath, req.url);
                                    readFile(res, params.fullpath, params.entryId);
                                    regressionEngine.entries[params.entryId].promise_per_flavor[params.flavorId] = Q.defer();
                                    weblogger.debug('successfully read [%s], from \'DATA WAREHOUSE\'', params.fullpath);
                                })
                                .catch(function (err) {
                                    weblogger.error('[%s-%s] ##### is this is a bug???, check if %s exists %s', params.entryId, params.flavorId, params.fullpath, ErrorUtils.error2string(err));
                                    res.writeHead(400);
                                    res.end();
                                    regressionEngine.entries[params.entryId].promise_per_flavor[params.flavorId] = Q.defer();
                                });
                        } else if (params.request_type.ts) {
                            weblogger.debug('Reading [%s], from \'DATA WAREHOUSE\'', params.fullpath);
                            readFile(res, params.fullpath, params.entryId);
                            weblogger.debug('successfully read [%s], from \'DATA WAREHOUSE\'', params.fullpath);
                        } else if (params.request_type.playlist) {
                            res.writeHead(200);
                            res.end(master_playlist[params.flavorId]);
                            regressionEngine.entries[params.entryId].playlist_sent[params.flavorId] = true;
                        } else {
                            // Unprocessable Entity (WebDAV; RFC 4918)
                            // The request was well-formed but was unable to be followed due to semantic errors.
                            res.writeHead(422);
                            res.end();
                        }
                    })
                    .catch(function (err) {
                        weblogger.error('[%s-%s] ##### is this is a bug??? validateAllFlavors() returned reject with err %s', params.entryId, params.flavorId, ErrorUtils.error2string(err));
                        // 400 Bad Request
                        // The server cannot or will not process the request due to an apparent client error
                        // (e.g., malformed request syntax, invalid request message framing, or deceptive request routing)
                        res.writeHead(400);
                        res.end();
                        if (params.request_type.chunklist)
                            regressionEngine.entries[params.entryId].promise_per_flavor[params.flavorId] = Q.defer();
                    });
            } catch (err) {
                weblogger.error("Exception returning response to monitor server %s, from \'DATA WAREHOUSE\'", ErrorUtils.error2string(err));
            }
        });

        weblogger.debug('will try listening to %s:127.0.0.1 as parent = %s', port, (typeof (module.parent) === 'object'));

        if(module.parent) {
           httpMock.listen(port, '127.0.0.1');
        }

    } catch (err) {
        throw err;
    }
}

class RegressionAdapter extends BaseTestAdapter {

    constructor() {
        super();

        regressionEngine = new RegressionEngine(this);

        this.initPromise = regressionEngine.initEntries();

        this.initPromise
            .then(() => {
                regressionEngine.logger.info('RegressionAdapter successfully initialized.');
                createServer();
            })
            .catch((err) => {
                setTimeout(() => {
                    regressionEngine.gracefullyExit(err);
                }, 1000);
            });
    }
}

RegressionAdapter.prototype.getLiveEntries=function() {

    return this.initPromise.then(function() {

        var result = [];
        // read the entry Ids and fill the result array
        // with entriesInfo configuration
        _.each(entriesInfo,function(template) {
            var entry = _.extend(template, {
                getStreamInfo: function () {
                    return new WowzaStreamInfo(`http://localhost:64351/kLive-Regression`, this.entryId, this.flavorParamsIds, "");
                } });
            result.push(entry);
        });
        return (result);
    });
};


module.exports = RegressionAdapter;


