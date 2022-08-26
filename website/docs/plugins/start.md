---
sidebar_position: 1
title: 开始开发插件
---

## 认识 MiniStar

`MiniStar` 是一套完整的微内核架构开发工具链，`tailchat`的插件架构就是基于 `MiniStar` 进行开发。

关于更多的 MiniStar 相关问题可以查看 MiniStar 的官方文档: [https://ministar.moonrailgun.com/](https://ministar.moonrailgun.com/)

## 创建一个基础项目

首先创建一个基本的 npm 项目, 并全局安装 `MiniStar`

```bash
npm install --global mini-star
```

在项目中执行: `ministar createPlugin` 来创建一个基本的插件

在项目中执行: `ministar buildPlugin` 来编译插件

> 值得一提的是， 虽然 `Tailchat` 并没有强制规定插件命名规范，但是还是推荐使用 `反域名` 的命名方式(类似于java中的包命名), 然后对插件中的部件，使用 `/` 进行分割
>
> 如:
> 插件名: `com.msgbyte.webview`
>
> 注册内容: `com.msgbyte.webview/grouppanel`

## 安装插件

### 手动安装插件

在不经过任何预设的情况下，一个通用的办法是自己构造一个 `manifest` 配置, 然后在 `tailchat` 提供手动安装插件 Tab 中将配置文件粘贴进去安装。

插件的url路径可以通过 `oss`/`static-server` 等办法代理

一个作为示例的`manifest`配置如下:

```json
{
  "label": "网页面板插件",
  "name": "com.msgbyte.webview",
  "url": "/plugins/com.msgbyte.webview/index.js",
  "version": "0.0.0",
  "author": "msgbyte",
  "description": "为群组提供创建网页面板的功能",
  "requireRestart": false
}
```

## 其他有用的资源

- 来自基础项目提供的API: [API 文档](./api/common)
- 导出接口源码
  - [@capital/common](https://github.com/msgbyte/tailchat/blob/master/web/src/plugin/common/index.ts)
  - [@capital/component](https://github.com/msgbyte/tailchat/blob/master/web/src/plugin/component/index.tsx)
