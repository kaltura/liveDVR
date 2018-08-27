FROM alpine

RUN apk add --update bash && rm -rf /var/cache/apk/*

WORKDIR /bin/scripts/

COPY ./deployment/runtimeScripts/cleaner.sh ./cleaner.sh
COPY ./deployment/runtimeScripts/recordingCleaner.sh ./recordingCleaner.sh
COPY ./deployment/runtimeScripts/liveCleaner.sh ./liveCleaner.sh

RUN echo "SHELL=/bin/bash" >> /var/spool/cron/crontabs/root
RUN echo "* * * * * /bin/scripts/liveCleaner.sh >> /var/log/liveCleaner.log 2>&1" >> /var/spool/cron/crontabs/root
RUN echo "* * * * * /bin/scripts/recordingCleaner.sh >> /var/log/recordingCleaner.log 2>&1"  >> /var/spool/cron/crontabs/root

ENV BASE_DIR /web/content/kLive
ENV DAYS_TO_KEEP_LIVE 1
ENV DAYS_TO_KEEP_RECORDINGS 2

CMD crond -l 2 -f