---
sidebar_position: 5
title: OAuth 第三方登录
---

`Tailchat` 开放平台支持 `OAuth` 登录协议, 你可以很方便的将 `Tailchat` 账号体系接入到你的系统中。正如我们常见的 `Github 登录`、`Google 登录`、`Apple 登录` 一样

而现在，你可以通过 `Tailchat` 对你的多个平台做统一的账号管理体系。

## 在 Tailchat 中新建开放平台应用

你需要创建一个开放平台应用并开启 **OAuth** 服务。

在**回调地址**处填入允许被重定向的地址。

![](/img/advanced-usage/openapp/3.png)

## 创建独立 应用发起并接受回调

首先我们在正式开始之前要大概了解一下 **OAuth** 的基本流程

![](/img/advanced-usage/openapp/4.png)

简单的来说，就是分为三步:

- 第一步：访问授权，要传client_id:客户端id，redirect_uri:重定向uri，response_type为code，scope是授权范围，默认填`openid profile`即可，state是其它自定义参数
- 第二步：授权通过，会重定向到redirect_uri，code码会作为它的参数
- 第三步：拿到code后可以换取 access token, 之后就可以通过token直接访问资源

你可以参考 [https://github.com/msgbyte/tailchat/blob/master/server/test/demo/openapi-client-simple/index.ts](https://github.com/msgbyte/tailchat/blob/master/server/test/demo/openapi-client-simple/index.ts) 来实现你自己的 OAuth 应用

### 主要流程

这里简单简述一下过程:

首先构建一个请求地址，形如:
```
<API>/open/auth?client_id=<clientId>&redirect_uri=<redirect_uri>&scope=openid profile&response_type=code&state=123456789
```

其中:
- `API` 是你的tailchat后端地址，如果是使用默认部署方案的话就是你的访问地址。
- `clientId` 是你第一步申请到的开放平台的地址。
- `redirect_uri` 为你的回调地址，你需要确保其已经被添加到允许回调地址的白名单中
- `scope` 是申请授权范围，目前固定填入 `openid profile` 即可
- `response_type` 是响应类型，固定填入 `code` 即可
- `state` 其他的自定义参数，会随着重定向和`code`参数一起调用.

用户访问该地址后，会跳转到 Tailchat 平台进行登录授权，如果授权通过的话会重定向到 `redirect_uri` 规定的地址. 此时接收地址可以在query string 中获取到 `code` 和 `state`.

下一步我们需要通过发送 POST 请求使用 `code` 换取 `token`. 后续我们需要通过 `token` 来获取用户信息

```
POST <API>/open/token
{
  "client_id": clientId,
  "client_secret": clientSecret,
  "redirect_uri": redirect_uri,
  "code": code,
  "grant_type": 'authorization_code',
}
```

返回值:
```
{
  access_token, 
  expires_in, 
  id_token, 
  scope, 
  token_type
}
```

此时我们拿到了 `access_token`, 我们可以用来请求用户信息:

```
POST <API>/open/me
{
  "access_token": access_token,
}
```

返回值:
```
{
  sub,
  nickname, 
  discriminator, 
  avatar,
}
```

其中`sub`可以理解为用户的id，是用户的唯一标识
