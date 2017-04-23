import logging


def logger_decorator(class_name, decorate):
    logger_info = class_name + '][' + decorate
    return logging.getLogger(logger_info)


def log_subprocess_output(logger, pipe, pid, title):
    header = "[" + title + "] [pid=" + pid + "]"
    for line in iter(pipe.readline, b''):  # b'\n'-separated lines
        logger.info(header + ' %r', line)
