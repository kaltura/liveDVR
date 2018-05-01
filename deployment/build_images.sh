#!/bin/bash
cd "$(dirname "$0")"
lastdir=`pwd`
tag=test

if [[ $@ == *'push'* ]]; then
    echo "ecs login"
    eval `aws ecr get-login --no-include-email --region eu-west-1`
fi

if [[ $@ == *'liveController'* ]] || [[ $@ == *'all'* ]] ; then
    echo "Build live-controller"
    docker build -t  kaltura/live-controller -f ./docker/liveController/Dockerfile ../
    echo "tag live-controller"
    docker tag kaltura/live-controller 983882572364.dkr.ecr.eu-west-1.amazonaws.com/live-controller:$tag
    if [[ $@ == *'push'* ]]; then
        echo "push live-controller"
        docker push 983882572364.dkr.ecr.eu-west-1.amazonaws.com/live-controller:$tag
    fi
fi

if [[ $@ == *'livePackcager'* ]] || [[ $@ == *'all'* ]] ; then
    echo "Build live-packager"
    docker build -t  kaltura/live-packager -f ./docker/livePackager/Dockerfile ../
    echo "tag live-packager"
    docker tag kaltura/live-packager 983882572364.dkr.ecr.eu-west-1.amazonaws.com/live-packager:$tag
    if [[ $@ == *'push'* ]]; then
        echo "push live-packager"
        docker push 983882572364.dkr.ecr.eu-west-1.amazonaws.com/live-packager:$tag
    fi
fi

if [[ $@ == *'liveRecorder'* ]] || [[ $@ == *'all'* ]] ; then
    echo "Build live-recorder"
    docker build -t  kaltura/live-recorder -f ./docker/liveRecorder/Dockerfile ../
    echo "tag live-recorder"
    docker tag kaltura/live-recorder 983882572364.dkr.ecr.eu-west-1.amazonaws.com/live-recorder:$tag
    if [[ $@ == *'push'* ]]; then
        echo "push live-recorder"
        docker push 983882572364.dkr.ecr.eu-west-1.amazonaws.com/live-recorder:$tag
    fi
fi




cd $lastdir