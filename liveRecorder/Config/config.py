import ConfigParser
import socket
import logging
import os
import re
Config = ConfigParser.ConfigParser()
config_file_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'config.ini')
Config.read(config_file_path)
hostname = socket.gethostname()
config_json = {}
logger = logging.getLogger(__name__)


def fill(section):
    options = Config.options(section)
    for option in options:
        try:
            config_json[option] = Config.get(section, option)
        except Exception :
            print("exception on %s!" % option)
            config_json[option] = None


def config_section_map():
    current_path = os.path.dirname(os.path.abspath(__file__))
    Config.read(os.path.join(current_path, "configMapping.ini"))
    config_sections = Config.sections()
    for config_section in config_sections:
        pattern = re.compile(config_section)
        match = pattern.match(hostname)
        if match:
            fill(config_section)

    return config_json


def config_section_default():
    Config.read("config.ini")
    section = "default_config"
    fill(section)

def set_config(key, value):
    config_json[key] = value


def get_config(key, type = 'str'):
    if key in config_json:
        if type is not 'str':
            return eval(config_json[key])

        return config_json[key]
    else:
        logger.warn("key %s is not configuration list", key)
        return None

config_section_default()
config_section_map()
