---
sidebar_position: 2
title: 部署视频会议
---

:::info
`Tailchat Meeting` 方案目前没有与 `Tailchat` 做集成，如果你期望在Tailchat中使用视频会议方案请选择 `agora` 或 `livekit` 解决方案
:::

视频会议服务 `Tailchat Meeting` 可以作为一个独立应用单品存在。在本节中将会讲述如何独立部署 `Tailchat Meeting`

以下内容均基于`docker`环境，请确保服务端有 `docker` 最基本程度的环境。

如果还没有安装 `docker` + `docker-compose` 可以查看文档 [安装docker环境](../deployment/install-docker.md)

## 快速部署

```bash
git clone https://github.com/msgbyte/tailchat-meeting --depth=1
```


> NOTE: 接下来会使用docker 的 host 模式进行安装。即`docker-compose` 会自动绑定主机端口

需要服务器预留端口如下:
- swag(服务器网关, nginx 强化版, 端口可通过配置文件 tailchat-meeting/compose/nginx.conf 修改)
  - 80
  - 443
- tailchat-meeting
  - 13001
  - 40000-49999(用于RTC服务, 动态占用)
- redis
  - 6379

**以上端口均会在宿主机上暴露，为了服务器安全着想建议配置合适的防火墙策略，仅暴露必要的端口443和40000-49999**

```bash
cd tailchat-meeting/compose
cp docker-compose.env.example docker-compose.env
vi docker-compose.env
```

修改环境变量。
环境变量如下:

```
# 内网IP
MEDIASOUP_IP=
# 公网IP
MEDIASOUP_ANNOUNCED_IP=

# swag相关
URL=
SUBDOMAINS=
TZ=Asia/Shanghai
```

其中
- 如果仅单机部署的话`MEDIASOUP_IP`和`MEDIASOUP_ANNOUNCED_IP`可以均填写服务器公网ip, **但是对于弹性部署网络的服务商(如国内的腾讯云，阿里云等)必须严格按照注释分别填写内网IP和公网IP**(因为该类服务商提供的外网IP并不是绑定在网卡上的)
- `tailchat-meeting` 基于 webrtc 服务，因此强依赖 https/wss 协议。swag服务可以为您自动申请https证书，但是必须得分配一个有效的域名，并确保dns指向已经指向到服务器上。
  - 更多相关的文档可以查看 [README](https://github.com/linuxserver/docker-letsencrypt/blob/master/README.md)
  - 示例配置:
  ```bash
  URL=meeting.example.com # 这里请填入
  SUBDOMAINS= # 该参数用于多域名证书申请，可留空
  ```


修改完毕以后可以直接执行以下命令

```bash
docker compose up -d
```

`docker compose` 会自动从网络下载镜像并构建`tailchat-meeting`

构建可能需要花费一定时间和资源。特别是构建前端代码，如果使用的小配置的服务器的话请耐心一点等待。

> 实际测试中使用1核2g的小资源服务器耗时参考如下:
> - 下载依赖包: 3分钟
> - 编译前端代码: 5分钟

访问 `https://meeting.example.com` 即可看到`tailchat-meeting`的页面

## 组合使用

对于傻瓜式部署来说只需要一键就可以执行。如果已经有现成的网关服务(比如nginx, caddy等)以及redis实例，可以有选择的启动服务。

如:

```bash
docker compose up tailchat-meeting -d # 仅运行 tailchat-meeting 实例
```


## 使用host模式的原因

`tailchat-meeting` 核心的RTC服务需要在运行时申请端口，但是对于docker来说并不能实现这个功能。而预先申请一定范围的端口绑定即会造成无意义端口的浪费也会在启动时瞬间占据大量资源并把系统打死。

**需要注意的是请不要把redis所在的6379端口暴露出去，这可能会产生安全隐患。**
