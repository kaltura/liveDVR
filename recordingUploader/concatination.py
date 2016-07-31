import os
import subprocess
import recording_logger
import logging
import logging.handlers
class Concatination:



    @staticmethod
    def sorted_ls(path):
        mtime = lambda f: os.stat(os.path.join(path, f)).st_mtime
        return list(sorted(os.listdir(path), key=mtime))

    def create_manifest(self):
        self.logger.info("Creating manifest file for the recorded entry %s", self.entry_id)
        full_path=os.path.join(self.recording_path, self.manifest_input_file)
        fo = open(full_path, "wb")
        file_list = self.sorted_ls(self.recording_path)
        for file_name in file_list:
            if file_name.endswith('.mp4'):
                fo.write("file %s\n" % file_name)
            else:
                self.logger.warn("file %s is not mp4 file format", file_name)
        fo.close()

    def __init__(self, arg):
        recording_logger.init_logger()
        self.manifest_input_file = "manifest.txt"
        self.logger = logging.getLogger('concatination')
        self.entry_id = arg[0]
        self.recording_path = arg[1]
        self.ffmpeg_path = arg[2]
        self.output_file = arg[3]
        self.create_manifest()
        self.cocnat()

    def cocnat (self):
        input_full_path = os.path.join(self.recording_path, self.manifest_input_file)
        output_full_path = os.path.join(self.recording_path, self.output_file)
        self.logger.info("About to concat files from manifest %s, infoi %s", input_full_path, output_full_path)
        command = ' '.join([self.ffmpeg_path,
                           "-f concat", "-i",
                           input_full_path,
                           "-c:v copy -c:a copy -bsf:a aac_adtstoasc -f mp4 -y",
                           output_full_path,
                           "2>&1"])

        self.logger.debug("Running the following commnad: %s", command)
        commadOut = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        out, err = commadOut.communicate()
        if commadOut.returncode==0:
            self.logger.info("Successfully concat files from manifest %s, into %s", input_full_path,
                                 output_full_path);
            self.logger.debug("standard output: %s", out)
        else:
            self.logger.error("Failed to concat file for entry %s: error code %d", self.entry_id, commadOut.returncode);
            self.logger.error("standard output: %s", out)
            self.logger.error("standard error: %s", err)
        return commadOut.returncode
