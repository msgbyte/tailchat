---
sidebar_position: 1
title: 快速开始
---

<iframe src="//player.bilibili.com/player.html?aid=853731563&bvid=BV1aL4y1c7QM&cid=710880091&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" />

[在B站观看](https://www.bilibili.com/video/BV1aL4y1c7QM)

## 前端代码

拉取前端源码:

```bash
git clone https://github.com/msgbyte/tailchat

cd tailchat
```

### 方法一: 使用预编译好的镜像 使用docker-compose 一键启动

请确保已经安装了:
- docker
- docker-compose

*如果不会安装docker可以查看 [安装教程](./install-docker.md) *

```bash
docker pull moonrailgun/tailchat:latest
docker tag moonrailgun/tailchat:latest tailchat-web
SERVICE_URL=http://[Server IP]:11000 docker-compose up -d
```

访问 `http://[Server IP]:11011` 即可访问到Tailchat的前端页面

**`[Server IP]`请换成服务端的ip或者绑定的域名, 11000为服务端默认端口号**

**如果有条件的建议使用https协议，在此不进行赘述**

### 方法二: 使用 docker-compose 一键编译并部署

请确保已经安装了:
- docker
- docker-compose

*如果不会安装docker可以查看 [安装教程](./install-docker.md) *

```bash
docker-compose build
SERVICE_URL=http://[Server IP]:11000 docker-compose up -d
```

访问 `http://[Server IP]:11011` 即可访问到Tailchat的前端页面

**`[Server IP]`请换成服务端的ip或者绑定的域名, 11000为服务端默认端口号**

**如果有条件的建议使用https协议，在此不进行赘述**


### 方法三: 手动编译

**请确保安装了node环境（建议node版本大于 16.x）**

编译服务依赖 `pnpm` 进行依赖管理

> pnpm 是 npm 的替代品, 更多信息可见 [https://pnpm.io/](https://pnpm.io/)

```bash
npm install -g pnpm # 如果在此之前没有安装过pnpm

pnpm install
cd web # 切换到web目录
```

创建/修改 `.env` 设置环境变量

```ini
SERVICE_URL=http://127.0.0.1:11000
```
环境变量:
- `SERVICE_URL`: 后端服务的地址
- `PORT`: 前端开发环境的端口(`pnpm dev`)

编译代码
```
pnpm build
```

使用任意http代理 `web/dist` 目录即可，注意需要支持spa的fallback机制
- 使用 `http-server-spa` 进行前端文件代理: `npx http-server-spa ./web/dist index.html 11011`
  - `11011` 为 `Tailchat` 的默认端口号，可以改成任意想要的端口

## 后端服务

拉取后端源码:

```bash
git clone https://github.com/msgbyte/tailchat-server

cd tailchat-server
```

### 单节点部署

#### 方法一: docker-compose 拉取预编译好的镜像并部署 (推荐)

请确保已经安装了:
- docker
- docker-compose

*如果不会安装docker可以查看 [安装教程](./install-docker.md) *

修改 `docker-compose.env` 中的 `API_URL` 配置，将其改为服务端可访问的url

在项目根目录下执行
```bash
docker pull moonrailgun/tailchat-server:latest
docker tag moonrailgun/tailchat-server:latest tailchat-server
docker-compose up -d
```

#### 方法二: docker-compose 一键构建并部署

请确保已经安装了:
- docker
- docker-compose

*如果不会安装docker可以查看 [安装教程](./install-docker.md) *

修改 `docker-compose.env` 中的 `API_URL` 配置，将其改为服务端可访问的url

在项目根目录下执行
```bash
docker-compose build # 需要编译
docker-compose up -d
```

### k8s集群部署

TODO

### 服务端插件安装方式

安装所有插件
```
pnpm plugin:install all
```

安装单个插件
```
pnpm plugin:install com.msgbyte.tasks
```
