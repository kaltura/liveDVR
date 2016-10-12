import os
import abc
from Logger.LoggerDecorator import logger_decorator
from socket import gethostname
from Config.config import get_config


class TaskBase(object):

    hostname = gethostname()
    base_directory = os.path.join(get_config('recording_base_dir'), hostname)

    def check_stamp(self):
        with open(self.stamp_full_path, "r") as stamp_file: # w+ since we truncated the file
            stamp = stamp_file.read()
            if stamp == self.timestamp:
                self.logger.debug("Stamp  %s is not changed", stamp)
            else:
                msg = "Stamps are not equal! process stamp:%s, found in file: %s, abort directory" % (self.timestamp, stamp)
                retries_file_path = os.path.join(self.recording_path, 'retries')
                with open(retries_file_path, "w+") as retries_file:
                    retries_file.write('0')
                raise ValueError(msg)

    def __init__(self, param, logger_info):
        self.timestamp = param['timestamp']
        self.recorded_id = param['recorded_id']
        self.entry_directory = param['directory']
        self.entry_id = param['entry_id']
        self.logger = logger_decorator(self.__class__.__name__, logger_info)
        self.output_filename = self.entry_directory+'_out.mp4'
        self.recording_path = os.path.join(self.base_directory, self.__class__.__name__, 'processing',
                                           self.entry_directory)
        self.stamp_full_path = os.path.join(self.recording_path, 'stamp')

    def write_stamp(self):

        self.logger.info("About to write stamp %s on %s", self.timestamp, self.recording_path)
        with open(self.stamp_full_path, "w+") as stamp_file:  # w+ since we truncated the file
            stamp_file.write(self.timestamp)

    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def run(self):
        """running the task"""
        return
