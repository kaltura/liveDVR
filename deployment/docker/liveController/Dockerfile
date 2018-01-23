#docker build -t kaltura/livecontroller:1.26 .
#docker run -d -v /myconfig/:/myconfig/ -v /var/log/liveController/:/var/log/liveController/ --network=host kaltura/livecontroller:1.26 ubuntudrm

FROM node:boron AS addon

WORKDIR /opt/kaltura/liveDVR/
COPY package*.json ./
RUN npm install

RUN mkdir -p build_scripts
RUN mkdir -p node_addons

COPY build_scripts build_scripts
COPY node_addons node_addons
RUN build_scripts/build_ffmpeg.sh /tmp/ 3.0
RUN build_scripts/build_addon.sh /opt/kaltura/liveDVR/ /tmp/ffmpeg-3.0/

FROM node:boron

COPY . .
COPY --from=addon /opt/kaltura/liveDVR/bin/ bin/
COPY --from=addon /opt/kaltura/liveDVR/node_modules node_modules/

ARG CONF_FOLDER=/myconfig/
VOLUME /var/log/liveController/
#config folder
VOLUME $CONF_FOLDER
#content folder
VOLUME /web/content/kLive

RUN chmod +x registerNodeAndRun.sh

ENTRYPOINT ["./registerNodeAndRun.sh"]