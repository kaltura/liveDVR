from logging.config import dictConfig
from logging.handlers import TimedRotatingFileHandler
import multiprocessing, threading, logging, sys, traceback
import logging
import sys
from Config.config import get_config


def init_logger(log_file_name):
    log_rotate_windows_files = get_config('log_rotate_windows_files', int)
    log_level = get_config('log_level')
    log_to_console = get_config('log_to_console', bool)

    file_handler = MultiProcessingLog(log_file_name, when='midnight', backup_count=log_rotate_windows_files)
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

# Credit to http://stackoverflow.com/a/894284/4787964
class MultiProcessingLog(logging.Handler):
    def __init__(self, filename, when='d', interval=1, backup_count=0, encoding=None, delay=False, utc=False):
        logging.Handler.__init__(self)

        self._handler = TimedRotatingFileHandler(filename, when=when, interval=interval, backupCount=backup_count, encoding=encoding, delay=delay, utc=utc)
        self.queue = multiprocessing.Queue(-1)

        t = threading.Thread(target=self.receive)
        t.daemon = True
        t.start()

    def setFormatter(self, fmt):
        logging.Handler.setFormatter(self, fmt)
        self._handler.setFormatter(fmt)

    def receive(self):
        while True:
            try:
                record = self.queue.get()
                self._handler.emit(record)
            except (KeyboardInterrupt, SystemExit):
                raise
            except EOFError:
                break
            except:
                traceback.print_exc(file=sys.stderr)

    def send(self, s):
        self.queue.put_nowait(s)

    def _format_record(self, record):
        # ensure that exc_info and args have been stringified.
        # Removes any chance of unpickleable things inside and possibly reduces message size sent over the pipe
        if record.args:
            try:
                record.msg = record.msg % record.args
            except TypeError as e:
                print(str(e))
                print(traceback.format_exc())
                record.msg = record.msg + ", args: %s" % str(record.args)
            record.args = None
        if record.exc_info:
            dummy = self.format(record)
            record.exc_info = None

        return record

    def emit(self, record):
        try:
            s = self._format_record(record)
            self.send(s)
        except (KeyboardInterrupt, SystemExit):
            raise
        except:
            self.handleError(record)

    def close(self):
        self._handler.close()
        logging.Handler.close(self)

