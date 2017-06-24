import urllib2
import os



def download_file(url):
	print("About to request the url: [%s] ", url)
	return urllib2.urlopen(url).read()

base_url=/home/kaltura-ci/workspace/kLiveController-build-binaries/bin/
format_convertor_url=
download_file(format_converter_url)
ts_to_mp4_convertor_rul=
download_file(ts_to_mp4_convertor_url)