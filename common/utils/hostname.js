/**
 * Created by elad.benedict on 9/24/2015.
 */

var os = require('os');


function homedir() {
    var env = process.env;
    var home = env.HOME;
    var user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME;

    if (process.platform === 'win32') {
        return env.USERPROFILE || env.HOMEDRIVE + env.HOMEPATH || home || null;
    }

    if (process.platform === 'darwin') {
        return home || (user ? '/Users/' + user : null);
    }

    if (process.platform === 'linux') {
        return home || (process.getuid() === 0 ? '/root' : (user ? '/home/' + user : null));
    }

    return home || null;
}

function getLocalMachineFullHostname() {
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
        var hostnameCmd = os.hostname();
        if (!hostnameCmd)
        {
            throw new Error('Error getting hostname for local machine');
        }
        res = hostnameCmd.trim().replace(/(\r\n|\n|\r)/gm," "); // Remove line ending at the end
    }
    return res;
}

module.exports = {
    homedir: homedir,
    getLocalMachineFullHostname: getLocalMachineFullHostname
};
