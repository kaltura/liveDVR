## Synopsis

This project is used to synchronize decoding time stamp (DTS) and a presentation time stamp (PTS) of TS files.

## Code Example

var nativePtsAligner = require('TsRebase.node');
var singleFileAlignmentPromise =
qio.read(filenameToProcess), "b") // Read binary data into a buffer
.then(function(dataBuffer) {
var chunkDuration = nativePtsAligner.rebaseTs(context, dataBuffer,universalTsTimestamp);
qio.write(filenameToProcess, dataBuffer);
});

Where context is an updated object, and intializaed with "{expectedDts : 90000}", and universalTsTimestamp is boolean variable (true/false), specifies whether the time stamp are universal or not.

## Motivation

Since after stop/start event, Wowza reset the PTS/DTS, which misbehave the players.

## Installation

1. First we need to set up an npm-compatible package. Use npm init in a new directory to create the skeleton package.json.
2. Install nan module with version of 1.8.4, i.e. write in the command line:  npm install nan@1.8.4 --save
3. If you don't have node-gyp installed, use sudo npm install node-gyp -g to install it.
4. Run node-gyp configure to set up the build fixtures. In the ./build/ directory, a Makefile and associated property files will be created on Unix systems and a vcxproj file will be created on Windows.
5. Next, run node-gyp build to start the build process and watch your addon compile. You can use node-gyp build again to incrementally recompile changed source files. Alternatively you can use node-gyp rebuild to combine the configure and build steps in one.
6. The binary file should be be located at ./build/Release/TsRebase.node 



### Copyright & License

https://github.com/nodejs/node-addon-examples/blob/master/1_hello_world/README.md

Copyright © Kaltura Inc. All rights reserved.
