---
sidebar_position: 1
title: 概述
---

`Tailchat` 提供两套方案用于视频语音通话，可以根据实际情况自行选择:
- `tailchat-meeting` 自部署视频会议(WIP)
- `agora` 声网集成, 详细说明见: [声网插件部署指南](./agora.md)

## Tailchat Meeting

视频会议模块是 `Tailchat` 系列的一套重要组成部分。提供能力如下:
- 语音通信
- 视频会话
- 屏幕共享
- 虚拟背景
- 文件传输
- 聊天记录

同时 `tailchat-meeting` 还可以作为独立单品存在，无需登录即可快速发起/加入会议

### 项目仓库

- 开源地址: [https://github.com/msgbyte/tailchat-meeting](https://github.com/msgbyte/tailchat-meeting)
- 开源协议: GPL-3.0

:::info 开源声明
本项目基于 [edumeet](https://github.com/edumeet/edumeet) 和 [mediasoup](https://github.com/versatica/mediasoup) 进行二次开发而来。

在此基础上进行了功能追加与SDK实现以及代码优化。如果想要找到开源协议更加宽松(MIT + ISC 协议)的实现可以看一下这两个项目
:::


### 项目架构

![](/img/architecture/meeting.excalidraw.svg)
