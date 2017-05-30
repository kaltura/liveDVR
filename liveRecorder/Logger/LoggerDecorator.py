import logging


def logger_decorator(class_name, decorate):
    logger_info = class_name + '][' + decorate
    return logging.getLogger(logger_info)


def log_subprocess_output(process, title, logger):
    header = "[{}] [pid={}]".format(title, process.pid)
    while True:
        nextline = process.stdout.readline()
        if nextline == '' and process.poll() is not None:
            break
        logger.info(header + ' %r', nextline)
