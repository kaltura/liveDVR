import subprocess
import datetime
import os
import smtplib
from datetime import date, timedelta
from os.path import basename
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import COMMASPACE, formatdate


def write_liveRecorede_stat(dataCenter):
    if dataCenter == "pa":
        command = "ls -lt "
    else:
        command = "ssh  dev@ny-live-recorder1 ls -lt "

    with open(output_full_path, 'a') as file_output:
        new_file_done, num_file_done = get_files(command + done_path, month, day)
        new_file_error, num_file_error = get_files(command + error_path, month, day)

        file_output.write("[" + dataCenter + "] Total files on done " + str(num_file_done) + "\n")
        file_output.write("[" + dataCenter + "] New files on done " + str(new_file_done) + "\n")
        file_output.write("[" + dataCenter + "] Total files on error " + str(num_file_error) + "\n")
        file_output.write("[" + dataCenter + "] New files on error " + str(new_file_error) + "\n")


def get_logs(log_level, file_path):
    command1 = ''.join(['zgrep ', '-a ', '-e  ', 'RecordingEntrySession ', '-e ', 'RecordingManager ', file_path])
    command2 = ''.join(['grep ', log_level])
    command = command1 + ' | ' + command2
    print("About to run %s" +  command)
    output = subprocess.Popen(command, stdout=subprocess.PIPE, shell=True).communicate()[0]
    return output


def get_files(command, month, day):
    new_file = []
    lines_count=0
    cmd = subprocess.Popen(command, shell=True,  stdout=subprocess.PIPE)
    for line in cmd.stdout:
        lines_count = lines_count +1
        l = line.split( )
        if len(l) == 11 and l[5] == month and l[6] == str(day):
            new_file.append(l[8])
    return new_file, lines_count-1


def scan_logs(log_level):
    with open(output_full_path, 'a') as file_output:
        monthNew =  "%02d" % (now.month,)
        dayNew = "%02d" % (now.day,)
        src_dir = os.path.join('/web', 'logs', 'investigate', str(now.year), monthNew, dayNew, 'liveController')
        for file_log in os.listdir(src_dir):
            if file_log.endswith(".gz"):
                file_path = os.path.join(src_dir, file_log)
                try:
                    output = get_logs(log_level, file_path)
                    if len(output) != 0:
                        file_output.write("Machine " + file_log + "\n")
                        file_output.write(output)
                except Exception as e:
                    print('Error on' + file_log)


def send_mail(send_from, send_to, subject, text, file=None, server="127.0.0.1"):
    assert isinstance(send_to, list)

    msg = MIMEMultipart()
    msg['From'] = send_from
    msg['To'] = COMMASPACE.join(send_to)
    msg['Date'] = formatdate(localtime=True)
    msg['Subject'] = subject

    msg.attach(MIMEText(text))

    with open(file, "rb") as fil:
        part = MIMEApplication(
            fil.read(),
        )
        part['Content-Disposition'] = 'attachment; filename="%s"' % output_file
        msg.attach(part)

    smtp = smtplib.SMTP(server)
    smtp.sendmail(send_from, send_to, msg.as_string())
    smtp.close()

now = datetime.datetime.now() - timedelta(1)
month =now.strftime("%b")
day = now.day
date = now.strftime("%d.%m.%Y")
output_file = 'DailyReport-' + date + '.log'
output_full_path = os.path.join("/var/log", output_file)
done_path = "/web/content/kLive/liveRecorder/done/"
error_path = "/web/content/kLive/liveRecorder/error/"

num_files = len([f for f in os.listdir(done_path)
                if os.path.isfile(os.path.join(done_path, f))])


mail_list = ["ron.yadgar@kaltura.com"]
write_liveRecorede_stat("pa")
write_liveRecorede_stat("ny")
#scan_logs('ERROR')
#scan_logs('WARN')

send_mail("pa-reportsk@jkaltura.com", mail_list, "DailyReport", "DailyReport", output_full_path)
