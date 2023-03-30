---
sidebar_position: 2
title: Github 集成
---

:::caution
该篇内容仍在调整中...
:::

![](/img/github-app/github-integration.excalidraw.png)

## 普通用户使用

### 在项目安装应用

地址: https://github.com/apps/tailchat

安装到项目仓库中。

### 在项目中进行配置

在根目录创建 `.tailchat/topic.json` 文件:
```json
{
  "groupId": "<your-notify-group-id>",
  "panelId": "<your-topic-panel-id>"
}
```

## 自部署配置


应用启动前需要在github中注册一个应用: 

![](/img/github-app/github-new-app.png)

部署时需要配置以下环境变量:
- `APP_ID`: 来自github 应用设置
- `WEBHOOK_SECRET`: 来自github 应用设置
- `PRIVATE_KEY`: 来自github 应用设置
- `TAILCHAT_APP_ID`: Tailchat 开放平台的id
- `TAILCHAT_APP_SECRET`: Tailchat 开放平台的秘钥
- `TAILCHAT_API_URL`: Tailchat 后台地址

为获取 `TAILCHAT_APP_ID` 与 `TAILCHAT_APP_SECRET` 需要在 Tailchat 开放平台中创建一个开放平台应用

同时开启机器人权限，并设置消息回调地址: `https://<your_app_url>/message/webhook`

### 部署开放平台应用

> 源码: [https://github.com/msgbyte/tailchat/tree/master/apps/github-app](https://github.com/msgbyte/tailchat/tree/master/apps/github-app)

拉取源码后部署到可供访问的线上，提供两种方式:

- 独立应用: `npm run build` 后执行 `node lib/index.js`运行应用
- Vercel: 直接推送到Vercel即可
