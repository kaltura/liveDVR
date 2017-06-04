/**
 * Created by user on 01/06/2017.
 */
const BackendClient = require('../lib/BackendClient');
const ErrorUtils = require('../lib/utils/error-utils');
const Hostname = require('../common/utils/hostname');

// If hostname is transferred as a parameter take its value, otherwise get hostname of local machine.
let hostname = (process.argv[2]) ? process.argv[2] : Hostname.getLocalMachineFullHostname();
console.log("Adding server node [" + hostname + "]");
return BackendClient.addServerNode(hostname)
    .then((apiResult) => {
        console.log("API call headers: " + apiResult.headers);
        console.log("API call result: " + apiResult.result);
        if (apiResult.err || apiResult.result.objectType === 'KalturaAPIException') {
            throw new Error("Failed to add serverNode. " + ErrorUtils.error2string(apiResult.err));
        }
        console.log("ServerNode [" + hostname + "] was successfully added to server");
        return (apiResult.result);
    })
    .then((result) => {
        return BackendClient.enableServerNode(result.id);
    })
    .then((apiResult) => {
        if (apiResult.err || apiResult.result.objectType === 'KalturaAPIException') {
            throw new Error("Failed to enable serverNode. " + ErrorUtils.error2string(apiResult.err))
        }
        console.log("Server node [" + apiResult.result.name + "] was successfully enabled");
    })
    .catch((error) => {
        console.log("Error while adding new ServerNode. Error: " + ErrorUtils.error2string(error));
    });