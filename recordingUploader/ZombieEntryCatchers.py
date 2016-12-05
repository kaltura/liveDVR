import time
import logging.handlers
import os
import re
import traceback
from Config.config import get_config
from Logger.Logger import init_logger
import glob

logger = logging.getLogger('ZombieEntryCatchers')
recording_base_dir = get_config('recording_base_dir')
recordings_dir = os.path.join(recording_base_dir, 'recordings')
recording_incoming_dir = os.path.join(recording_base_dir, 'incoming')
entry_regex = '^[01]_\w{8}'
pattern = re.compile(entry_regex)
threshold_time_sec = 60  # 1 hour
log_full_path = get_config('cron_job_log_file_name')
init_logger(log_full_path)
polling_interval_sec = get_config('cron_job_polling_interval_hours', 'int') * 60 * 60


def job():
    logger.info("Start scanning directory in %s", recordings_dir)
    now = int(time.time())
    recording_list = glob.glob(recordings_dir + '/*/*/*/*')

    for recorded_id_path in recording_list:
        try:
            recorded_id = os.path.basename(recorded_id_path)
            entry_id_path = os.path.dirname(recorded_id_path)
            entry_id = os.path.basename(entry_id_path)
            if not pattern.match(recorded_id) or not os.path.isdir(recorded_id_path) or not pattern.match(entry_id):
                continue
            session_id = ''.join([entry_id, '-', recorded_id])
            done_file = os.path.join(recorded_id_path, 'done')
            last_modify_time = os.path.getmtime(recorded_id_path)
            is_expired = (now - last_modify_time) > threshold_time_sec
            done_exist = os.path.isfile(done_file)
            logger.debug("[%s] now %s last_modify_time %s, diff: %s, is_expired : %s, done_exist: %s", session_id,
                         now, last_modify_time, now-last_modify_time, is_expired, done_exist)
            if is_expired and not done_exist:
                logger.warn("[%s] Found zombie entry", session_id)
                directory_new_name = ''.join([entry_id, '_', recorded_id, '_0'])
                destination_target = os.path.join(recording_incoming_dir, directory_new_name)
                logger.debug("[%s] About to create sym link from %s into %s", session_id, directory_new_name,
                             destination_target)
                os.symlink(recorded_id_path, destination_target)
                logger.debug("[%s] Successfully created symlink, about to create done file in %s ", session_id,
                             done_file)
                with open(done_file, 'a'):
                    os.utime(done_file, None)
        except Exception as e:
            logger.error("[%s] Failed to catch Zombies entries %s : %s", str(e), entry_id, traceback.format_exc())


job()