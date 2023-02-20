---
sidebar_position: 99
title: 开发环境
---

对于开发环境的搭建，tailchat 提供了非常简单快捷的方式:

## 使用Docker快速搭建依赖环境

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

### 启动开发服务器

```bash
pnpm install
pnpm dev
```

可以编辑`.env`的配置为自己相关的上下文
