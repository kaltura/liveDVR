from optparse import OptionParser
import glob,subprocess

from datetime import datetime

def log_subprocess_output(process):
    while True:
        nextline = process.stdout.readline()
        if nextline == '' and process.poll() is not None:
            break
        print nextline


def convert_ts_to_mp4( command):

    start_time = datetime.now()
    exitcode = -1
    status = 'succeeded'
    # convert the each flavor concatenated ts file to single mp4
    print 'About to run TS -> MP4 conversion. Command: %s' % command

    try:
        process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

        log_subprocess_output(process)

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

for file in files:
    command += " " +file + " "+file.replace('.ts', '.mp4')+ " und "


convert_ts_to_mp4(command)
