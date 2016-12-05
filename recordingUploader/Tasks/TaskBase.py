import os
import abc
from Logger.LoggerDecorator import logger_decorator
from socket import gethostname
from Config.config import get_config
from RecordingException import UnequallStampException


class TaskBase(object):

    hostname = gethostname()
    base_directory = os.path.join(get_config('recording_base_dir'), hostname)
    cron_jon_stamp = get_config('cron_jon_stamp')
    def check_stamp(self):
        with open(self.stamp_full_path, "r") as stamp_file:  # w+ since we truncated the file
            stamp = stamp_file.read()
            if stamp == self.cron_jon_stamp:
                self.logger.info("Entry has no stamp, since it was zombie!")
                self.duration = 0
                return
            if stamp == self.duration:
                self.logger.debug("Stamp  %s is not changed", stamp)
            else:
                msg = "Stamps are not equal! process stamp:[%s], found in file: [%s], abort directory" % (self.duration,
                                                                                                            stamp)
                raise UnequallStampException(msg)

    def __init__(self, param, logger_info):
        self.duration = param['duration']
        self.recorded_id = param['recorded_id']
        self.entry_directory = param['directory']
        self.entry_id = param['entry_id']
        self.logger = logger_decorator(self.__class__.__name__, logger_info)
        self.output_filename = self.entry_directory+'_out.ts'
        self.recording_path = os.path.join(self.base_directory, self.__class__.__name__, 'processing',
                                           self.entry_directory)
        self.stamp_full_path = os.path.join(self.recording_path, 'stamp')

    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def run(self):
        """running the task"""
        return
