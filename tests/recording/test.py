import subprocess
import threading
import time

def log_subprocess_output(process, title):
    header = "[{}] [pid={}]".format(title, process.pid)
    while True:
        nextline = process.stdout.readline()

        if nextline == '' and process.poll() is not None:
            break
        print "["+threading.current_thread().getName()+"] "+ header + nextline


        #if nextline.find("Input contains NaN/+-Inf")!=-1:
        #    exit(-5);


def koko():
    try:

        convertor = "/Users/guyjacubovski/Library/Developer/Xcode/DerivedData/ts_to_mp4_convertor-cknvyndxytuyqqcmnjvycauwzvax/Build/Products/Debug/ts_to_mp4_convertor"
        process = subprocess.Popen(convertor+" 1_bgtg1a6k_1_cmux5n8c_3946546_f32_out.ts f32_out.mp4 eng", cwd=r'/Users/guyjacubovski/Downloads', shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

        log_subprocess_output(process, "ffmpeg: ts->mp4")

        output, outerr = process.communicate()
        exitcode = process.returncode

        if exitcode is 0:
            print  "["+threading.current_thread().getName()+"] Successfully finished TS -> MP4 conversion"
        else:
            status = 'failed'
            error = 'Failed to convert TS -> MP4. Convertor process exit code {}, {}'.format(exitcode, outerr)
            print "["+threading.current_thread().getName()+"] " + error

            raise subprocess.CalledProcessError(exitcode, "a")

    except (OSError, subprocess.CalledProcessError) as e:
        print  "["+threading.current_thread().getName()+"] Failed to convert TS -> MP4 {}",format(str(e))
        raise e
    except Exception as e:
        print  "["+threading.current_thread().getName()+"] Failed to convert TS -> MP4 {}".format(str(e))
        raise e

jobs = []

for i in range(0, 15):
    thread = threading.Thread(name=i,target=koko)
    jobs.append(thread)

for j in jobs:
    j.start()

stopped = False

def watch():
    while not stopped:
        for j in jobs:
            if j.isAlive():
                print j.getName()
        time.sleep( 5 )

watchdog_thread = threading.Thread(name=i,target=watch)
watchdog_thread.start();
    # Ensure all of the threads have finished
for j in jobs:
    j.join()


print "haleluja"
stopped=True
watchdog_thread.join();