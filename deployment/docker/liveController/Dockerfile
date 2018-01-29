#docker build -t kaltura/livecontroller:1.26 .
#docker run -d -v /myconfig/:/myconfig/ -v /var/log/liveController/:/var/log/liveController/ --network=host kaltura/livecontroller:1.26 ubuntudrm
#docker exec -it
FROM node:boron AS build

#RUN apk add --update build-base curl nasm tar bzip2 zlib-dev yasm-dev

RUN apt-get update && apt-get install -y nasm

WORKDIR /opt/kaltura/liveController/
COPY package*.json ./
RUN npm install


COPY ./build_scripts/ ./build_scripts/
COPY ./node_addons/ ./node_addons/
RUN ./build_scripts/build_ffmpeg.sh /tmp/ 3.0
RUN ./build_scripts/build_addon.sh /opt/kaltura/liveController/ /tmp/ffmpeg-3.0/

COPY ./ ./

RUN rm -rf ./build

FROM node:boron-slim


WORKDIR /opt/kaltura/liveController/

COPY --from=build /opt/kaltura/liveController/ ./

ARG CONF_FOLDER=/myconfig/
VOLUME /var/log/liveController/
#config folder
VOLUME $CONF_FOLDER
#content folder
VOLUME /web/content/kLive



COPY ./deployment/registerNodeAndRun.sh .
RUN chmod +x registerNodeAndRun.sh

ENTRYPOINT ["./registerNodeAndRun.sh"]