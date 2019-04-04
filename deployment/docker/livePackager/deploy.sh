#!/bin/bash

nginxVersion=1.11.0

wget http://nginx.org/download/nginx-${nginxVersion}.tar.gz
tar -zxvf nginx-${nginxVersion}.tar.gz
rm nginx-${nginxVersion}.tar.gz -f
mv nginx-${nginxVersion} nginx

echo "pulling nginx-secure-token-module"
git clone https://github.com/kaltura/nginx-secure-token-module

echo "pulling nginx-vod-module"
git clone https://github.com/kaltura/nginx-vod-module

echo "pulling nginx_requestid"
git clone https://github.com/kaltura/nginx_requestid

echo "pulling headers-more-nginx-module"
git clone https://github.com/openresty/headers-more-nginx-module

echo "pulling headers-more-nginx-module"
git clone https://github.com/openresty/headers-more-nginx-module

echo "pulling nginx_mod_akamai_g2o"
git clone https://github.com/kaltura/nginx_mod_akamai_g2o
