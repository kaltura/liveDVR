import os
from TaskBase import TaskBase
import urllib2
import re
import m3u8
from Config.config import get_config
import hashlib, base64
# todo add timeout, and use m3u8 insted of regex


class ConcatenationTask(TaskBase):

    nginx_port = get_config('nginx_port')
    nginx_host = get_config('nginx_host')
    secret = get_config('token_key')
    token_url_template = nginx_host + ":" + nginx_port +"/dc-0/recording/hls/p/0/e/{0}/"

    def __init__(self, param, logger_info):
        TaskBase.__init__(self, param, logger_info)
        concat_task_processing_dir = os.path.join(self.base_directory, self.__class__.__name__, 'processing')
        self.recording_path = os.path.join(concat_task_processing_dir, self.entry_directory)
        self.stamp_full_path = os.path.join(self.recording_path, 'stamp')
        self.token_url = self.token_url_template.format(self.recorded_id)
        self.nginx_url = "http://" + self.token_url + "t/{0}"


    def tokenize_url(self, url):

        if self.secret is None:
            return 0
        dir_name = os.path.dirname(url)
        dir_name = re.sub(r'https?://', '', dir_name)
        token = "{0} {1}/".format(self.secret, dir_name)
        hash = hashlib.md5(token).digest()
        encoded_hash = base64.urlsafe_b64encode(hash).rstrip('=')
        return encoded_hash

    def find_source(self):
        self.logger.debug("About to load master manifest from %s" ,self.url_master)
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
        try:
            with open(output_full_path, 'wb') as file_output:
                failed_chunks = 0
                self.logger.info("About to concat [%d] files from manifest into [%s]", len(chunks), output_full_path)
                for chunk in chunks:
                    chunks_url = os.path.join(self.url_base_entry, chunk)
                    try:
                        chunk_bytes = self.download_file(chunks_url)
                        self.logger.debug("Successfully downloaded from url [%s], about to write it to [%s]", chunks_url, output_full_path)
                        file_output.write(chunk_bytes)
                    except urllib2.HTTPError as e:
                        if e.code == 404:
                            failed_chunks += 1
                            self.logger.error("Failed to download chunk [%s], got response 404", chunk)
                        else:
                            raise e
                if failed_chunks > 0:
                    self.logger.warn("Failed to download  [%s] chunks from [%s]", failed_chunks, len(chunks))
                    if failed_chunks == len(chunks):
                        raise urllib2.HTTPError(self.url_base_entry, 404, "Failed to download all chunks from manifest"
                                                , None, None)

        except urllib2.HTTPError as e:
            self.logger.error("Error to concat file %s, removing file", output_full_path)
            os.remove(output_full_path)
            raise e

    def download_file(self, url):
        self.logger.debug("About to request the url: [%s] ", url)
        return urllib2.urlopen(url).read()

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
        token = self.tokenize_url(self.token_url)
        self.url_base_entry = self.nginx_url.format(token)
        self.url_master = os.path.join(self.url_base_entry, 'master.m3u8')
        url_source_manifest = self.find_source()
        playlist = self.download_file(url_source_manifest)
        self.logger.debug("load recording manifest : \n %s ", playlist)
        chunks = m3u8.loads(playlist).files
        self.download_chunks_and_concat(chunks, output_full_path)
        self.logger.info("Successfully concat %d files into %s", len(chunks), output_full_path)