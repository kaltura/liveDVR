/**
 * Created by lilach.maliniak on 21/08/2017.
 */

/* convert time in msec to other time unit, return a string with fixed digits after decimal point
 *  @value: duration of time in milliseconds
 *  @numFixed: number of digits after the decimal point
 *  @divisor: number to divide the value to get desired units
 */
function durationToStringWithUnitsConversion(value, numFixed, divisor=1) {

    let convertedNumber = (value / divisor).toFixed(numFixed);
    return `${convertedNumber}`;
}

module.exports = {
    durationToString: durationToStringWithUnitsConversion
}