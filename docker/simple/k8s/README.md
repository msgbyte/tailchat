Its doc will tell you how to deploy `Tailchat` in kubeneters.

## One Command 

```bash
kubectl apply -f namespace.yml -f pv.yml -f mongo.yml -f minio.yml -f redis.yml -f tailchat.yml
```

if you wanna delete all resource, just replace `apply` to `delete`.

## Setup one by one

### Create Namespace

```bash
kubectl apply -f namespace.yml
```

### Create Persistent Volume

```bash
kubectl apply -f pv.yml
```

### Create Mongodb

```bash
kubectl apply -f mongo.yml
```

### Create Minio

```bash
kubectl apply -f minio.yml
```

### Create Redis

```bash
kubectl apply -f redis.yml
```

### Create Tailchat

```bash
kubectl apply -f tailchat.yml
```
