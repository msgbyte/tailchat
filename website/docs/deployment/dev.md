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

### Example

Here is a minimal example `.env` which let you can run tailchat in development environment.

```ini
PORT=11000
MONGO_URL=mongodb://127.0.0.1:27017/tailchat
REDIS_URL=redis://localhost:6379/
MINIO_URL=127.0.0.1:19000
MINIO_USER=tailchat
MINIO_PASS=com.msgbyte.tailchat
```

## Node Version

Tailchat is develop with `nodejs`, please install nodejs by yourself, here is nodejs official: [https://nodejs.org/](https://nodejs.org/)

Suggestion to use `nodejs18.x`, and not support `nodejs20` yet because nodejs has some break change.

## Start the development server

```bash
pnpm install
pnpm dev
```

You can edit the configuration of `server/.env` to your own relevant context

The file can be started from `server/.env.example`

Now you can preview your server in `http://localhost:11011`

## Project directory description

- `apps`: non-core applications
  - `cli`: Tailchat’s command line program
  - `github-app`: Tailchat’s github integration bot
  - `oauth-demo`: Tailchat open platform third-party login demo program
  - `widget`: Web page embedded widget
- `client`: client
  - `desktop`: desktop version
  - `mobile`: mobile version
  - `packages`: dependency packages
  - `shared`: platform-independent common code
  - `web`: web version
    - `plugins`: pure frontend plugins
    - `src`: source code
- `packages`
  - `types`: common types for both front and back ends
- `server`: server
  - `admin`: background management
  - `models`: database model
  - `plugins`: server-side plugins
  - `services`: microservices
- `website`: official website
