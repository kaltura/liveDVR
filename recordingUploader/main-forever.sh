#!/bin/sh

#  Script.sh
#  
#
#  Created by Ron Yadgar on 23/09/2016.
#
#!/bin/bash
# Store PID of script:
# Match script without arguments
start() {
    APPLICATION_PATH="$1"
    LOGFILE="$2"
    LCK_FILE=/tmp/`basename $0`.lck
    if [ -f "${LCK_FILE}" ]; then
    # The file exists so read the PID
    # to see if it is still running
        MYPID=`head -n 1 $LCK_FILE`
        if [ -n "`ps -p ${MYPID} | grep ${MYPID}`" ]; then
            echo `basename $0` is already running [$MYPID].
        exit
        fi
    fi
    # Echo current PID into lock file
    echo $$ > $LCK_FILE
    echo $$
while [ true ]; do
        echo "`date` STARTED pid ${LCK_FILE}" >> $LOGFILE
        python -u $APPLICATION_PATH >> LOGFILE 2>&1
        if ! [ -f "${LCK_FILE}" ]; then
        exit
        fi
        sleep 1
    done
}
stop() {
    APPLICATION_PATH="$1"
    LOGFILE="$2"
    LCK_FILE=/tmp/`basename $0`.lck
    if [ -f "${LCK_FILE}" ]; then
        # The file exists so read the PID
        # to see if it is still running
        MYPID=`head -n 1 $LCK_FILE`
        if ! [ -n "`ps -p ${MYPID} | grep ${MYPID}`" ]; then
            echo `basename $0` is not running
        exit
        fi
    fi
    rm -f $LCK_FILE
    echo `ps aux | grep "Python -u $APPLICATION_PATH"`
    pid=`ps aux | grep 'Python -u $APPLICATION_PATH' | awk '{ print $2 }'`
    echo "killing pid {$pid}"
    sudo kill $pid
}
case "$1" in
    start)
    echo "$#"
    if [ "$#" -ne 3 ]; then
        echo "Illegal number of parameters"
    exit
    fi

        start $2 $3
        ;;
    stop)
        stop  $2 $3
        ;;
    *)
        echo "Usage: {start|stop}"
        exit 1
        ;;
esac
