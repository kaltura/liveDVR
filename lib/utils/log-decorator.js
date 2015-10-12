/**
 * Created by elad.benedict on 10/8/2015.
 */


module.exports = function decorate(logger, decorator) {

    var func = logger[loggingFuncName];
    logger[loggingFuncName] = function (msg, err) {
        func(decorator(msg), err)
    }

    return logger;
}
