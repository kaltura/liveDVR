/**
 * Created by lilach.maliniak on 13/08/2017.
 */

function durationSecondsToString(durationSec) => {
    let durationString = ('0'+Math.floor(durationSec/3600) % 24).slice(-2)+':'+('0'+Math.floor(durationSec/60) % 60).slice(-2)+':'+('0' + durationSec % 60).slice(-2);
    return durationString;
}

module.exports = {
    durationSecondsToString : durationSecondsToString
}