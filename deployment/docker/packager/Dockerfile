#docker stop $(docker ps -a -q) && docker rm  $(docker ps -a -q)
#docker build -t  live-packager  .
#docker  run --add-host pa-udrm:127.0.0.1   -v /Users/guyjacubovski/dev/nginx-vod-module-saas:/opt/nginx-vod-module-saas   -p 80:80  --name packager  -t live-packager
#docker exec -it `docker ps | grep "live-packager" | awk '{print $1}'` bash


FROM debian:stretch-slim AS builder

ARG CONF_FOLDER=/opt/nginx-vod-module-saas
ARG CONF_FILE=/opt/nginx-vod-module-saas/conf/nginx.conf


RUN  apt-get update \
  && apt-get install -y wget git procps zlib1g-dev  build-essential libpcre3 libpcre3-dev   libssl1.0-dev  \
  && rm -rf /var/lib/apt/lists/*


WORKDIR /opt

COPY deploy.sh .

RUN ./deploy.sh

WORKDIR  /opt/nginx

RUN ./configure --with-http_secure_link_module \
                --add-module=/opt/nginx_mod_akamai_g2o/  \
                --add-module=/opt/headers-more-nginx-module/ \
                --add-module=/opt/nginx-vod-module/ \
                --add-module=/opt/nginx-secure-token-module/ \
                --add-module=/opt/nginx_requestid/ \
                --with-http_stub_status_module \
                --with-file-aio \
                --with-threads \
                --with-cc-opt="-O3 -DDISABLE_PTS_DELAY_COMPENSATION" \
                --conf-path=$CONF_FILE && \
    make && \
    make install



FROM debian:stretch-slim

ARG CONF_FOLDER=/opt/nginx-vod-module-saas

#copy build artifacts
COPY --from=builder /opt/nginx/objs/nginx /sbin/nginx
COPY --from=builder /usr/lib/x86_64-linux-gnu/libcrypto.so.1.0.2 /usr/lib/x86_64-linux-gnu/libcrypto.so.1.0.2
COPY --from=builder /usr/local/nginx /usr/local/nginx

#log folder
VOLUME /var/log/nginx

#config folder
VOLUME $CONF_FOLDER

#content folder
VOLUME /web/content/kLive


EXPOSE 80

STOPSIGNAL SIGTERM


CMD ["/sbin/nginx", "-g", "daemon off;"]