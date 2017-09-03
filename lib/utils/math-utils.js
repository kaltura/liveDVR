/**
 * Created by lilach.maliniak on 21/08/2017.
 */

/* convert time in msec to other time unit, return a string with fixed digits after decimal point
 *  @value: duration of time in milliseconds
 *  @numFixed: number of digits after the decimal point
 *  @divisor: number to divide the value to get desired units
 */
const SEC_IN_MSEC = 1000;
const MINUTE_IN_MSEC = 60000;
const HOUR_IN_MSEC = 3600000;

function durationToStringWithUnitsConversion(value, numFixed, divisor=1) {

    let convertedNumber = (value / divisor).toFixed(numFixed);
    return `${convertedNumber}`;
}

module.exports = {
    durationToString: durationToStringWithUnitsConversion,
    HOUR_IN_MSEC: HOUR_IN_MSEC,
    MINUTE_IN_MSEC: MINUTE_IN_MSEC,
    HOUR_IN_MSEC: HOUR_IN_MSEC

}