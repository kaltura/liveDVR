var http = require("http");
var logger = require('../common/logger').getLogger("Controller");


var re = /\/v?([^\/]*)\/lib/.exec(__dirname);
if (re != null && re.length === 2) {
    app_version=re[1];
} else {
    app_version=__dirname;
}


class MonitorServer {
    constructor(prefix) {
        var _this=this;
        this._regexes = [];
        this.prefix = prefix;

        this.register('/info',this.info);

        this.httpServer = http.createServer(function(request, response) {
            try {


                var url=request.url;

                for (const reg of  _this._regexes) {
                    var re=url.match(reg[0]);
                    if (re) {
                        request.args = re.splice(1);
                        try {
                            reg[1].bind(_this)(request, response);
                        } catch(e) {
                            response.writeHead(500, {"Content-Type": "text/plain"});
                            response.end(e.toString());
                        }
                        return;
                    }
                }

                response.writeHead(404);
                response.end();
            }catch(e) {

                logger.info("Exception returning response to monitor server", e, e.stack);
            }
        })
    }

    listen(port) {
        logger.info("Listening on port %s", port);
        this.httpServer.listen(port);
    }

    register(regex,func) {
        this._regexes.push([regex,func]);
    }

    info(request,response) {
        response.writeHead(200, {"Content-Type": "application/json"});
        var content= {
            uptime: Math.floor(process.uptime()),
            nodeVersion: process.version
        };
        content.version = app_version;
        content.prefix = this.prefix;
        response.end(JSON.stringify(content) + '\n');

    }
}


module.exports= MonitorServer;
