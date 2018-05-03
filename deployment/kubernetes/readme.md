kubectl apply -f ./deployment/kubernetes/live-front.yaml
kubectl apply -f ./deployment/kubernetes/live-publish.yaml

kubectl scale  sts live-publish --replicas=0
