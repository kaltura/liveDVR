import base64
import collections
import hashlib
import os
import re
import subprocess
import urllib2
import errno
import collections

import m3u8

from Iso639Wrapper import Iso639Wrapper

from Config.config import get_config
from Logger.LoggerDecorator import log_subprocess_output
from TaskBase import TaskBase
from datetime import datetime
from BackendClient import *
from KalturaClient.Plugins.Core import KalturaEntryServerNodeType, KalturaEntryServerNodeRecordingStatus, \
    KalturaLiveEntryServerNodeRecordingInfo

Recording_Dcs_Info = collections.namedtuple('Recording_Dcs_Info', 'local remote')


# todo add timeout, and use m3u8 insted of regex

Flavor = collections.namedtuple('Flavor', 'url language')


class ConcatenationTask(TaskBase):
    nginx_port = get_config('nginx_port')
    nginx_host = get_config('nginx_host')
    max_session_duration_sec = get_config('session_duration')
    secret = get_config('token_key')
    token_url_template = nginx_host + ":" + nginx_port +"/dc-0/recording/hls/p/0/e/{0}/"
    cwd = os.path.dirname(os.path.abspath(__file__))
    ts_to_mp4_convertor = os.path.join(cwd, '../bin/ts_to_mp4_convertor')
    duration_diff_tolerance_sec = get_config('duration_diff_tolerance_sec')
    server_node_type = ['LIVE_PRIMARY', 'LIVE_BACKUP']

    def __init__(self, param, logger_info):
        TaskBase.__init__(self, param, logger_info)
        session_id = self.entry_id + '-' + self.recorded_id
        self.backend_client = BackendClient(session_id)
        concat_task_processing_dir = os.path.join(self.base_directory, self.__class__.__name__, 'processing')
        self.recording_path = os.path.join(concat_task_processing_dir, self.entry_directory)
        self.stamp_full_path = os.path.join(self.recording_path, 'stamp')
        self.token_url = self.token_url_template.format(self.recorded_id)
        self.nginx_url = "http://" + self.token_url + "t/{0}"
        self.flavor_pattern = 'index-s(?P<flavor>\d+)'
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
        self.logger.debug("About to load master manifest from %s", self.url_master)
        m3u8_obj = m3u8.load(self.url_master)
        flavors_list = []

        for element in m3u8_obj.playlists:
            flavors_list.append(Flavor(
                url=element.absolute_uri,
                language='und'
            ))

        for element in m3u8_obj.media:
            language = element.language
            # convert alpha_2 (iso639_1 format) to alpha_3 (iso639-3) check https://pypi.python.org/pypi/pycountry
            if len(element.language) == 2:
                language = self.iso639_wrapper.convert_language_to_iso639_3(unicode(language))
            flavors_list.append(Flavor(
                url=element.absolute_uri,
                language=language
            ))
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
                        self.logger.debug("Successfully downloaded from url [%s], about to write it to [%s]",
                                          chunks_url, output_full_path)
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

    def is_single_dc(self, nodes_list, entry_server_node_id):
        if len(nodes_list) == 1 and nodes_list[0].id == entry_server_node_id:
            return True
        return False

    def filter_by_recorded_entry_id(self, nodes_list):
        return [i for i in nodes_list.objects if self.is_recorded_entry_id_found(i.recordingInfo)]

    def is_recorded_entry_id_found(self, recorded_info_array):
        for recorded_info in recorded_info_array:
            if recorded_info.recordedEntryId == self.recorded_id:
                return True
        return False

    def is_valid_server_nodes(self, nodes_list, entry_server_node_id):
        duplicate_found = False
        correct_recording_status = True
        is_valid = True
        # check that there are is only single recordingInfo entry, in each dc, per recorded_entry_id
        for server_node in nodes_list.objects:
            if not is_valid:
                break
            start = 1
            for x in server_node.recordingInfo:
                for y in server_node.recordingInfo[start:]:
                    if y.recordedEntryId == x.recordedEntryId:
                       duplicate_found = True
                       self.logger.error('entry server node {}, has duplicate entry in RecordingInfo: [RecordingEntryId:{}, RecordingStatus:{}] and [RecordingEntryId: {}, RecordingStatus:{}]'.format(
                           server_node.id, y.recordedEntryId, y.recordingStatus, x.recordedEntryId, x.recordingStatus))
                       break
                start += 1
                if duplicate_found:
                    break
            if duplicate_found:
                break
            elif server_node.id == entry_server_node_id:
                incorrect_recording_status = [z for z in server_node.recordingInfo if z.recordedEntryId == self.recorded_id and
                                              (z.recordingStatus == KalturaEntryServerNodeRecordingStatus.DISMISSED or
                                               z.recordingStatus == KalturaEntryServerNodeRecordingStatus.DONE)]
                if len(incorrect_recording_status) > 0:
                    correct_recording_status = False

            is_valid = not duplicate_found and correct_recording_status

        return is_valid

    def get_recording_item(self, filtered_server_nodes):
        recording_item = [x for x in filtered_server_nodes.recordingInfo if x.recordedEntryId == self.recorded_id]
        return recording_item

    def get_recording_items(self, server_nodes, entry_server_node_id):
        for entry_server_node in server_nodes:
            if entry_server_node.id != entry_server_node_id:
                local_dc_recording_info = self.get_recording_item(entry_server_node)
            else:
                remote_dc_recording_info = self.get_recording_item(entry_server_node)
        return Recording_Dcs_Info(local=local_dc_recording_info, remote=remote_dc_recording_info)

    def should_process_as_single_dc(self, server_nodes, dc_type):
        should_process = True
        recording_item = self.get_recording_item(server_nodes[0])
        local_duration_sec = recording_item[0].duration / 1000

        # handle use case that couldn't find recordingInfo
        if len(recording_item) == 0:
            self.logger.error(
                'It is {} and couldn\'t find recordingInfo for recorderEntryId {}. Check if job was processed by remote DC. job won\'t be processed'.format(dc_type, self.recorded_id))
            should_process = False
        # verify that recordingStatus is valid
        elif recording_item[0].recordingStatus == KalturaEntryServerNodeRecordingStatus.STOPPED:
            self.logger.debug(
                'It is {} and recording was done by single DC, duration [{}] sec. Recording status is STOPPED. Job will be processed.'.format(dc_type, local_duration_sec))
            should_process = True

        elif recording_item[0].recordingStatus == KalturaEntryServerNodeRecordingStatus.ON_GOING:
            if recording_item[0].duration/1000 >= self.duration_diff_tolerance_sec:
                self.logger.debug(
                    'It is {} and recording was done by single DC, duration is max allowed [{}] sec ignoring status ON_GOING. Job will be processed.'.format(
                        dc_type, local_duration_sec))
                should_process = False
            else:
                self.logger.debug('It is {} and recording was done by single DC, duration [{}] sec, but status is ON_GOING. Job won\'t be processed.'.format(
                        dc_type, local_duration_sec))
                should_process = False
        else:
            self.logger.debug(
                'It is {} and recording was done by single DC, duration [{}] sec. Recording status is unexpected DONE/DISMISSED ({}, hence job won\'t be processed.'.format(
                    dc_type, local_duration_sec, recording_item.recordingStatus))
            should_process = False

        return should_process

    def should_process_as_redundant_dc(self, server_nodes, entry_server_node_id, server_type):
        should_process = False
        recording_item_per_dcs = self.get_recording_items(server_nodes, entry_server_node_id)
        int_server_type = int(server_type.value)
        dc_type = self.server_node_type[int_server_type]
        local_duration_sec = recording_item_per_dcs.local.duration/1000

        # handle use case of equal duration
        duration_diff_sec = abs(recording_item_per_dcs.local.duration - recording_item_per_dcs.remote.duration)
        if duration_diff_sec <= self.duration_diff_tolerance_sec:
            should_process = server_type == KalturaEntryServerNodeType.LIVE_PRIMARY
            if should_process:
                self.logger.debug(
                    'It is {} and recording duration equal between DCs, duration [{}] sec. Job will be processed'.format(dc_type, local_duration_sec))
            else:
                self.logger.debug(
                    'It is {} and recording duration equal between DCs, duration [{}] sec. Job won\'t be processed'.format(dc_type, local_duration_sec))

        # handle use case of max duration
        elif local_duration_sec >= self.max_session_duration_sec:
            self.logger.debug('It is {} and recording duration is max allowed [{}] sec. Job will be processed'.format(dc_type, local_duration_sec))
            should_process = True

        # handle use case of greater duration
        elif recording_item_per_dcs.local.duration > recording_item_per_dcs.remote.duration:

            # do not process job if entry is live
            if recording_item_per_dcs.local.recordingStatus == KalturaEntryServerNodeRecordingStatus.ON_GOING \
                    or recording_item_per_dcs.remote.recordingStatus == KalturaEntryServerNodeRecordingStatus.ON_GOING:
                self.logger.debug('It is {} and recording duraiton is greater, [{}] sec,  but entry is live in one or two DCs. Job won\'t be processed'.format(dc_type, local_duration_sec))
                should_process = False
            else:
                self.logger.debug(
                    'It is {} and recording duration is greater from remote dc, , [{}] sec, Job will be processed'.format(dc_type, local_duration_sec))
                should_process = True

        # handle use case of lower duration
        else:
            # process job if remote status is DISMISSED
            if recording_item_per_dcs.remote.recordingStatus == KalturaEntryServerNodeRecordingStatus.DISMISSED:
                self.logger.debug('it is {} and recording duraiton is lower, [{}] sec, but remote recording entry status is DISMISSED. Job will be processed'.format(dc_type, local_duration_sec))
                should_process = True
            else:
                should_process = False
        return should_process

    def analyze_entry_nodes(self, nodes_list, entry_server_node_id, server_type):
        int_server_type = int(server_type.value)
        dc_type = self.server_node_type[int_server_type]
        other_dc_type = self.server_node_type[int_server_type + 1 % 2]

        if not self.is_valid_server_nodes(nodes_list, entry_server_node_id):
            self.logger.error('found problem with entry server nodes. Job won\'t be processed')
            should_process = False
        else:
            filtered_server_nodes = self.filter_by_recorded_entry_id(nodes_list)
            self.logger.info('[{}] DCs provided the live stream, in this recording job'.format(len(filtered_server_nodes)))

            if len(filtered_server_nodes) == 0:
                self.logger.debug('recording job was processed by {}'.format(other_dc_type))
                should_process = False
            # handle use case that recording was in single DC
            elif self.is_single_dc(filtered_server_nodes, entry_server_node_id):
                should_process = self.should_process_as_single_dc(filtered_server_nodes, dc_type)
            # handle use case that recording was redundant (2 Dcs)
            else:
                should_process = self.should_process_as_redundant_dc(filtered_server_nodes, entry_server_node_id, server_type)

        return should_process


    def is_processing_required(self):
        # read metadata file && get entry server nodes to decide whether to process the job or skip it
        should_process = True

        try:
            with open(self.metadata_full_path, "r") as dc_file:
                data = dc_file.read()
                if data:
                    metadata = json.loads(data)
                    dc_type = 'UNKNWON'
                    try:
                        entry_server_node_id = int(metadata['entryServerNodeId'])
                        server_type = KalturaEntryServerNodeType(metadata['serverType'])
                        dc_type = self.server_node_type[int(server_type.value)]
                    except ValueError as e:
                        self.logger.fatal("invalid content in dc file: {}".format(str(e)))
                        raise e
                    except Exception as e:
                        self.logger.fatal("failed to read or parse dc file: {}".format(str(e)))
                        raise e

                    self.logger.debug('successfully read dc file. Entry server node id [{}], server type [{}]'.format(
                        entry_server_node_id, dc_type))

                    response_list, response_header = self.backend_client.get_server_entry_nodes_list(self.entry_id)

                    should_process = self.analyze_entry_nodes(response_list, entry_server_node_id, server_type)

                else:
                    self.logger.warn('metadata file not found. Assuming processing is required')

                if not should_process:
                    ''' set recording status to DISMISSED'''
                    self.backend_client.set_recording_status(self.entry_id, KalturaEntryServerNodeRecordingStatus.DISMISSED, entry_server_node_id)

        # FileNotFoundError does not exist on Python < 3.3
        except (OSError, IOError) as e:
            if getattr(e, 'errno', 0) == errno.ENOENT:
                self.logger.warn("file {} doesn't exit!!! processing concatenation task (default decision)".format(self.metadata_full_path))
            else:
                self.logger.fatal("failed to open {} file. {}".format(self.metadata_full_path, str(e)))
                raise e
        except Exception as e:
            self.logger.fatal("exception thrown while checking if job should be processed. {}".format(str(e)))
            raise e

        return should_process

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

        start_time = datetime.now()
        exitcode = -1
        status = 'succeeded'
        # convert the each flavor concatenated ts file to single mp4
        self.logger.debug('About to run TS -> MP4 conversion. Command: %s', command)

        try:
            process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

            log_subprocess_output(process, "ffmpeg: ts->mp4", self.logger)

            output, outerr = process.communicate()
            exitcode = process.returncode

            if exitcode is 0:
                self.logger.info('Successfully finished TS -> MP4 conversion')
            else:
                status = 'failed'
                error = 'Failed to convert TS -> MP4. Convertor process exit code {}, {}'.format(exitcode, outerr)
                self.logger.error(error)

                raise subprocess.CalledProcessError(exitcode, command)

        except (OSError, subprocess.CalledProcessError) as e:
            self.logger.fatal("Failed to convert TS -> MP4 {}".format(str(e)))
            raise e
        except Exception as e:
            self.logger.fatal("Failed to convert TS -> MP4 {}".format(str(e)))
            raise e

        finally:
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            self.logger.info(
                "Conversion of TS -> MP4, {}, exit code [{}], duration [{}] seconds".format(status, str(
                    exitcode), str(int(duration))))

    def get_output_filename(self, flavor):
        return self.output_filename + '_f' + flavor + '_out.ts'
