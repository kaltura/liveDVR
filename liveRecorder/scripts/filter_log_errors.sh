#!/bin/bash

LOGS_PATH="/var/logs/liveRecorder"
FILES_PATTERN="*"
HELP_STRING="--------------------------------------------------------------------------------------------------------------------------------------------------
 filter_log_errors.sh usage
--------------------------------------------------------------------------------------------------------------------------------------------------
-l|-logs_path      - specify full path to log files. Default ${LOGS_PATH}
-p|--files_pattern - specify log files name/s or pattern. Default ${FILES_PATTERN}
-h|--help          - list options and usage
---------------------------------------------------------------------------------------------------------------------------------------------------
example:
. ./filter_log_errors.sh -l \"/var/log/liveRecorder\" -f \"liveRecorder.log liveRecorder.log.2017-11-[0,1][1-9].gz liveRecorder.log.2017-10-31.gz\"
---------------------------------------------------------------------------------------------------------------------------------------------------"

while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -l|--logs_path)
    LOGS_PATH="$2"
    shift # past argument
    shift # past value
    ;;
    -p|--files_pattern)
    FILES_PATTERN="$2"
    shift # past argument
    shift # past value
    ;;
    -h|--help)
    echo "${HELP_STRING}"
    exit 0
    ;;
    *)
    echo "option [$1] is unknown, ignoring value [ $2 ]"
    echo "${HELP_STRING}"
    exit 1
    ;;
esac
done

echo "LOGS_PATH=${LOGS_PATH}"
echo "FILES PATTERN=${FILES_PATTERN}"
SEARCH_PATTERN=""
for var in ${FILES_PATTERN}; do
    echo "${var}"
    SEARCH_PATTERN="${SEARCH_PATTERN} ${LOGS_PATH}/${var}"
done
echo "SEARCH_PATTERN  = ${SEARCH_PATTERN}"

CHECK_ERRORS=$(zgrep -a  'Failed to perform task' ${SEARCH_PATTERN} | grep -v  'already exist' | grep -v 'ENTRY_ID_NOT_FOUND' | grep -v 'No such file or directory' | grep -v 'Failed to perform task :HTTP Error 503: Service Temporarily Unavailable' | grep -v 'RECORDED_ENTRY_LIVE_MISMATCH' | grep -v 'FLAVOR_PARAMS_ID_NOT_FOUND' | grep -v 'tuple index out of range' | grep -v 'SERVICE_FORBIDDEN_CONTENT_BLOCKED' | grep -v 'HTTP Error 404' | grep -v 'was not created while streaming'| grep -v 'media_set_parse_json: failed to parse json' | grep -v  'RECORDING_CONTENT_NOT_YET_SET' | grep -v 'timed out (-4)' | grep -v 'INTERNAL_DATABASE_ERROR' | grep -v 'returned non-zero exit status' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo ">>>> check for new errors"
echo "$CHECK_ERRORS"
echo ">>>> end check for new errors"

echo ">>>> check [returned non-zero exit status (ConcatenationTask)]"
CHECK_ERRORS=$(zgrep -a  'Failed to perform task' ${SEARCH_PATTERN} | grep 'returned non-zero exit status' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$CHECK_ERRORS"
echo ">>>> end check [returned non-zero exit status (ConcatenationTask)]"

echo ">>>> check [INTERNAL_DATABASE_ERROR]"
CHECK_ERRORS=$(zgrep -a  'Failed to perform task' ${SEARCH_PATTERN} | grep 'INTERNAL_DATABASE_ERROR' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$CHECK_ERRORS"
echo ">>>> end check [INTERNAL_DATABASE_ERROR]"

echo ">>>> check [timed out (-4)]"
CHECK_ERRORS=$(zgrep -a  'Failed to perform task' ${SEARCH_PATTERN} | grep 'timed out (-4)' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$CHECK_ERRORS"
echo ">>>> end check [timed out (-4)]"

echo ">>>> check [RECORDING_CONTENT_NOT_YET_SET]"
CHECK_ERRORS=$(zgrep -a  'Failed to perform task' ${SEARCH_PATTERN} | grep 'RECORDING_CONTENT_NOT_YET_SET' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$CHECK_ERRORS"
echo ">>>> end check [RECORDING_CONTENT_NOT_YET_SET]"

echo ">>>> check [media_set_parse_json: failed to parse json]"
CHECK_ERRORS=$(zgrep -a  'Failed to perform task' ${SEARCH_PATTERN} | grep 'media_set_parse_json: failed to parse json' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$CHECK_ERRORS"
echo ">>>> end check [media_set_parse_json: failed to parse json]"

echo ">>>> check [Recorded entry <recordedEntryId> was not created while streaming to the given live entry]"
CHECK_ERRORS=$(zgrep -a  'Failed to perform task' ${SEARCH_PATTERN} | grep 'was not created while streaming' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$CHECK_ERRORS"
echo ">>>> end check [Recorded entry <recordedEntryId> was not created while streaming to the given live entry]"

echo ">>>> check [HTTP Error 404: Not Found]"
CHECK_ERRORS=$(zgrep -a  'Failed to perform task' ${SEARCH_PATTERN} | grep 'HTTP Error 404' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$CHECK_ERRORS"
echo ">>>> end check [HTTP Error 404: Not Found]"

echo ">>>> check [SERVICE_FORBIDDEN_CONTENT_BLOCKED]"
CHECK_ERRORS=$(zgrep -a  'Failed to perform task' ${SEARCH_PATTERN} | grep 'SERVICE_FORBIDDEN_CONTENT_BLOCKED' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$CHECK_ERRORS"
echo ">>>> end check [SERVICE_FORBIDDEN_CONTENT_BLOCKED]"

echo ">>>> check [tuple index out of range]"
CHECK_ERRORS= $(zgrep -a  'Failed to perform task' ${SEARCH_PATTERN} | grep 'tuple index out of range' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$CHECK_ERRORS"
echo ">>>> end check [tuple index out of range]"

echo ">>>> check [FLAVOR_PARAMS_ID_NOT_FOUND]"
CHECK_ERRORS=$(zgrep -a  'Failed to perform task' ${SEARCH_PATTERN} | grep 'FLAVOR_PARAMS_ID_NOT_FOUND' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$CHECK_ERRORS"
echo ">>>> end check [FLAVOR_PARAMS_ID_NOT_FOUND]"

echo ">>>> check [RECORDED_ENTRY_LIVE_MISMATCH]"
CHECK_ERRORS=$(zgrep -a  'Failed to perform task' ${SEARCH_PATTERN} | grep 'RECORDED_ENTRY_LIVE_MISMATCH' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$CHECK_ERRORS"
echo ">>>> end check [RECORDED_ENTRY_LIVE_MISMATCH]"

echo ">>>> check [HTTP Error 503: Service Temporarily Unavailable]"
CHECK_ERRORS=$(zgrep -a  'Failed to perform task' ${SEARCH_PATTERN} | grep 'HTTP Error 503: Service Temporarily Unavailable' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$CHECK_ERRORS"
echo ">>>> end check [HTTP Error 503: Service Temporarily Unavailable]"

echo ">>>> check [No such file or directory]"
CHECK_ERRORS=$(zgrep -a  'Failed to perform task' ${SEARCH_PATTERN} | grep 'No such file or directory' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$CHECK_ERRORS"
echo ">>>> end check [No such file or directory]"

echo ">>>> check [ENTRY_ID_NOT_FOUND]"
CHECK_ERRORS=$(zgrep -a  'Failed to perform task' ${SEARCH_PATTERN} | grep 'ENTRY_ID_NOT_FOUND' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$CHECK_ERRORS"
echo ">>>> end check [ENTRY_ID_NOT_FOUND]"

echo ">>> check [already exists]"
CHECK_ERRORS=$(zgrep -a  'Failed to perform task' ${SEARCH_PATTERN} | grep 'already exists' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$CHECK_ERRORS"
echo ">>>> end check [already exists]"
