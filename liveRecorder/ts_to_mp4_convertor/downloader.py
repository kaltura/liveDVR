import urllib2
import re
import os
import sys

regex = r"href=\"([^\"]+.ts)\""


baseUrl = 'http://192.168.10.127/kLive/liveRecorder/done/1_1yxe2oi8_1_mngvnyea_11422102'

folder = os.path.basename(baseUrl)

print "Reading: ", baseUrl
req = urllib2.Request(baseUrl)
#req.headers['Range'] = 'bytes=%s-%s' % (start, end)
f = urllib2.urlopen(req)
content = f.read()

def ensure_dir(file_path):
    directory = os.path.dirname(file_path)
    if not os.path.exists(directory):
        os.makedirs(directory)

def chunk_copy(response, output,total,chunk_size=8192):
    bytes_so_far = 0

    while 1:
        chunk = response.read(chunk_size)
        bytes_so_far += len(chunk)
        print "\rtotal ", bytes_so_far, '/' , fileSize, ' (',100*bytes_so_far/fileSize,'% )'
        sys.stdout.flush()


        if not chunk:
            print "total ", bytes_so_far
            break

        output.write(chunk)


matches = re.finditer(regex, content)

chunk_size = 188*1024
checks_to_copy = 1000
for match in enumerate(matches):

    fileName = match[1].group(1)
    localFile = "./"+folder+"/"+fileName

    print "Downloading: ", baseUrl+"/"+fileName, " into ",localFile
    req2 = urllib2.Request(baseUrl+"/"+fileName)
    fileSize = checks_to_copy*chunk_size
    req2.add_header('Range','bytes=%s-%s' % (0, fileSize))
    f2 = urllib2.urlopen(req2)
    ensure_dir(localFile)

    with open(localFile,'wb') as output:
        chunk_copy(f2,output,fileSize,chunk_size)
#
