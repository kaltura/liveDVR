/**
 * Created by elad.benedict on 9/24/2015.
 */

var os = require('os');
var shell = require('shelljs');

module.exports = (function getLocalMachineFullHostname() {
    var res = "HOSTNAME_PLACEHOLDER";
    if (os.platform() == 'win32' || os.platform() == 'win64')
    {
        // On Windows
        res = process.env.COMPUTERNAME;
        if (process.env.USERDNSDOMAIN && process.env.USERDOMAIN !== "")
        {
            res +=  "." + process.env.USERDNSDOMAIN;
        }
    }
    else
    {
        // On Linux
        var hostnameCmd = shell.exec('hostname -f');
        if (hostnameCmd.code !== 0)
        {
            throw new Error('Error getting hostname for local machine');
        }
        res = hostnameCmd.output.replace(/\n$/, ''); // Remove line ending at the end
    }
    return res;
})();
