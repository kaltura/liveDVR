import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
from Config.config import get_config
print  get_config("recording_base_dir")
