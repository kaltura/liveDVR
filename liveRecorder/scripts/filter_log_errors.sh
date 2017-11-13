#!/bin/bash

check_errors=$(zgrep 'Failed to perform task' *.gz | grep -v  'already exist' | grep -v 'ENTRY_ID_NOT_FOUND' | grep -v 'No such file or directory' | grep -v 'Failed to perform task :HTTP Error 503: Service Temporarily Unavailable' | grep -v 'RECORDED_ENTRY_LIVE_MISMATCH' | grep -v 'FLAVOR_PARAMS_ID_NOT_FOUND' | grep -v 'tuple index out of range' | grep -v 'SERVICE_FORBIDDEN_CONTENT_BLOCKED' | grep -v 'HTTP Error 404' | grep -v 'was not created while streaming'| grep -v 'media_set_parse_json: failed to parse json' | grep -v  'RECORDING_CONTENT_NOT_YET_SET' | grep -v 'timed out (-4)' | grep -v 'INTERNAL_DATABASE_ERROR' | grep -v 'returned non-zero exit status' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo ">>>> check for new errors"
echo "$check_errors"
echo ">>>> end check for new errors"

echo ">>>> check [returned non-zero exit status (ConcatenationTask)]"
check_errors=$(zgrep 'Failed to perform task' *.gz | grep 'returned non-zero exit status' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$check_errors"
echo ">>>> end check [returned non-zero exit status (ConcatenationTask)]"

echo ">>>> check [INTERNAL_DATABASE_ERROR]"
check_errors=$(zgrep 'Failed to perform task' *.gz | grep 'INTERNAL_DATABASE_ERROR' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$check_errors"
echo ">>>> end check [INTERNAL_DATABASE_ERROR]"

echo ">>>> check [timed out (-4)]"
check_errors=$(zgrep 'Failed to perform task' *.gz | grep 'timed out (-4)' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$check_errors"
echo ">>>> end check [timed out (-4)]"

echo ">>>> check [RECORDING_CONTENT_NOT_YET_SET]"
check_errors=$(zgrep 'Failed to perform task' *.gz | grep 'RECORDING_CONTENT_NOT_YET_SET' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$check_errors"
echo ">>>> end check [RECORDING_CONTENT_NOT_YET_SET]"

echo ">>>> check [media_set_parse_json: failed to parse json]"
check_errors=$(zgrep 'Failed to perform task' *.gz | grep 'media_set_parse_json: failed to parse json' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$check_errors"
echo ">>>> end check [media_set_parse_json: failed to parse json]"

echo ">>>> check [Recorded entry <recordedEntryId> was not created while streaming to the given live entry]"
check_errors=$(zgrep 'Failed to perform task' *.gz | grep 'was not created while streaming' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$check_errors"
echo ">>>> end check [Recorded entry <recordedEntryId> was not created while streaming to the given live entry]"

echo ">>>> check [HTTP Error 404: Not Found]"
check_errors=$(zgrep 'Failed to perform task' *.gz | grep 'HTTP Error 404' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$check_errors"
echo ">>>> end check [HTTP Error 404: Not Found]"

echo ">>>> check [SERVICE_FORBIDDEN_CONTENT_BLOCKED]"
check_errors=$(zgrep 'Failed to perform task' *.gz | grep 'SERVICE_FORBIDDEN_CONTENT_BLOCKED' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$check_errors"
echo ">>>> end check [SERVICE_FORBIDDEN_CONTENT_BLOCKED]"

echo ">>>> check [tuple index out of range]"
check_errors= $(zgrep 'Failed to perform task' *.gz | grep 'tuple index out of range' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$check_errors"
echo ">>>> end check [tuple index out of range]"

echo ">>>> check [FLAVOR_PARAMS_ID_NOT_FOUND]"
check_errors=$(zgrep 'Failed to perform task' *.gz | grep 'FLAVOR_PARAMS_ID_NOT_FOUND' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$check_errors"
echo ">>>> end check [FLAVOR_PARAMS_ID_NOT_FOUND]"

echo ">>>> check [RECORDED_ENTRY_LIVE_MISMATCH]"
check_errors=$(zgrep 'Failed to perform task' *.gz | grep 'RECORDED_ENTRY_LIVE_MISMATCH' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$check_errors"
echo ">>>> end check [RECORDED_ENTRY_LIVE_MISMATCH]"

echo ">>>> check [HTTP Error 503: Service Temporarily Unavailable]"
check_errors=$(zgrep 'Failed to perform task' *.gz | grep 'HTTP Error 503: Service Temporarily Unavailable' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$check_errors"
echo ">>>> end check [HTTP Error 503: Service Temporarily Unavailable]"

echo ">>>> check [No such file or directory]"
check_errors=$(zgrep 'Failed to perform task' *.gz | grep 'No such file or directory' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$check_errors"
echo ">>>> end check [No such file or directory]"

echo ">>>> check [ENTRY_ID_NOT_FOUND]"
check_errors=$(zgrep 'Failed to perform task' *.gz | grep 'ENTRY_ID_NOT_FOUND' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$check_errors"
echo ">>>> end check [ENTRY_ID_NOT_FOUND]"

">>>> check [already exists]"
check_errors=$(zgrep 'Failed to perform task' *.gz | grep 'already exists' | tr -s ' ' | cut -d ' ' -f 6 | sort | uniq)
echo "$check_errors"
echo ">>>> end check [already exists]"

