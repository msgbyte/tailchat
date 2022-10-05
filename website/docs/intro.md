---
sidebar_position: 1
title: 概述
---

`Tailchat` 是一款插件化易拓展的开源 IM 应用。可拓展架构赋予 `Tailchat` 无限可能性。

前端微内核架构 + 后端微服务架构 使得 `Tailchat` 能够驾驭任何定制化/私有化的场景

## 特性

- 完整的即时通讯基础能力
- 插件化架构的赋予的自由拓展能力
- 微服务架构赋予的水平拓展能力

## 技术栈

- 前端
  - `React`
  - `Redux`
  - `MiniStar`
  - `tailwindcss`
  - `iconify`
- 后端
  - `Nodejs`
  - `Socket.io`
  - `koa`
  - `moleculer`

## 功能列表

- 用户管理
  - 基于4位数字标识(战网like)的用户名系统
  - 好友管理
- 聊天系统
  - 私聊
  - 群聊
  - 富文本消息
    - 图片
    - 链接
    - 提及(@)
    - 代码
- 插件系统
  - 前端插件系统(基于`ministar`的微内核架构)
    - 自定义主题
    - 自定义面板
    - 自定义操作
    - 消息内容转换
    - ...
  - 后端插件系统(基于`moleculer`的微服务架构)
- 开放平台
  - Connect ID
  - *(其他正在开发中)*
- 快速跳转


## 截图

#### 插件中心

![](/img/intro/plugins.png)

#### 各类主题

![](/img/intro/theme.png)

#### Github订阅机器人

![](/img/intro/github-bot.png)

## 开源协议

开源协议请主要参考以下文档:

[Apache 2.0](https://github.com/msgbyte/tailchat/blob/master/LICENSE)
