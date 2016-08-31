/**
 * Created by lilach.maliniak on 06/08/2016.
 */

function logheader1(literals, ...values) {

    return '[' + values[0] + '-' + values[1] + '] <<<< ' + values[2] + ' >>>> ';

};

module.exports = {
    logHeader: logheader1
}
