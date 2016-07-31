import shutil
import os
fullpath = "/Users/ron.yadgar/dvr/recordingUploader/0_ntb7ylat_3"


for i in range(4, 101):
    shutil.copytree(fullpath, "/Users/ron.yadgar/dvr/recordingUploader/0_ntb7ylat_"+str(i))

