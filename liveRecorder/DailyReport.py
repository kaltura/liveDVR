import subprocess
import datetime
import os
import glob
import smtplib
from os.path import basename
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import COMMASPACE, formatdate

now = datetime.datetime.now()
month =now.strftime("%b")
day = now.day
print(now)
date = now.isoformat()
output_file = 'DailyReport-' + date + '.log'
output_full_path = os.path.join("/var/log", output_file)
done_path = "/web/content/kLive/liveRecorder/done/"
error_path = "/web/content/kLive/liveRecorder/error/"

num_files = len([f for f in os.listdir(done_path)
                if os.path.isfile(os.path.join(done_path, f))])


def write_liveRecorede_stat():
    with open(output_full_path, 'a') as file_output:
        new_file_done = get_files(done_path, month, day)
        new_file_error = get_files(error_path, month, day)
        num_file_done = len(os.listdir(done_path))
        num_file_error = len(os.listdir(error_path))
        file_output.write("Total files on done " + str(num_file_done) + "\n")
        file_output.write("New files on done " + str(new_file_done) + "\n")
        file_output.write("Total files on error " + str(num_file_error) + "\n")
        file_output.write("New files on error " + str(new_file_error) + "\n")


def get_logs(log_level, file_path):
    command1 = ''.join(['zgrep ', '-a ', '-e  ', 'RecordingEntrySession ', '-e ', 'RecordingManager ', file_path])
    command2 = ''.join(['grep ', log_level])
    command = command1 + ' | ' + command2
    print("About to run %s" +  command)
    output = subprocess.Popen(command, stdout=subprocess.PIPE, shell=True).communicate()[0]
    return output


def get_files(path, month, day):
    new_file = []
    command = "ls -lt "+path
    cmd = subprocess.Popen(command, shell=True,  stdout=subprocess.PIPE)
    for line in cmd.stdout:
        l = line.split( )
        if len(l) == 11 and l[5] == month and l[6] == str(day):
            new_file.append(l[8])
    return new_file


def scan_logs(log_level):
    with open(output_full_path, 'a') as file_output:
        src_dir = os.path.join('/web', 'logs', 'investigate', str(now.year), str(now.month), str(now.day-2), 'liveController')
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
            Name=basename(f)
        )
        part['Content-Disposition'] = 'attachment; filename="%s"' % basename(f)
        msg.attach(part)

    smtp = smtplib.SMTP(server)
    smtp.sendmail(send_from, send_to, msg.as_string())
    smtp.close()
mail_list = ["ron.yadgar@kaltura.com", "ron5569@gmail.com"]
write_liveRecorede_stat()
scan_logs('ERROR')
scan_logs('WARN')
send_mail("pa-reportsk@jkaltura.com", mail_list, "DailyReport", "DailyReport", output_full_path)
