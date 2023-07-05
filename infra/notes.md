# Notes on kubernates

This is some personal notes I wrote for kubernates.

## General Comments

- Services - Provide networking between pods, they are split into 4, mostly the first 2 are used.
  1. Cluter IP - Sets a url to access a pod, only exposes pods in the cluster.
  1. Load Balancer - Makes a pod accessible from outside, this is the right way to expose a pod to the outside world.
  1. Node Port - Makes a pod accessible from _outside_ the ccluter, used only for dev purposes.
  1. External Name - Redirects an in cluster request to a CNAME url.

## General Commands

Don't forget to start minikube using `minikube start`

- kubectl get pods - info about pods
- kubectl exec -it podname - executes commands in pods
- kubectl logs podname - logs of the pod
- kubectl delete pod - Deletes pod
- kubectl apply/delete -f configFile - Deletes or applies the config file.
- kubectl describe pod podname - Used mostly for events
- kubectl get deployments - Gets deployment
- kubectl describe deployment depname - Same as describe pod

## More Specific ones

- kubectl rollout restart deployment posts-depl - Used to update the deployment
