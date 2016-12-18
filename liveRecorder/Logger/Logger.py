from logging.config import dictConfig
import logging
import sys
from Config.config import get_config


def init_logger(log_file_name):
    log_rotate_interval_days = get_config('log_rotate_interval_days', int)
    log_rotate_windows_files = get_config('log_rotate_windows_files', int)
    log_level = get_config('log_level')
    log_to_console = get_config('log_to_console', bool)

    file_handler = logging.handlers.TimedRotatingFileHandler(log_file_name, when="d", interval=log_rotate_interval_days, backupCount=log_rotate_windows_files)
    file_handler.setLevel(get_config('log_level'))
    file_formatter = logging.Formatter('[%(asctime)s.%(msecs)d][%(process)d/%(threadName)s] [%(levelname)s] [%(name)s]: [%(funcName)s():%(lineno)s] %(message)s', datefmt='%Y-%m-%d %H:%M:%S')

    file_handler.setFormatter(file_formatter)
    if log_to_console is True:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(log_level)
        console_formatter = logging.Formatter(
            '[%(process)d/%(threadName)s][%(levelname)s] [%(name)s] [%(funcName)s():%(lineno)s] %(message)s')
        console_handler.setFormatter(console_formatter)
        logging.root.addHandler(console_handler)

    logging.root.setLevel(log_level)
    logging.root.addHandler(file_handler)
    return


