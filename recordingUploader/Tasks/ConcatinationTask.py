import os
from Config.config import get_config
from TaskBase import TaskBase
import urllib2
import re



class ConcatenationTask(TaskBase):
    url_base = 'http://localhost:8080/live/hls/p/0/e/'


    @staticmethod
    def sorted_ls(path):
        mtime = lambda f: os.stat(os.path.join(path, f)).st_mtime
        return list(sorted(os.listdir(path), key=mtime))

    def __init__(self, param, logger_info):
        TaskBase.__init__(self, param, logger_info)
        concat_task_processing_dir = os.path.join(self.base_directory, self.__class__.__name__, 'processing')
        self.recording_path = os.path.join(concat_task_processing_dir, self.entry_directory)
        self.stamp_full_path = os.path.join(self.recording_path, 'stamp')
        self.url_base_entry = os.path.join(self.url_base, self.recorded_id)
        self.url_master = os.path.join(self.url_base_entry, 'master.m3u8')
        self.url_source_manifest = os.path.join(self.url_base_entry, 'index-f1.m3u8')  # todo how should I find the source

    def download_chunks_and_concat(self, chunks, output_full_path):
        with open(output_full_path, 'wb') as file_output: # todo should truncated the file
            self.logger.info("About to concat %d files from manifest into %s", len(chunks), output_full_path)
            for chunk in chunks:
                chunks_url = os.path.join(self.url_base_entry, chunk)
                chunk_bytes = self.download_file(chunks_url)
                self.logger.debug("Successfully downloaded from url %s, about to write it to %s", chunks_url, output_full_path)
                file_output.write(chunk_bytes)


    @staticmethod
    def download_file(url):
        return urllib2.urlopen(url).read()  # whats happen if faild to get, or getting timeout?

    @staticmethod
    def parse_m3u8(m3u8):
        regex = r"(.*.ts)$"
        matches = re.findall(regex, m3u8, re.MULTILINE)
        return matches

    def run(self):

        self.write_stamp()
        output_full_path = os.path.join(self.recording_path, self.output_filename)
        m3u8 = self.download_file(self.url_source_manifest)
        self.logger.debug("load recording manifest : %s ", m3u8)
        chunks = self.parse_m3u8(m3u8)
        self.download_chunks_and_concat(chunks, output_full_path)
        self.logger.info("Successfully concat %d files into %s", len(chunks), output_full_path)
        self.check_stamp()