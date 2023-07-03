---
sidebar_position: 3
title: iam - 第三方登录
---

`com.msgbyte.iam`

`IAM` 插件提供第三方登录功能

目前支持:
- github

## 配置方式

### Github

在 `Github` 中创建 OAuth 应用。获得 `Client ID` 与 `Client secrets`

配置`Github`应用的授权回调地址`Authorization callback URL` 为 `{API_URL}/api/plugin:com.msgbyte.iam/github/redirect`。注意，`API_URL` 为环境变量中的值，两者应当保持一致。

配置Tailchat环境变量:

- IAM_GITHUB_ID
- IAM_GITHUB_SECRET

分别为之前获取到的`Client ID` 与 `Client secrets`

## 安全强化

为了token的安全不被恶意应用获取，建议增加前端域名校验。

在环境变量中配置`IAM_FE_URL`即可，值为前端域名。如: `IAM_FE_URL=http://localhost:11011`

> 用于 `window.opener.postMessage(<data>, "IAM_FE_URL")`
