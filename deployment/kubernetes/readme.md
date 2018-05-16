
export NAME=live.a.rtc.kaltura.com
export KOPS_STATE_STORE=s3://live.a.rtc.kaltura.com
kops create cluster --zones eu-west-1a,eu-west-1b,eu-west-1c --node-count=1 --node-size c5.2xlarge $NAME 
kops edit cluster $NAME 



kubectl apply -f ./deployment/kubernetes/config.yaml
kubectl apply -f ./deployment/kubernetes/live-front.yaml
kubectl apply -f ./deployment/kubernetes/live-publish.yaml

kubectl scale  sts live-publish --replicas=0


#find live -mtime +3  -ls -exec rm {} \;