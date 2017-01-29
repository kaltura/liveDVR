import subprocess
import datetime
import os
import smtplib
from datetime import date, timedelta
import argparse
from os.path import basename
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import COMMASPACE, formatdate


def write_liveRecorede_stat(dataCenter, output_full_path, done_path, error_path, month, day):
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
    print("About to run " +  command)
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


def scan_logs(log_level, output_full_path, now):
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


def send_mail(send_from, send_to, subject, text, filePath=None, output_file=None, server="127.0.0.1"):
    assert isinstance(send_to, list)

    msg = MIMEMultipart()
    msg['From'] = send_from
    msg['To'] = COMMASPACE.join(send_to)
    msg['Date'] = formatdate(localtime=True)
    msg['Subject'] = subject

    msg.attach(MIMEText(text))

    with open(filePath, "rb") as fil:
        part = MIMEApplication(
            fil.read(),
        )
        part['Content-Disposition'] = 'attachment; filename="%s"' % output_file
        msg.attach(part)

    smtp = smtplib.SMTP(server)
    smtp.sendmail(send_from, send_to, msg.as_string())
    smtp.close()
    print


def parser_argument_configure(parser):

    parser.add_argument('-d', '--date', help='Specified a custom date')
    parser.add_argument('-c', '--c', help='Specified how many days')
    parser.add_argument('-m', '--mail', help='Specified mail address to send reports')


def get_report(mailAdress = None, relative_date = 1):

    now = datetime.datetime.now() - timedelta(relative_date)
    month = now.strftime("%b")
    day = now.day
    date = now.strftime("%d.%m.%Y")
    output_file = 'DailyReport-' + date + '.log'
    output_full_path = os.path.join("/var/log", output_file)
    done_path = "/web/content/kLive/liveRecorder/done/"
    error_path = "/web/content/kLive/liveRecorder/error/"

    mail_list = ["ron.yadgar@kaltura.com"]
    if mailAdress is not None:
        mail_list.append(mailAdress)

    write_liveRecorede_stat("pa", output_full_path, done_path, error_path, month, day)
    write_liveRecorede_stat("ny", output_full_path, done_path, error_path, month, day)
    scan_logs('ERROR', output_full_path, now)
    scan_logs('WARN', output_full_path, now)

    send_mail("pa-reportsk@jkaltura.com", mail_list, "DailyReport", "DailyReport", output_full_path, output_file)
    print("Send mail to " + str(mail_list) + " date:" + date)
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser_argument_configure(parser)
    args = parser.parse_args()
    if args.c is  None:
        relative_date = 1
        if args.date is not None:
            relative_date = args.date

        get_report(mailAdress = args.mail, relative_date = relative_date)

    else:
        for x in range(1, args.c):
            get_report(mailAdress=args.mail, relative_date=x)

