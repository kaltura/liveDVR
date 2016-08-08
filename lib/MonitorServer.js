var http = require("http");
var logger = require('../common/logger').getLogger("Controller");


var re = /\/v?([^\/]*)\/lib/.exec(__dirname);
if (re != null && re.length === 2) {
    app_version=re[1];
} else {
    app_version=__dirname;
}


class MonitorServer {
    constructor(onStatRequest) {
        var _this=this;
        this._regexes = [];


        this.register('/stat',(req,res)=> {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(onStatRequest()));
        });

        this.register('/info',this.info);


        this.httpServer = http.createServer(function(request, response) {
            try {


                var url=request.url;

                for (const reg of  _this._regexes) {
                    var re=reg[0].match(url);
                    if (re) {
                        reg[1].bind(_this)(request,response);
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
        content.version=app_version;
        response.end(JSON.stringify(content));

    }
}


module.exports= MonitorServer
