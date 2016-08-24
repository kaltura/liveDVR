from logging.config import dictConfig
import logging
import os
import sys



DEFAULT_LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
}


def init_logger():


    __root__ = os.path.dirname(__file__)
    path = __root__ + '/log'
    filename = 'live-testing.log'

    if not os.path.isdir(path):
        os.makedirs(path)

    logfullpath = '%s/%s' % (path, filename)

    dictConfig(DEFAULT_LOGGING)

    logging.basicConfig(
        filename=logfullpath,
        level=logging.DEBUG,
        format='[%(asctime)s.%(msecs)d][%(process)d/%(threadName)s] [%(levelname)s] [%(name)s]: [%(funcName)s():%(lineno)s] %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    file_handler = logging.handlers.RotatingFileHandler(logfullpath, maxBytes=10485760, backupCount=300,
                                                        encoding='utf-8')
    file_handler.setLevel(logging.DEBUG)

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG)
    console_formatter = logging.Formatter('[%(process)d/%(threadName)s][%(levelname)s] [%(name)s] [%(name)s] [%(funcName)s():%(lineno)s] %(message)s')
    console_handler.setFormatter(console_formatter)

    logging.root.setLevel(logging.INFO)
    logging.root.addHandler(file_handler)
    logging.root.addHandler(console_handler)

    return


