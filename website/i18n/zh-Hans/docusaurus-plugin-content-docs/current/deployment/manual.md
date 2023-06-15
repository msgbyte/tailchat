---
sidebar_position: 6
title: 手动部署
---

:::caution
本章内容需要你对 nodejs, git, linux 有一定程度的了解。当出现如依赖问题、环境问题、系统问题等问题时需要具备自行解决和排查问题的能力。

如果你对此并不了解，不建议你使用本章内容进行部署。建议使用统一镜像进行部署。
:::

## 依赖

- git
- nodejs v16.18.0 或以上
- pnpm v8.3.1 或以上
- mongodb
- redis
- minio

## 下载源码

```bash
mkdir msgbyte && cd msgbyte

git clone https://github.com/msgbyte/tailchat.git
```

### 切换到稳定代码

因为克隆下来的代码是最新代码，可能存在短时间内不稳定的情况，因此如果想要切换到各个版本的稳定代码的话可以使用git的tag功能

如切换到`v1.7.6`则可以使用命令:

```bash
git checkout v1.7.6
```

## 编译项目

Tailchat 是一个前后端分离的项目。因此我们要分别处理前端代码和后端代码

### 安装依赖

我们假设你已经安装了 `nodejs v16.18.0+` 或者以上的版本。以及安装了 `pnpm v8.3.1` 或以上版本

```bash
cd tailchat
pnpm install
```

该命令会花费一些时间，将Tailchat所有的依赖都安装一遍。当安装完毕后内部的插件会自动执行编译命令。

### 构建项目

```bash
NODE_ENV=production pnpm build
```

该命令会并行执行编译前端后端管理端的命令。并将前端产物移动到服务端的 `server/dist/public` 目录

当项目构建完毕后我们的产物就可以正常运行了

:::caution
请尽可能在 `macos` / `linux` 环境进行构建，window 对 shell 命令支持并不一定完全
:::

## 运行项目

为了确保项目能够水平扩容，`Tailchat` 的核心代码虽然写在同一个项目中，但是实际启动起来的时候可以被划分为多个细分的微服务。通过传入不同的环境变量的组合来实现有选择的启用不同的服务。

在server目录下以`.env.example`目录为例创建一个环境变量文件

```bash
cp server/.env.example server/dist/.env
vim .env
```

将必要的环境变量修改为自己的，如 `MONGO_URL`, `REDIS_URL`, `MINIO_URL`

然后启动服务

```bash
SERVICEDIR=services,plugins pnpm start:service
```

> `SERVICEDIR` 表示加载微服务的目录
