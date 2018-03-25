from optparse import OptionParser
import glob,subprocess
import json
import re
import urllib
from datetime import datetime

def log_subprocess_output(process):
    while True:
        nextline = process.stdout.readline()
        nextlineerr = process.stderr.readline()
        if nextline == '' and process.poll() is not None:
            break
        print nextline
        print nextlineerr


lang_map = {
    111: ("swe","Swedish"),
    110: ("fin","Finnish")
}
def probe_file(filename):
    match= re.search(r"_f(\d+)_out", filename)
    lang=None
    if match:
        a=match.groups()
        flavorId = int(a[0])
        lang= lang_map.get(flavorId,None)
    args = ['ffprobe', '-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams','-i', filename]
    p = subprocess.Popen(args, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    result,err = p.communicate()
    j=json.loads(result)

    main_stream =j['streams'][0]
    if main_stream['codec_type']=='video':
        resolution = str(main_stream['width'])+'x'+str(main_stream['height'])
    else:
        resolution = None

    return {
        'duration': j['format']['duration'],
        'bitrate':  (8*float(j['format']['size'])) / float(j['format']['duration']),
        'resolution': resolution,
        'lang': lang
    }

def convert_ts_to_mp4( command):

    start_time = datetime.now()
    exitcode = -1
    status = 'succeeded'
    # convert the each flavor concatenated ts file to single mp4
    print 'About to run TS -> MP4 conversion. Command: %s' % command

    try:
        process = subprocess.Popen(command, shell=True)

        #log_subprocess_output(process)

        output, outerr = process.communicate()
        exitcode = process.returncode

        if exitcode is 0:
            print 'Successfully finished TS -> MP4 conversion'
        else:
            status = 'failed'
            error = 'Failed to convert TS -> MP4. Convertor process exit code {}, {}'.format(exitcode, outerr)
            print error

            raise subprocess.CalledProcessError(exitcode, command)

    except (OSError, subprocess.CalledProcessError) as e:
        print "Failed to convert TS -> MP4 {}".format(str(e))
        raise e
    except Exception as e:
        print "Failed to convert TS -> MP4 {}".format(str(e))
        raise e

    finally:
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        print  "Conversion of TS -> MP4, {}, exit code [{}], duration [{}] seconds".format(status, str(
                exitcode), str(int(duration)))





parser = OptionParser()
parser.add_option("-d", "--dir", dest="directory",  help=".ts directory")
parser.add_option("-e", "--executable", dest="executable",  help="executable", default="./ts_to_mp4_convertor")

(options, args) = parser.parse_args()

files = glob.glob(options.directory+"/*.ts")


command = options.executable

manifest=""

for file in files:
    mp4 = file.replace('.ts', '.mp4')
    command += " " +file + " "+mp4+ " und "
    res=probe_file(file)

    if res.get('lang'):
        manifest='#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID=\"audio\",LANGUAGE=\"{0}\",NAME=\"{1}\",AUTOSELECT=YES,DEFAULT=YES,URI=\"{2}\"\n'.format(res['lang'][0],res['lang'][1],mp4)\
                  +manifest
    else:
        if res.get('resolution'):
            manifest+="#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH={0:.0f},RESOLUTION={1},AUDIO=\"audio\"\n".format(res['bitrate'],res['resolution'])
        else:
            manifest+="#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH={0:.0f},AUDIO=\"audio\"\n".format(res['bitrate'])

        manifest+="http://localhost:8081/serve{0}/hls/index.m3u8\n".format(mp4)


manifest = "#EXTM3U\n" + manifest

master_manifest = options.directory+"/master.m3u8";
with open(master_manifest, "w") as text_file:
    text_file.write(manifest)

print "https://video-dev.github.io/hls.js/demo/?src={0}".format(urllib.quote_plus("http://localhost:8081/manifest/"+master_manifest))
convert_ts_to_mp4(command)
