#!/bin/bash

if [[ -z "$SERVER_NODE_HOST_NAME" ]]; then
    SERVER_NODE_HOST_NAME=`hostname -f`
fi

if [[ -n "$MY_POD_NAME" ]]; then
    export EC2_REGION=`echo $MY_NODE_NAME | cut -d'.' -f2`
    export SERVER_NODE_HOST_NAME="${MY_POD_NAME}.${EC2_REGION}"
fi