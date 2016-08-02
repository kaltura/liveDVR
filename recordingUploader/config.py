import ConfigParser
import socket
import logging.handlers
Config = ConfigParser.ConfigParser()
Config.read("config.ini")
hostname = socket.gethostname()
config_json = {}
logger = logging.getLogger(__name__)


def fill(section):
    options = Config.options(section)
    for option in options:
        try:
            config_json[option] = Config.get(section, option)
        except:
            print("exception on %s!" % option)
            config_json[option] = None


def config_section_map():
    Config.read("configMapping.ini")
    config_sections = Config.sections()
    for config_section in config_sections:
        if config_section == hostname:
            fill(config_section)

    return config_json


def config_section_default():
    Config.read("config.ini")
    section = "default_config"
    fill(section)


def get_config(key, type = lambda str: str):
    if key in config_json:
        if type is 'int':
            return int(config_json[key])
        if type is 'float':
            return float(config_json[key])
        return config_json[key]
    else:
        logger.warn("key %s is not configuration list", key)
        return None

config_section_default()
config_section_map()
