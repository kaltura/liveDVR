#docker build -t  live-packager  .
#docker build -t  live-packager  .
#docker  docker  run --add-host pa-udrm:127.0.0.1   -v /Users/guyjacubovski/dev/nginx-vod-module-saas:/opt/nginx-vod-module-saas   -p 80:80  --name packager  -t live-packager
#docker exec -it d4987818178d bash

FROM live-base-image

ARG CONF_FOLDER=/opt/nginx-vod-module-saas
ARG CONF_FILE=/opt/nginx-vod-module-saas/conf/nginx.conf


#log folder
VOLUME /var/log/nginx

#config folder
VOLUME $CONF_FOLDER

#content folder
VOLUME /web/content/kLive

WORKDIR /opt

COPY deploy.sh .

RUN ./deploy.sh

WORKDIR  /opt/nginx
#
RUN ./configure --with-http_secure_link_module --add-module=/opt/nginx_mod_akamai_g2o/  --add-module=/opt/headers-more-nginx-module/  --add-module=/opt/nginx-vod-module/ --add-module=/opt/nginx-secure-token-module/ --add-module=/opt/nginx_requestid/ --with-http_stub_status_module --with-file-aio --with-threads --with-cc-opt="-O3 -DDISABLE_PTS_DELAY_COMPENSATION" --conf-path=$CONF_FILE
#RUN ./configure  --without-http_gzip_module --with-http_secure_link_module --add-module=--add-module=../nginx-vod-module --with-debug --with-cc-opt="-O0 -DDISABLE_PTS_DELAY_COMPENSATION"
RUN make && make install

EXPOSE 80

STOPSIGNAL SIGTERM


CMD ["/opt/nginx/objs/nginx", "-g", "daemon off;"]