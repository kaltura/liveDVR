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


def get_live_controller_logs(log_level, file_path):
    command1 = ''.join(['zgrep ', '-a ', '-e  ', 'RecordingEntrySession ', '-e ', 'RecordingManager ', file_path])
    command2 = ''.join(['grep ', log_level])
    command = command1 + ' | ' + command2
    output = operate_command(command)
    return output


def get_live_recorder_logs(file_path):
    command = ''.join(['zgrep ', '-a ', '-e  ', 'ERROR ', '-e ', 'WARN ', file_path])
    output = operate_command(command)
    return output


def operate_command(command):
    print("About to run " + command)
    output = subprocess.Popen(command, stdout=subprocess.PIPE, shell=True).communicate()[0]
    return output


def get_files(command, month, day):
    new_file = []
    lines_count=0
    results = operate_command(command)
    results = results.split('\n')
    for line in results:
        lines_count = lines_count +1
        l = line.split( )
        if len(l) == 11 and l[5] == month and l[6] == str(day):
            new_file.append(l[8])
    return new_file, lines_count-1


def scan_logs_project(file_output, now, log_level, project):
    month_new = "%02d" % (now.month,)
    day_new = "%02d" % (now.day,)
    src_dir = os.path.join('/web', 'logs', 'investigate', str(now.year), month_new, day_new, project)
    for file_log in os.listdir(src_dir):
        if file_log.endswith(".gz"):
            file_path = os.path.join(src_dir, file_log)
            try:
                output = None
                if project == 'liveController':
                    output = get_live_controller_logs(log_level, file_path)
                if project == 'live-recorder':
                    output = get_live_recorder_logs(file_path)
                if output is not None and len(output) != 0:
                    file_output.write("\n \n \n \n Machine " + file_log + "\n")
                    file_output.write(output)
            except Exception as e:
                print('Error on ' + file_log + e.message)


def scan_logs(output_full_path, now):
    with open(output_full_path, 'a') as file_output:
        scan_logs_project(file_output, now, "ERROR", 'liveController')
        scan_logs_project(file_output, now, "None", 'live-recorder')
        scan_logs_project(file_output, now, "WARN", 'liveController')


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

    mail_list = ["lilach.maliniak@kaltura.com"]
    if mailAdress is not None:
        mail_list.append(mailAdress)

    write_liveRecorede_stat("pa", output_full_path, done_path, error_path, month, day)
    write_liveRecorede_stat("ny", output_full_path, done_path, error_path, month, day)
    scan_logs(output_full_path, now)
    send_from = os.path.basename(__file__) + "@kaltura.com"
    send_mail(send_from, mail_list, "DailyReport", "DailyReport", output_full_path, output_file)
    print("Send mail to " + str(mail_list) + " date:" + date)
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser_argument_configure(parser)
    args = parser.parse_args()
    if args.c is None:
        relative_date = 1
        if args.date is not None:
            relative_date = int(args.date)

        get_report(mailAdress = args.mail, relative_date = relative_date)

    else:
        for x in range(1, int(args.c)):
            get_report(mailAdress=args.mail, relative_date=x)

