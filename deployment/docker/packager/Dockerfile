FROM live-base-image

WORKDIR /opt

COPY deploy.sh .

RUN ./deploy.sh
#ADD /Users/guyjacubovski/dev/nginx-vod-module-saas /opt/nginx-vod-module-saas


WORKDIR  /opt/nginx
# --add-module=/opt/headers-more-nginx-module/
# --add-module=/opt/nginx_mod_akamai_g2o/
RUN ./configure --with-http_secure_link_module  --add-module=/opt/nginx-vod-module/ --add-module=/opt/nginx-secure-token-module/ --add-module=/opt/nginx_requestid/ --with-http_stub_status_module --with-file-aio --with-threads --with-cc-opt="-O3 -DDISABLE_PTS_DELAY_COMPENSATION" --conf-path=/opt/nginx-vod-module-saas/conf/nginx.conf
#RUN ./configure  --without-http_gzip_module --with-http_secure_link_module --add-module=--add-module=../nginx-vod-module --with-debug --with-cc-opt="-O0 -DDISABLE_PTS_DELAY_COMPENSATION"
RUN make && make install