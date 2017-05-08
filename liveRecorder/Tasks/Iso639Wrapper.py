import json
import os
from Logger.LoggerDecorator import logger_decorator

class Iso639Wrapper:

    def __init__(self, logger_info):
        self.logger = logger_decorator(self.__class__.__name__, logger_info)
        dir_path = os.path.dirname(os.path.realpath(__file__))
        full_path = os.path.join(dir_path, "database", "iso639-3.json")
        # load iso639 database
        with open(full_path) as database:
            self.language_database = json.load(database)

    def convert_language_to_iso639_3(self, in_language):
        size_lang = len(in_language)
        out_language = "und"
        if size_lang == 3:
            self.logger.debug("no conversion done. Language = %s", in_language)
            return in_language
        if size_lang == 2:
            for entry in self.language_database[u'639-3']:
                if u'alpha_2' in entry and entry[u'alpha_2'] == in_language:
                    out_language = entry[u'alpha_3'].encode("utf8")
                    self.logger.debug("found conversion for language: iso639-1: %s --> iso639-3: %s", in_language,
                                      out_language)
                    break
            if out_language == "und":
                self.logger.error("no conversion found for language \'%s\'", in_language)
            return out_language

        self.logger.error("unrecognized or invalid input language \'%s\'", in_language)
        return out_language


