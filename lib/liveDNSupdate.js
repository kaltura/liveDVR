
const config = require('../common/config/config.json');
const request = require('request');
const util = require('util');
const fs = require('fs');
const os = require('os');
const execSync = require('child_process').execSync;
const prequest = util.promisify(request);

const prometheus_file="/etc/node_exporter/data/live_publish_health.prom";
const maintance_file="/opt/kaltura/maintenance";

var report= {
    maintenance: fs.existsSync(maintance_file),
    alive: 1,
    versions: {
        node: "",
        liveController: "",
        wowza: "",
        jar: ""
    },
    wowzaUptime:0,
    liveControllerUptime:0,
    cpu: 0,
    wowzaCpu: 0,
    encoderUsage: 0,
    decoderUsage: 0,
    localCpuUsage: 0,
    coreCount: 0,
    inputStreams: 0,
    outputStreams: 0,
    entries: 0,
    dc: 0
}


async function getWowzaInfo() {
    try {
        let wowzaHost = config.mediaServer.wowzaHost ? config.mediaServer.wowzaHost : config.mediaServer.hostname;
        let metadataHostName = config.mediaServer.wowzaMetadataHost ? config.mediaServer.wowzaMetadataHost : wowzaHost;
        let r = {
            url: `http://${config.mediaServer.user}:${config.mediaServer.password}@${metadataHostName}:8086/diagnostics/info`,
            headers: {"Accept": "application/json"}
        };

        let response = await prequest(r);
        let j = JSON.parse(response.body);
        let serverHeader=response.headers["server"]
        report.encoderUsage=j.gpuUsageEncoder || report.encoderUsage;
        report.decoderUsage=j.gpuUsageDecoder || report.decoderUsage;
        report.wowzaCpu=j.cpuUsage;
        report.entries=j.entriesCount;
        report.outputStreams=j.outputStreamsCount;
        report.inputStreams=j.inputStreamsCount;
        report.versions.wowza=serverHeader.replace("WowzaStreamingEngine/","");
        report.versions.jar=j.version;
        report.wowzaUptime=parseInt(j.timeRunning);
    }catch(e) {
        console.warn(e);
        report.alive=0;
    }

}




async function getLiveControllerInfo() {
    try {
        let r = {
            url: `http://${config.mediaServer.hostname}:43900/info`,
            headers: {"Accept": "application/json"}
        };

        let response = await prequest(r);
        let j = JSON.parse(response.body);
        report.versions.node=j.nodeVersion;
        report.versions.liveController=j.version;
        report.liveControllerUptime=j.uptime;
    }catch(e) {
        report.alive=0;
        console.warn(e);
    }

}


function save_prom_file() {

    let map={
        "live_publish_wowza_cpu": report.wowzaCpu,
        "live_publish_encoder_usage": report.encoderUsage,
        "live_publish_decoder_usage": report.decoderUsage,
        "live_publish_local_cpu": report.localCpuUsage,
        "live_publish_alive": report.alive,
        "live_publish_maintenance": report.maintenance,
        "live_publish_input_streams": report.inputStreams,
        "live_publish_output_streams": report.outputStreams,
        "live_publish_input_entries": report.entries
    }

    let content=Object.entries(map).map(([k,v])=> {
        return `${k} ${v}`;
    });

    fs.writeFileSync(prometheus_file+".tmp",content.join("\n"));
    fs.rename(prometheus_file+".tmp",prometheus_file);

}

//let res=execSync(`top -bn 1 | awk 'NR>7{s+=$9} END {print s/'${coreCount}'}' | awk '{print int($1+0.5)}'`)

async function collectReport() {
    await Promise.all([getWowzaInfo(), getLiveControllerInfo()])
    try {
        save_prom_file();
    }catch(e) {
        console.warn(e);
    }
}



collectReport();
