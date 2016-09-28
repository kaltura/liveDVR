#!/bin/bash
# An init.d script for running a Node.js process as a service using Forever as
# the process monitor. For more configuration options associated with Forever,
# see: https://github.com/nodejitsu/forever
#
# Live:              This shell script takes care of starting and stopping the Kaltura kLive Controller service
#
# chkconfig: 2345 85 15
# description: Kaltura Live Controller

### BEGIN INIT INFO
# Provides:          kLiveController
# Required-Start:    $local_fs $remote_fs $network
# Required-Stop:     $local_fs $remote_fs $network
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# X-Interactive:     true
# Short-Description: Start/stop Kaltura Live Controller
### END INIT INFO

NAME="recordingUploader"
KLIVE_CONTROLLER_PREFIX="/opt/kaltura/liveController/latest"
NODE_PATH="$KLIVE_CONTROLLER_PREFIX/node_modules"
FOREVER="$NODE_PATH/forever/bin/forever"
APPLICATION_PATH="$KLIVE_CONTROLLER_PREFIX/recordingUploader/main.py"
LOG_DIR="/var/log/liveController"
PID_DIR="/var/run"


start() {
    [ -d ${LOG_DIR} ] || mkdir -p ${LOG_DIR}
    RETVAL=0
    PIDFILE="$PID_DIR/${NAME}.pid"
    LOGFILE="$LOG_DIR/${NAME}-forever.log"
    if [ -f $PIDFILE ]; then
        echo "${NAME} already running"
    else
        echo "Starting ${NAME}"
        python $APPLICATION_PATH >> $LOGFILE  2>&1 &
        echo "started ${NAME} with pid $!"
        echo $! > $PIDFILE
	    RETVAL=$(( $RETVAL + $? ))
        fi
}

stop() {
    RETVAL=0
    LOGFILE="$LOG_DIR/${NAME}-forever.log"
    PIDFILE="$PID_DIR/${NAME}.pid"
    if [ -f $PIDFILE ]; then
        echo "Shutting down ${NAME}"
        # Tell Forever to stop the process.
        kill $( cat $PIDFILE ) >> $LOGFILE
        rm -f $PIDFILE
	    RETVAL=$(( $RETVAL + $? ))
            # Get rid of the pidfile, since Forever won't do that.
    else
        echo "${NAME} is not running."
    fi
}

restart() {
    stop
    start
}

status() {
    RETVAL=0
    PIDFILE="$PID_DIR/${NAME}.pid"
    if [ -f $PIDFILE ] ; then
	VAL=$( ( cat ${PIDFILE} | xargs ps -p ) | wc -l )
	   if [ $VAL -gt 1 ] ; then
            echo "${NAME} is running with PID $( cat $PIDFILE )"
        else
            echo "${NAME} is not running but there is stale pidFile: $PIDFILE"
            RETVAL=$(( $RETVAL + 1 ))
 	    fi
    else
            echo "${NAME} is not running."
	        RETVAL=$(( $RETVAL + 1 ))
    fi
}

killApp() {
    echo "Aggressively kill all Live processes"
    pkill -f $APPLICATION_PATH 
    echo "Remove all PID files"
    rm -f ${PID_DIR}/${NAME}*.pid
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    status)
        status
        ;;
    restart)
        restart
        ;;
    kill)
        killApp
        ;;
    *)
        echo "Usage: {start|stop|status|restart|kill}"
        exit 1
        ;;
esac
exit $RETVAL
