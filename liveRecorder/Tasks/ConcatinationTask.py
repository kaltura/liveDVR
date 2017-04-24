import os
from TaskBase import TaskBase
import urllib2
import re
import m3u8
from Config.config import get_config
import hashlib, base64
import subprocess
from Logger.LoggerDecorator import log_subprocess_output
# todo add timeout, and use m3u8 insted of regex


class ConcatenationTask(TaskBase):

    nginx_port = get_config('nginx_port')
    nginx_host = get_config('nginx_host')
    secret = get_config('token_key')
    token_url_template = nginx_host + ":" + nginx_port +"/dc-0/recording/hls/p/0/e/{0}/"
    ts_to_mp4_convertor = os.path.join(get_config('ts_to_mp4_convertor_path'), 'ts_to_mp4_convertor')

    def __init__(self, param, logger_info):
        TaskBase.__init__(self, param, logger_info)
        concat_task_processing_dir = os.path.join(self.base_directory, self.__class__.__name__, 'processing')
        self.recording_path = os.path.join(concat_task_processing_dir, self.entry_directory)
        self.stamp_full_path = os.path.join(self.recording_path, 'stamp')
        self.token_url = self.token_url_template.format(self.recorded_id)
        self.nginx_url = "http://" + self.token_url + "t/{0}"
        self.flavor_pattern = '[^-]\a*(?P<flavor>\d+)-[^-]'


    def tokenize_url(self, url):

        if self.secret is None:
            return 0
        dir_name = os.path.dirname(url)
        dir_name = re.sub(r'https?://', '', dir_name)
        token = "{0} {1}/".format(self.secret, dir_name)
        hash = hashlib.md5(token).digest()
        encoded_hash = base64.urlsafe_b64encode(hash).rstrip('=')
        return encoded_hash

    def extract_flavor_list(self):
        self.logger.debug("About to load master manifest from %s" ,self.url_master)
        m3u8_obj = m3u8.load(self.url_master)
        flavor_list = []
        for element in m3u8_obj.playlists:
            flavor_list.append(element.absolute_uri)

        return flavor_list

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
            self.logger.error("Error to concat file, removing file", output_full_path)
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

        command = self.ts_to_mp4_convertor + ' '
        token = self.tokenize_url(self.token_url)
        self.url_base_entry = self.nginx_url.format(token)
        self.url_master = os.path.join(self.url_base_entry, 'master.m3u8')
        flavors_manifest_list = self.extract_flavor_list()


        for url_source_manifest in flavors_manifest_list:
            url_postfix = url_source_manifest.rsplit('/', 1)[1]
            result = re.search(self.flavor_pattern, url_postfix)
            if not result:
                error = "Error running concat task, failed to parse flavor from url: [%s]", url_source_manifest
                self.logger.error(error)
                raise ValueError(error)
            ts_output_filename = self.get_output_filename(result.group('flavor'))
            output_full_path = os.path.join(self.recording_path, ts_output_filename)
            mp4_full_path = output_full_path.replace('.ts', '.mp4')
            command = command + ' ' + output_full_path + ' ' + mp4_full_path
            if os.path.isfile(output_full_path):
                self.logger.warn("file [%s] already exist", output_full_path)
                continue
            playlist = self.download_file(url_source_manifest)
            self.logger.debug("load recording manifest : \n %s ", playlist)
            chunks = m3u8.loads(playlist).files
            self.download_chunks_and_concat(chunks, output_full_path)
            self.logger.info("Successfully concat %d files into %s", len(chunks), output_full_path)
        self.convert_ts_to_mp4(command)

    def convert_ts_to_mp4(self, command):
        # convert the each flavor concatenated ts file to single mp4
        self.logger.debug('About to run TS -> MP4 conversion. Command: %s', command)
        process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        exitcode = process.wait()
        log_subprocess_output(self.logger, process.stdout, process.pid, "ffmpeg: ts->mp4")

        if exitcode is 0:
            self.logger.info('Successfully finished TS -> MP4 conversion')
        else:
            error = 'Failed to convert TS -> MP4. Error %d', process.returncode
            self.logger.error(error)
            raise RuntimeError(error)


    def get_output_filename(self, flavor):
        return self.output_filename + '_f' + flavor + '_out.ts'


