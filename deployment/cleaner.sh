function cleaner {

    for folder in "${folders[@]}";
    do
        folderToClean="${BASE_DIR}/${folder}"
        echo "deleting files older than $DAYS_TO_KEEP days in $folderToClean"
        $folderToClean && find $folderToClean -type f -mtime +DAYS_TO_KEEP -delete
        echo "deleting empty folders  older than $DAYS_TO_KEEP days in $folderToClean"
        $folderToClean && find $folderToClean -type d -mtime +$DAYS_TO_KEEP -delete
    done
}

cleaner