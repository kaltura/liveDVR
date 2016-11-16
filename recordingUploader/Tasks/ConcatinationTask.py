import os
from TaskBase import TaskBase
import urllib2
import re
import m3u8
from Config.config import get_config
# todo add timeout, and use m3u8 insted of regex


class ConcatenationTask(TaskBase):

    def __init__(self, param, logger_info):
        TaskBase.__init__(self, param, logger_info)
        concat_task_processing_dir = os.path.join(self.base_directory, self.__class__.__name__, 'processing')
        self.recording_path = os.path.join(concat_task_processing_dir, self.entry_directory)
        self.stamp_full_path = os.path.join(self.recording_path, 'stamp')
        self.url_base = get_config('nginx_url')
        self.url_base_entry = os.path.join(self.url_base, self.recorded_id)
        self.url_master = os.path.join(self.url_base_entry, 'master.m3u8')

    def find_source(self):
        m3u8_obj = m3u8.load(self.url_master)
        flavor_list = {}
        maxbandwidth = -1
        for element in m3u8_obj.playlists:
            flavor_list[element.stream_info.bandwidth] = element.absolute_uri
            if element.stream_info.bandwidth > maxbandwidth:
                maxbandwidth = element.stream_info.bandwidth
                maxbandwidth_url = element.absolute_uri
        if maxbandwidth is -1:
            msg = "Failed to find source from flavor list %s" % (str(flavor_list))
            raise ValueError(msg)

        self.logger.info("Got Bandwidths url pairs %s, find the source with the bandwidth [%s] url: [%s]",
                             str(flavor_list), maxbandwidth, maxbandwidth_url)
        return maxbandwidth_url

    def download_chunks_and_concat(self, chunks, output_full_path):

        with open(output_full_path, 'wb') as file_output: # todo should truncated the file
            self.logger.info("About to concat %d files from manifest into %s", len(chunks), output_full_path)
            for chunk in chunks:
                chunks_url = os.path.join(self.url_base_entry, chunk)
                chunk_bytes = self.download_file(chunks_url)
                self.logger.debug("Successfully downloaded from url %s, about to write it to %s", chunks_url, output_full_path)
                file_output.write(chunk_bytes)

    def download_file(self, url):
        self.logger.debug("About to request the url:%s ", url)
        return urllib2.urlopen(url).read()  # whats happen if faild to get, or getting timeout?

    @staticmethod
    def parse_m3u8(m3u8):
        regex = r"(.*.ts)$"
        matches = re.findall(regex, m3u8, re.MULTILINE)
        return matches

    def run(self):

        output_full_path = os.path.join(self.recording_path, self.output_filename)
        if os.path.isfile(output_full_path):
            self.logger.warn("file [%s] already exist", output_full_path)
            return
        url_source_manifest = self.find_source()
        playlist = self.download_file(url_source_manifest)
        self.logger.debug("load recording manifest : \n %s ", playlist)
        chunks = m3u8.loads(playlist).files
        self.download_chunks_and_concat(chunks, output_full_path)
        self.logger.info("Successfully concat %d files into %s", len(chunks), output_full_path)