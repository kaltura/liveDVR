#!/bin/bash

SERVER_NODE_NAME=$1;shift
node deployment/addServerNode.js ${SERVER_NODE_NAME}
node lib/App.js $@