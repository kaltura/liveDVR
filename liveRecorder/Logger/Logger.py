from logging.config import dictConfig
import logging
import sys
from Config.config import get_config


DEFAULT_LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
}


def init_logger(log_file_name):

    dictConfig(DEFAULT_LOGGING)

    logging.basicConfig(
        filename=log_file_name,
        level=logging.DEBUG,
        format='[%(asctime)s.%(msecs)d][%(process)d/%(threadName)s] [%(levelname)s] [%(name)s]: [%(funcName)s():%(lineno)s] %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    file_handler = logging.handlers.TimedRotatingFileHandler(log_file_name, when="d", interval=1, backupCount=30)
    file_handler.setLevel(get_config('log_level'))

    if get_config('log_to_console', bool) is True:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(get_config('log_level'))
        console_formatter = logging.Formatter(
            '[%(process)d/%(threadName)s][%(levelname)s] [%(name)s] [%(funcName)s():%(lineno)s] %(message)s')
        console_handler.setFormatter(console_formatter)
        logging.root.addHandler(console_handler)

    logging.root.setLevel(get_config('log_level'))
    logging.root.addHandler(file_handler)

    return


