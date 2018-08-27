

function cleaner() {
    local BASE_DIR=$1
    local DAYS_TO_KEEP=$2


    for folder in "${FOLDER_TO_COPY[@]}";
    do
        folderToClean="${1}/${folder}"
        echo "deleting files older than $DAYS_TO_KEEP days in $folderToClean"
        find $folderToClean -type f -mtime +$DAYS_TO_KEEP -delete
        echo "deleting empty folders  older than $DAYS_TO_KEEP days in $folderToClean"
        find $folderToClean -type d -mtime +$DAYS_TO_KEEP -delete
    done
}

