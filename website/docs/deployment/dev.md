---
sidebar_position: 99
title: Development environment
---

For setting up the development environment, tailchat provides a very simple and fast way:

## Use Docker to quickly build a dependent environment

**mongodb**
```bash
docker run -d --name mongo -p 27017:27017 mongo:4
```

**redis**
```bash
docker run -d --name redis -p 6379:6379 redis
```

**minio**
```bash
docker run -d \
  -p 19000:9000 \
  -p 19001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=tailchat" \
  -e "MINIO_ROOT_PASSWORD=com.msgbyte.tailchat" \
  minio/minio server /data --console-address ":9001"
```

### Start the development server

```bash
pnpm install
pnpm dev
```

You can edit the configuration of `server/.env` to your own relevant context

The file can be started from `server/.env.example`
