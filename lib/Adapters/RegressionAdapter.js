
var Q = require('q');
var _ = require('underscore');
var config = require('../../common/Configuration');
var BaseAdapter=require('./BaseAdapter.js').BaseAdapter;
var StreamInfo=require('./BaseAdapter.js').StreamInfo;
var WowzaStreamInfo=require('./WowzaStreamInfo.js');
var util=require('util');
var url=require('url');
var http=require('http');
var fs=require('fs');
var networkClient = require('./../NetworkClientFactory').getNetworkClient();
var promUtils = require('../utils/promise-utils');
var m3u8Handler = require('../manifest/promise-m3u8');
var m3u8 = require('m3u8');
var m3u = require('m3u');

var basePath=__dirname + "/../../tests/resources/liveSessionData/";
var logger = require('../../common/logger')
//var logger = require('../../common/logger').getLogger("RegressionAdapter");
//var loggerModule = require('../../common/logger');
var weblogger = logger.getLogger("Regression-Web")
//var read_file_promise = require('fs-readfile-promise');

var regressionAdapterConfig = config.get('regressionAdapter');
var mediaServer = config.get('mediaServer');
var entriesInfo = config.get('regressionAdapter').entries;
var applicationName = mediaServer.applicationName;
var hostname = mediaServer.hostname;
var port = mediaServer.port;

var testHelper;


/* Todo
    1. decide with Guy on end/stop condition
    2. decide whether to run the validation during the download process or at the end.
 */

function readFile(res, full_path_file) {
    fs.readFile(full_path_file, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
}


function EntryInfo(entryId) {

    this.id = entryId;
    this.chunklist_index = {};
    this.playlist = {};
    this.read = {};
    this.playlist_initialized = false;
}


function TestHelper() {

    this.rootFolderPath =  regressionAdapterConfig['dataWarehouseRootFolderPath'] ;
    this.entries = {};
    this.logger = logger.getLogger('regressionAdapter');
    this.initEntries();
}

TestHelper.prototype.getFullLiveUrl  = function (entryId, flavor) {
    var path = '/' + applicationName + "/_definst_/" + entryId + "_" + flavor + "/";
    return url.format({
        protocol : 'http',
        hostname : hostname,
        port : port,
        pathname : path
    });
}

TestHelper.prototype.initEntries = function() {

    var that = this;

    _.each(entriesInfo, function(entryConfig) {
        var flavors = entryConfig.flavorParamsIds.split(',');
        that.entries[entryConfig.entryId] = new EntryInfo(entryConfig.entryId);

        _.each(flavors, function (id) {
            that.entries[entryConfig.entryId].chunklist_index[id] = 10;
            that.entries[entryConfig.entryId].read[id] = false;
        });
    });
}

TestHelper.prototype.initPlaylist = function() {

    this.logger.debug("TestHelper initialization");

    var that = this;

    _.each(entriesInfo, function(entryConfig) {
        var flavors = entryConfig.flavorParamsIds.split(',');
        var mediaServerPlaylistUrl = that.getFullLiveUrl(entryConfig.entryId, 'all');
        var fullUrl = url.resolve(mediaServerPlaylistUrl, 'playlist.m3u8');

        // read and parse the playlist and assemble playlist per flavor
        return networkClient.read(fullUrl)
            .then(function (content) {
                that.initPlaylistPerFlavor(entryConfig.entryId, content);
            })
            .catch(function (error) {
                this.logger('Initialization of entryId failed with error %s. Failed to prepare playlist per flavor.', error);
            });
    });

}

TestHelper.prototype.initPlaylistPerFlavor = function (entryId, all_playlist) {

    var that = this;

    return m3u8Handler.parseM3U8(all_playlist, {'verbatim': true})
        .then(function (m3u8) {
            // build playlist per flavor
            _.each(m3u8.items.StreamItem, function (item) {

                var id = item.get('uri').split('/')[0];
                var writer = m3u.httpLiveStreamingWriter();

                // Adds a playlist as the next item preceeded by an EXT-X-STREAM-INF tag.
                writer.playlist('playlist.m3u8', {
                    bandwidth: item.get('bandwidth'), // required
                    uri: item.get('uri'),
                    resolution: item.get('resolution')[0] + 'x' + item.get('resolution')[1],
                });

                that.entries[entryId].playlist[id] = writer.toString();
            });
        })
        .then( function() {
            that.entries[entryId].playlist_initialized = true;
        })
        . catch( function(error) {
           that.logger.error('Failed to parse playlist content. Error = %s', error);
        });
}

TestHelper.prototype.getPlaylist = function(entryId, flavorId) {

    var playlist = '';

    if (!this.entries[entryId].read[flavorId]) {
        this.entries[entryId].read[flavorId] = true;
        playlist =  this.entries[entryId].playlist[flavorId];
    }
    else {
        logger.error('[%s-%s] bug in RegressionAdapter, trying to get master playlist more than once.', entryId, flavorId);
    }

    return playlist;
}

TestHelper.prototype.nextChunklist = function (entryId, flavorId) {

    if (this.isMinFlavor(entryId, flavorId)) {

        this.entries[entryId].chunklist_index[flavorId]++
    }

    return ("00000" + this.entries[entryId].chunklist_index[flavorId] ).slice(-6) + '_chunklist.m3u8';
}

TestHelper.prototype.isMinFlavor = function (entryId, flavorId) {

    var min = _.min(this.entries[entryId].chunklist_index);

    return (min === this.entries[entryId].chunklist_index[flavorId]);
}

TestHelper.prototype.prevChunklist = function (entryId, flavorId) {

    return ("00000" + (_.max([this.entries[entryId].chunklist_index[flavorId]-1,10])) ).slice(-6) + '_chunklist.m3u8';
}

TestHelper.prototype.validateFlavor = function (entryId, flavorId) {
    var that = this;
    // var chunklist_url = this.prevChunklist(entryId, flavorId);
    // http://localhost:8080/kLive\/smil:(.*)_all.smil\/(.*)\/chunklist.m3u8
    var url=util.format("http://localhost:8080/kLive/smil:%s_all.smil/%s/chunklist.m3u8",entryId, flavorId);
    return networkClient.read({ url: url, timeout: 10000 }).then(function(content) {
        return m3u8Handler.parseM3U8(content,{ verbatim: true})
    }).then(function (m3u8) {
        that.logger.warn('[%s-%s] **** SUCCESSFULLY VALIDATED ****  obj=[%s], url=[%s]', entryId, flavorId, m3u8, url);
    }).catch (function(e) {
        that.logger.error('[%s-%s] **** VALIDATION FAILED!!! **** error=[%s], url=[%s]', entryId, flavorId, e.message, url);
    });
}

TestHelper.prototype.resolveUrl = function(url, params) {

    var parsed = false;
    var re=/(.*)_definst_\/(.*)_(.*)\/(.*)/.exec(url);

    try {
        params.entryId = re[2];
        var relative_path = re[1]+ params.entryId;
        params.flavorId = re[3].split('/')[0];
        params.filename = re[4];
        var entry_path = testHelper.rootFolderPath;
        entry_path += relative_path;
        params.fullpath = entry_path;
        params.validate=false;

        // the order is very important!!!
        // call to isMinFlavor must precede the call to nextChunklist
        // otherwise the counter can increase the the value will no longer be the minimum resulting in unvalidated data

        // following code is meant for all chunklists download to be aligned
        if (params.filename.indexOf('chunklist.m3u8') > -1 ||
            params.filename.indexOf('playlist.m3u8') > -1 &&
            testHelper.entries[params.entryId].read[params.flavorId]) {
            params.validate = this.isMinFlavor(params.entryId, params.flavorId);
            var extended_filename = this.nextChunklist(params.entryId, params.flavorId);
            params.fullpath += '/' + params.flavorId + '/' + extended_filename;
        }
        // segments
        else if (params.filename.substr(-3).localeCompare('.ts') === 0) {
            params.fullpath += '/' + params.flavorId + '/' + params.filename;
        }
        // playlist
        else {
           // var mediaServerPlaylistUrl = testHelper.getFullLiveUrl(params.entryId, 'all');
           // params.fullpath = url.resolve(mediaServerPlaylistUrl, 'playlist.m3u8');
            params.fullpath += '/' + params.filename;
            params.playlist = true;
        }
        // Todo : make sure all the flavors chunklists are download is aligned.
        // this won't work if there is even single cunklist for single flavor that is missing in the
        // video entry repository
        // so, it is the responsibility of the Python live-testing application to make sure that
        // exact number of chunklist files with same names are downloaded.
        // otherwise there should be a mechanism to skip chunklists that are absent for one or more flavors

        parsed = true;
    } catch (e) {
        weblogger.error("Exception parsing url %s. Error: %s. Stack: %s", url, e.message, e.stack);
    }

    return parsed;
}

var httpMock=http.createServer(function(req, res) {

    var that = this;

    try {
         var params = {
             entryId: '',
             flavorId: '',
             fullpath: '',
             filename: '',
             validate: false,
             playlist: false
         };

        if (testHelper.resolveUrl(req.url, params)) {
            if (!params.playlist && testHelper.entries[params.entryId].playlist_initialized
                || (params.flavorId.indexOf('all') > -1)) {
                var p = Q.resolve();

                if (params.validate) {
                    p = testHelper.validateFlavor(params.entryId, params.flavorId);
                }

                p.finally(function () {
                    weblogger.debug('Reading [%s]', params.fullpath);
                    readFile(res, params.fullpath);
                    weblogger.debug('successfully read and validated [%s]', params.fullpath);
                });
            } else if (params.playlist) {
                res.writeHead(200);
                res.end(testHelper.getPlaylist(params.entryId, params.flavorId));
            }else {
                res.writeHead(404);
                res.end();
            }
        } else {
            res.writeHead(404);
            res.end();
        }
    }catch(e) {
        weblogger.error("Exception returning response to monitor server %s, %s", e.message, e.stack);
    }
}).listen(8888);

function RegressionAdapter() {
    BaseAdapter.call(this);
    testHelper = new TestHelper();
    testHelper.initPlaylist();
}

util.inherits(RegressionAdapter,BaseAdapter);

RegressionAdapter.prototype.getLiveEntries=function() {

    return Q.fcall(function() {

        var result = [];
        // read the entry Ids and fill the result array
        // with entriesInfo configuration
        _.each(entriesInfo,function(entry) {
            result.push({
                "entryId": entry.entryId,
                "flavorParamsIds": entry.flavorParamsIds,
                "serverType": entry.serverType,
                "maxChunkCount": regressionAdapterConfig.maxChunkCount,
                getStreamInfo: function () {
                    return new WowzaStreamInfo(this.entryId, this.flavorParamsIds,"");
                }
            })
        })
        return (result);
    })
}


module.exports = RegressionAdapter;

