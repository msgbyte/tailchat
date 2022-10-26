---
sidebar_position: 4
title: Docker Compose 部署
---

## 前置环境

### Docker / Docker Compose

首先需要确保有 `Docker / Docker Compose` 环境

安装方式可参考 : [安装 Docker 环境](./install-docker.md)

## 拉取镜像

你可以通过从[公共镜像拉取已经编译好的镜像](#从公共镜像中拉取)或者[通过源码手动编译](#从源码中编译)

### 从公共镜像中拉取

**新人推荐**

> 使用已经编译好的镜像可以无需花费足够的计算机资源进行编译，对小资源配置的服务器会十分友好。另外相对于源码编译，公共镜像的代码更加稳定。

```bash
docker pull moonrailgun/tailchat
docker tag moonrailgun/tailchat tailchat # 修改tag以让配置文件能够识别
```

### 从源码中编译

**适用于高级玩家**

#### 编译环境 node 环境

- 从[官网下载](https://nodejs.org/en/download/)
- 或者使用[nvm](https://github.com/nvm-sh/nvm)

#### 安装pnpm

`pnpm` 是一个`nodejs`的包管理工具, 是`npm`的替代品, 为了确保能有与开发者一样依赖环境，强烈建议你使用pnpm作为后续的包管理工具

```bash
npm install -g pnpm
```

#### Clone 项目

将项目从远程下载到本地:

```bash
mkdir msgbyte && cd msgbyte

git clone https://github.com/msgbyte/tailchat.git # 克隆项目到本地
```

#### 编译项目

```bash
docker-compose build
```

*编译对服务器配置有一定要求，2核4G编译约10分钟，供参考*

编译完毕后可以通过 `docker images` 查看编译完毕的镜像。

## 启动项目

> 如果你是通过公共镜像拉取的应用
> 需要手动下载配置文件与配置环境变量以一键启动: 
> - [docker-compose.yml](https://raw.githubusercontent.com/msgbyte/tailchat/master/docker-compose.yml)
> - [docker-compose.env](https://raw.githubusercontent.com/msgbyte/tailchat/master/docker-compose.env)

在启动之前需要修改一下配置

修改 `docker-compose.env` 文件的配置，以下字段推荐修改:

- `API_URL` 对外可访问的url地址，用于文件服务访问, 可以是域名也可以是ip
- `SECRET` 服务端加密秘钥，用于生成Token. 默认为 `tailchat`

完成配置后使用`docker-compose` 一键启动 `Tailchat` 应用:

```bash
cd tailchat
docker-compose up -d
```

访问: `http://<server ip>:11000` 即可打开tailchat

注意部分云服务可能需要手动开放防火墙端口。

*在`docker-compose.env`文件中提供了部分环境变量可供配置。*

`tailchat` 的`docker-compose.yml`配置默认提供了如下配置:

- `mongodb`: 持久化数据库
- `redis`: KV数据库与消息中转服务
- `minio`: 分布式文件服务

其中持久化文件(数据库, 文件存储)通过 `docker volume` 统一管理:

```
docker volume ls | grep "tailchat-server"
```
