/**
 * Created by elad.benedict on 1/18/2016.
 */

var qio = require('q-io/fs');
var Q = require('q');
var t = require('tmp');

module.exports = (function(){

    var tempNameP = Q.denodeify(t.tmpName);

    var writeFileAtomically = function(targetPath, content){
        return tempNameP().then(function(tempPath) {
            return qio.write(tempPath, content).then(function () {
                return qio.move(tempPath, targetPath);
            });
        });
    };

    res = {
        writeFileAtomically : writeFileAtomically
    };

    return res;

})();
