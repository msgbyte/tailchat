---
sidebar_position: 2
title: 安装docker环境
---

> 因为 `Tailchat` 的环境对于初学者来说有一些些复杂，因此提供了 `docker` 为主的一键环境搭建配置。但是对于`docker`不熟的同学来说可能`docker`本身也是一种复杂度。

> 因此为了方便大家可以快速搭建 `Tailchat`，提供了本文作为引导。对于 `docker` 有一定了解的同学可以跳过本篇

> 本文以 `linux centos` 为例，目标是方便大家直接在服务器上部署。对于想要在其他系统(`windows`, `mac`) 使用的同学可以参考官方文档进行`docker`的安装

## 一键安装 docker

官方维护的一键安装 `Docker` 脚本, 适合不喜欢研究细节的同学

在服务器终端按照以下操作依次执行即可

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

如果安装成功的话就可以跳过后续内容了。

## 手动安装docker与docker compose

官方文档: [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

```bash
# 如果之前有安装过docker可以执行以下命令删除旧的
sudo yum remove docker \
                docker-client \
                docker-client-latest \
                docker-common \
                docker-latest \
                docker-latest-logrotate \
                docker-logrotate \
                docker-engine
```


```bash
sudo yum install -y yum-utils # yum-utils 提供了 yum-config-manager 命令

sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

<!-- 安装docker 与 docker-compose 插件 -->
```bash
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

*PS: `docker-compose-plugin`提供了`docker compose`命令，用法同`docker-compose`*

> 如果`docker ps`显示守护进程没有启动(Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?)的话可以执行以下命令启动: `sudo systemctl start docker`

## 单独安装 docker-compose

如果购买的服务器已经预装了docker, 想要单独安装docker-compose的话可以看本节内容:

官方文档: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

```bash
curl -SL https://github.com/docker/compose/releases/download/v2.4.1/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose # 下载二进制文件
sudo chmod +x /usr/local/bin/docker-compose # 给予执行权限
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose # 软链接到path, 可以直接调用
docker-compose --version # 该行命令返回版本号则成功安装
```

## NOTICE

因为历史原因，`docker compose` 拥有`docker`插件版本与 `docker compose` 独立版本。一般意义上可以认为 `docker compose xxx` 与 `docker-compose xxx` 是等价的

## 参考文档

- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
