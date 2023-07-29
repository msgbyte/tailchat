---
sidebar_position: 20
title: Livekit 插件部署指南
---

`Livekit` 是一款基于 `Apache-2.0` 开源协议的，允许自部署的开源视频会议解决方案，支持视频会议、视频直播、录制等场景

你可以使用他的云端服务或者自部署。以下我会介绍怎么将 `Livekit` 集成到 `Tailchat` 中:

## 云端服务

首先进入Livekit云平台: [https://cloud.livekit.io/](https://cloud.livekit.io/), 首次进入要创建一下项目:

此时会问一些问题，按照情况随便回答一下就行

![](/img/advanced-usage/livekit/1.png)

完成后我们会进入控制台主界面:

![](/img/advanced-usage/livekit/2.png)

### 获取需要的环境变量

为使插件工作，我们需要以下环境变量:

- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`

其中 `LIVEKIT_URL` 我们可以直接从控制台上获取，形如 `wss://********.livekit.cloud`

在左边 `Settings` 菜单中，我们需要自行创建一对秘钥

![](/img/advanced-usage/livekit/3.png)

![](/img/advanced-usage/livekit/4.png)

![](/img/advanced-usage/livekit/5.png)

在这里我们可以获取到 `LIVEKIT_API_KEY` 和 `LIVEKIT_API_SECRET`.

记录下来填入环境变量后启动 `Tailchat` 即可.

### 启动 webhook

![](/img/advanced-usage/livekit/6.png)

如果你需要上述的频道在线提示能够即时更新，则需要单独启动一个 `webhook-receiver` 来接受来自 `livekit` 的推送并将接收到的事件转发给 `Tailchat`，让 `Tailchat` 来更新所有群组成员的显示。

官方已为您准备好了一键启动的`docker-compose`配置, 就像 `admin` 一样:

```bash
wget https://raw.githubusercontent.com/msgbyte/tailchat/master/docker/livekit.yml 
docker compose -f docker-compose.yml -f livekit.yml up -d 
```

此时你可以在docker运行的容器中看到一个 `tailchat-livekit-webhook-receiver` 服务.

然后我们切换到 `livekit` 控制台，在 `webhook` 中添加我们的地址。

![](/img/advanced-usage/livekit/7.png)

一般为 `https://<your tailchat url>/livekit/webhook`, 记得选择与服务一致的密钥对

![](/img/advanced-usage/livekit/8.png)

> PS: 在云端应用可能会有一些延时。

## 自部署

自部署可见官方文档: [https://docs.livekit.io/oss/deployment/](https://docs.livekit.io/oss/deployment/)

除了部署方式不一样与配置为先，其他的与使用云端服务一样
