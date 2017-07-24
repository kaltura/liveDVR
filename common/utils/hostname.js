/**
 * Created by elad.benedict on 9/24/2015.
 */

const os = require('os');
const child_process = require('child_process');


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
    let res = "HOSTNAME_PLACEHOLDER";
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
        res = child_process.execSync('hostname -f').toString().trim()
    }
    return res;
}

module.exports = {
    homedir: homedir,
    getLocalMachineFullHostname: getLocalMachineFullHostname
};
