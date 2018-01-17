FROM debian:stretch-slim


RUN  apt-get update \
  && apt-get install -y wget git zlib1g-dev  build-essential libpcre3 libpcre3-dev  libssl-dev \
  && rm -rf /var/lib/apt/lists/*
