var http = require("http");
var logger = require('../common/logger').getLogger("Controller");


class MonitorServer {
    constructor(onStatRequest) {
        this.httpServer = http.createServer(function(request, response) {
            try {
                var url=request.url;
                if (url.indexOf("stat")>-1) {
                    response.writeHead(200, {"Content-Type": "application/json"});
                    response.end(JSON.stringify(onStatRequest()));
                    return;
                }

                if (url.indexOf("info")>-1) {
                    response.writeHead(200, {"Content-Type": "application/json"});
                    var content= {
                        uptime: process.uptime(),
                        nodeVersion: process.version

                    };
                    var re = /\/v(.*)\/lib/.exec(__dirname);
                    if (re != null && re.length === 2) {
                        content.version=re[1];
                    } else {
                        content.version=__dirname;
                    }
                    response.end(JSON.stringify(content));

                    return;
                }

                response.writeHead(404);
                response.end();
            }catch(e) {

                logger.info("Exception returning response to monitor server", e, e.stack);
            }
        })
    }

    listen(port) {
        this.httpServer.listen(port);
    }
}



module.exports= MonitorServer