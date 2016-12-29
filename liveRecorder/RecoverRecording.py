import argparse
from Tasks.TaskRunner import TaskRunner
from Tasks.ConcatinationTask import ConcatenationTask
from Tasks.UploadTask import  UploadTask
from Logger.Logger import init_logger
from Config.config import set_config, get_config
import os
from BackendClient import *

import logging.handlers

class UploadTaskCustom(UploadTask):

    def __init__(self, base_directory, param):
        super(UploadTaskCustom, self).__init__(param, "UploadTaskCustom")
        self.output_file_path = os.path.join(base_directory, self.output_filename)

    def check_stamp(self):
        self.logger.warn("check_stamp mock")


class ConcatenationTaskCustom(ConcatenationTask):
    def __init__(self, base_directory, param):
        param['recorded_id'] = recording_dir
        super(ConcatenationTaskCustom, self).__init__(param, "ConcatenationTaskCustom")
        self.recording_path = base_directory


def parser_argument_configure():

    parser.add_argument('-e', '--entyId', help='Specified a custom live entryId (assume exist)')
    parser.add_argument('-r', '--recordedId', help='Specified a custom recording entryId (assume exist)')
    parser.add_argument('-d', '--recordingDuration', help='Specified a custom recording duration (assume exist)')
    parser.add_argument('-p', '--path', help='Path to recorded entry (mandatory)', required=False)
    parser.add_argument('-n', '--newEntry', action='store_true', help='Create new recorded entry')


def get_arg_params():
    global recording_dir
    if args.entyId is not None:
        param['entry_id'] = args.entyId.lstrip()

    if args.recordedId is not None:
        param['recorded_id'] = args.recordedId.lstrip()

    recording_dir = param['recorded_id']
    if args.newEntry is True:
        session_id =  param['entry_id']
        backendClient = BackendClient(session_id)
        partner_id = backendClient.get_live_entry(param['entry_id']).partnerId
        result = backendClient.add_recorded_entry(partner_id)
        recording_dir = param['recorded_id']
        param['recorded_id'] = result.id
        param['directory'] = directory_name

    if args.recordingDuration is not None:
        param['duration'] = args.recordingDuration.lstrip()

recording_dir = None
set_config("log_to_console", "True")
parser = argparse.ArgumentParser(description='Process some integers.')
parser_argument_configure()
args = parser.parse_args(['-p  /web/content/kLive/liveRecorder/error/0_2zghhfp8_0_ci0d33yw_270476', '-d 100',  "--newEntry"])
recover_log_file_name = get_config('recover_log_file_name')
init_logger(recover_log_file_name)
path = args.path.lstrip()
path_split = path.rsplit('/', 1)  #TODO CHECK INPUT
base_directory = path
directory_name = path_split[1]
has_all_custom_param = args.entyId is not None and args.recordedId is not None  and args.recordingDuration is not None
param ={}
if TaskRunner.match(directory_name) is None:
    if has_all_custom_param is False:
        print "error"
        exit(1)
    else:
        get_arg_params()
else:
    param = TaskRunner.get_param(directory_name)
    get_arg_params()

ConcatenationTaskCustom(base_directory, param).run()
UploadTaskCustom(base_directory, param).run()