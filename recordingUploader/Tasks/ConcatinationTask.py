import os
import subprocess
from Config.config import get_config
from TaskBase import TaskBase
ffmpeg_path = get_config('ffmpeg_path')


class ConcatenationTask(TaskBase):

    # global variables
    manifest_input_file = "manifest.txt"

    @staticmethod
    def sorted_ls(path):
        mtime = lambda f: os.stat(os.path.join(path, f)).st_mtime
        return list(sorted(os.listdir(path), key=mtime))

    def create_manifest(self):
        self.logger.info("Creating manifest file for the recorded entry %s", self.entry_id)
        full_path = os.path.join(self.recording_path, self.manifest_input_file)
        file_list = self.sorted_ls(self.recording_path)
        with open(full_path, "wb") as fo:
            for file_name in file_list:
                if file_name.endswith('.mp4') and not file_name.endswith('_out.mp4'):
                    fo.write("file %s\n" % file_name)
                else:
                    self.logger.warn("file %s is not mp4 file format", file_name)

    def __init__(self, param, logger_info):
        TaskBase.__init__(self, param, logger_info)
        concat_task_processing_dir = os.path.join(self.base_directory, self.__class__.__name__, 'processing')
        self.recording_path = os.path.join(concat_task_processing_dir, self.entry_directory)
        self.stamp_full_path = os.path.join(self.recording_path, 'stamp')

    def run(self):

        self.write_stamp()
        self.create_manifest()
        input_full_path = os.path.join(self.recording_path, self.manifest_input_file)
        output_full_path = os.path.join(self.recording_path, self.output_filename)
        self.logger.info("About to concat files from manifest %s, into %s", input_full_path, output_full_path)
        command = ' '.join([ffmpeg_path, "-f concat", "-i", input_full_path,
                           "-c:v copy -c:a copy -bsf:a aac_adtstoasc -f mp4 -y", output_full_path])
        self.logger.debug("About to run the following command: %s", command)
        command_out = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        self.logger.info("Running concat task command with pid %d", command_out.pid)
        out, err = command_out.communicate()
        if command_out.returncode == 0:
            self.check_stamp()
            self.logger.info("Successfully concat files from manifest %s, into %s", input_full_path, output_full_path)
            self.logger.debug("standard output: %s", out)
        else:
            self.logger.error("Failed to concat file for entry %s: error code %d", self.entry_id
                              , command_out.returncode)
            self.logger.error("standard output: %s", out)
            self.logger.error("standard error: %s", err)

