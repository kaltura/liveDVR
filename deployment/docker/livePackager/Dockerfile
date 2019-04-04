FROM debian:stretch-slim AS builder

ARG CONF_FILE=/opt/nginx-vod-module-saas/conf/nginx.conf


RUN  apt-get update \
  && apt-get install -y wget git procps zlib1g-dev  build-essential libpcre3 libpcre3-dev   libssl1.0-dev  \
  && rm -rf /var/lib/apt/lists/*


WORKDIR /opt

COPY ./deployment/docker/livePackager/deploy.sh .

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
COPY --from=builder /usr/lib/x86_64-linux-gnu/libcrypto.so.1.0.2 /usr/lib/x86_64-linux-gnu/libcrypto.so.1.0.2
COPY --from=builder /usr/local/nginx /usr/local/nginx

COPY ./packager/config/ /opt/nginx-vod-module-saas/conf/
COPY ./packager/www /opt/nginx-vod-module-saas/static/

#log folder
VOLUME /var/log/nginx

#content folder
VOLUME /web/content/kLive

#conf folder
VOLUME /usr/local/nginx/externalConf


ENV PACKAGER_PORT 80
ENV LIVE_ENCRYPT_HLS_KEY 1234

EXPOSE $PACKAGER_PORT

STOPSIGNAL SIGTERM

WORKDIR /usr/local/nginx

COPY ./deployment/docker/initScript.sh .
COPY ./deployment/docker/livePackager/entryPoint.sh   .

ENTRYPOINT ["./entryPoint.sh"]