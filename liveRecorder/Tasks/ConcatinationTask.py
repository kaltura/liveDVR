import base64
import collections
import hashlib
import os
import platform
import re
import subprocess
import urllib2
import glob

import m3u8
from Iso639Wrapper import Iso639Wrapper

from Config.config import get_config
from Logger.LoggerDecorator import log_subprocess_output
from TaskBase import TaskBase

# todo add timeout, and use m3u8 insted of regex

Flavor = collections.namedtuple('Flavor',  'url language')


class ConcatenationTask(TaskBase):

    nginx_port = get_config('nginx_port')
    nginx_host = get_config('nginx_host')
    secret = get_config('token_key')
    token_url_template = nginx_host + ":" + nginx_port +"/dc-0/recording/hls/p/0/e/{0}/"
    os_name = platform.system().lower()
    cwd = os.path.dirname(os.path.abspath(__file__))
    ts_to_mp4_convertor = os.path.join(cwd, '../bin/{}/ts_to_mp4_convertor'.format(os_name))

    def __init__(self, param, logger_info):
        TaskBase.__init__(self, param, logger_info)
        concat_task_processing_dir = os.path.join(self.base_directory, self.__class__.__name__, 'processing')
        self.recording_path = os.path.join(concat_task_processing_dir, self.entry_directory)
        self.stamp_full_path = os.path.join(self.recording_path, 'stamp')
        self.token_url = self.token_url_template.format(self.recorded_id)
        self.nginx_url = "http://" + self.token_url + "t/{0}"
        self.flavor_pattern = 'index-s(?P<flavor>\d+)'
        self.playlist_index_pattern = 'index-s(?P<flavor>\d+)-v(?P<video>\d+)(-a(?P<audio>\d+))?.m3u8'
        self.iso639_wrapper = Iso639Wrapper(logger_info)


    def tokenize_url(self, url):

        if self.secret is None:
            return 0
        dir_name = os.path.dirname(url)
        dir_name = re.sub(r'https?://', '', dir_name)
        token = "{0} {1}/".format(self.secret, dir_name)
        hash = hashlib.md5(token).digest()
        encoded_hash = base64.urlsafe_b64encode(hash).rstrip('=')
        return encoded_hash

    def extract_flavor_dict(self):
        self.logger.debug("About to load master manifest from %s" ,self.url_master)
        m3u8_obj = m3u8.load(self.url_master)
        flavors_list = []
        multi_audio = len(m3u8_obj.media) > 0

        for element in m3u8_obj.playlists:
            flavors_list.append(Flavor(
                url=element.absolute_uri,
                language='und'
            ))

        index_of_audio_flavor = len(flavors_list)
        for element in m3u8_obj.media:
            language = element.language
            # convert alpha_2 (iso639_1 format) to alpha_3 (iso639-3) check https://pypi.python.org/pypi/pycountry
            if len(element.language) == 2:
                language = self.iso639_wrapper.convert_language_to_iso639_3(unicode(language))
            flavors_list.append(Flavor(
                url=element.absolute_uri,
                language=language
            ))
        ''' compose playlist index in case of multiple audio'''
        index_of_video_flavor = 0
        if multi_audio:
            for element in m3u8_obj.playlists:
                result = re.search(self.playlist_index_pattern, element.absolute_uri)
                if result and 'audio' not in result.groups() and len(m3u8_obj.media) > 0:
                    flavor_obj = flavors_list[index_of_video_flavor]
                    result = re.search(self.flavor_pattern, flavor_obj.url)
                    video_flavor_id = result.group('flavor')
                    audio_item = flavors_list[index_of_audio_flavor]
                    result = re.search(self.flavor_pattern, audio_item.url)
                    audio_flavor_id = result.group('flavor')
                    merged_flavors_url = "{}/index-s{}-s{}.m3u8".format(flavor_obj.url.rsplit('/', 1)[0], video_flavor_id, audio_flavor_id)
                    new_flavor_obj = Flavor(
                        url=merged_flavors_url,
                        language=audio_item.language
                    )
                    flavors_list[index_of_video_flavor] = new_flavor_obj
                else:
                    error = "missing audio track in multiple audio recording"
                    raise ValueError(error)
                index_of_video_flavor += 1
        return flavors_list

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

    def get_flavor_id(self, url_postfix, single_flavor):
        if single_flavor:
            flavors_dirs = filter(os.path.isdir,
                                  [os.path.join(self.recording_path, f) for f in os.listdir(self.recording_path)])
            flavor_id = flavors_dirs[0].rsplit('/', 1)[-1]
        else:
            result = re.search(self.flavor_pattern, url_postfix)
            if not result:
                error = "Error running concat task, failed to parse flavor from url: [%s]", obj.url
                self.logger.error(error)
                raise ValueError(error)
            flavor_id = result.group('flavor')

        return flavor_id


    def run(self):

        command = self.ts_to_mp4_convertor + ' '
        token = self.tokenize_url(self.token_url)
        self.url_base_entry = self.nginx_url.format(token)
        self.url_master = os.path.join(self.url_base_entry, 'master.m3u8')
        flavors_list = self.extract_flavor_dict()
        single_flavor = len(flavors_list) == 1

        for obj in flavors_list:
            url_postfix = obj.url.rsplit('/', 1)[1]
            flavor_id = self.get_flavor_id(url_postfix, single_flavor)
            ts_output_filename = self.get_output_filename(flavor_id)
            output_full_path = os.path.join(self.recording_path, ts_output_filename)
            mp4_full_path = output_full_path.replace('.ts', '.mp4')
            command = command + ' ' + output_full_path + ' ' + mp4_full_path + ' ' + obj.language
            if os.path.isfile(output_full_path):
                self.logger.warn("file [%s] already exist", output_full_path)
                continue
            playlist = self.download_file(obj.url)
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


