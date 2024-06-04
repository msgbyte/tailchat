---
sidebar_position: 99
title: 开发环境
---

对于开发环境的搭建，Tailchat 提供了非常简单快捷的方式:

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

### 示例

这是一个 ".env" 的最小示例，可让您在开发环境中运行 `tailchat`。

```ini
PORT=11000
MONGO_URL=mongodb://127.0.0.1:27017/tailchat
REDIS_URL=redis://localhost:6379/
MINIO_URL=127.0.0.1:19000
MINIO_USER=tailchat
MINIO_PASS=com.msgbyte.tailchat
```

## Node Version

Tailchat 是使用 `nodejs` 进行开发的，请自行安装nodejs, 这里是nodejs的官方网站: [https://nodejs.org/](https://nodejs.org/)

建议使用 `nodejs18.x` 因为目前还不支持 `nodejs20.x`(nodejs 20 有一些break change)

## 启动开发服务器

```bash
pnpm install
pnpm dev
```

可以编辑`server/.env`的配置为自己相关的上下文

该文件可以从 `server/.env.example` 开始

现在你可以在 `http://localhost:11011` 访问你的 Tailchat 服务了

## 项目目录说明

- `apps`: 非核心应用
  - `cli`: Tailchat 的命令行程序
  - `github-app`: Tailchat 的github集成机器人
  - `oauth-demo`: Tailchat 开放平台第三方登录演示程序
  - `widget`: 网页嵌入小部件
- `client`: 客户端
  - `desktop`: 桌面端
  - `mobile`: 移动端
  - `packages`: 依赖包
  - `shared`: 平台无关的通用代码
  - `web`: 网页端
    - `plugins`: 纯前端插件
    - `src`: 源码
- `packages`
  - `types`: 前后端通用类型
- `server`: 服务端
  - `admin`: 后台管理
  - `models`: 数据库模型
  - `plugins`: 服务端插件
  - `services`: 微服务
- `website`: 官网
  