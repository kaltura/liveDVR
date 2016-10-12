import logging


def logger_decorator(class_name, decorate):
    logger_info = class_name + '][' + decorate
    return logging.getLogger(logger_info)
