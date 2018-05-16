export BASE_DIR=/web/content/kLive/liveRecorder
export DAYS_TO_KEEP=30
export folders=("done" "error" "recordings/append" "recordings/newSession" )

source ./cleaner.sh

cleaner