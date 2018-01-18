#Missing:
# * Get configuration file (probably need to mount a specific volume)
FROM node:boron

WORKDIR /opt/kaltura/liveDVR/
COPY package*.json ./
RUN npm install

COPY . .
RUN build_scripts/build_ffmpeg.sh . 3.0
RUN build_scripts/build_addon.sh /opt/kaltura/liveDVR/ /opt/kaltura/liveDVR/ffmpeg-3.0/

ENTRYPOINT ["node","lib/App.js"]