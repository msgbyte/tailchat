---
sidebar_position: 4
title: 机器人
---

开放平台的机器人是可交互式的机器人解决方案

他的主要流程是:

- 创建openapp
- 获取appid和appsecret
- 进入bot页面，开启bot能力
- 回调地址填入可以访问到的公网http服务地址
- 回到群组页面，在群组详情集成功能中输入appid，找到刚刚创建的应用，加入到群组中
- 在群组中@机器人并输入文本，此时tailchat会向回调地址所示的地址发送一个带消息内容的http请求
- 在机器人服务中接受到tailchat发送的请求，并通过机器人给对应群组的对应面板发送响应

当然，在开始一切工作前请[先在 Tailchat 中创建](./create)

下面我们来实际操作一下机器人的开发流程:

## 使用SDK进行开发(Node.js)

Tailchat 提供了sdk作为快速开发的工具，`tailchat-client-sdk`, 你可以通过以下命令安装

```bash
npm install tailchat-client-sdk
```

以`koa`为例，我们先创建一个简单的`koa`服务如下:

创建node项目:

```bash
mkdir tailchat-bot && cd tailchat-bot
npm init -y
npm install koa koa-router tailchat-client-sdk
```

创建`server.js`文件:

```js
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

// 定义路由
router.get('/', async (ctx) => {
  ctx.body = 'Hello, World!';
});

router.post('/bot/callback', async (ctx) => {
  ctx.body = 'Bot Callback Page';
});

// 注册路由中间件
app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

在此时我们建立了两个基本的路由，`/`与`/bot/callback`, 并监听了`3000`端口, 注意`/bot/callback`监听的是**POST**请求

此时我们执行 `node server.js` 可以看到我们的应用会被启动。

现在我们要增加一些逻辑，比如我们想要实现一个复读机器人, 那么修改 `/bot/callback` 路由的实现如下:

```js
import { TailchatHTTPClient, stripMentionTag } from 'tailchat-client-sdk';

const host = '<your tailchat instance backend host>';
const appId = '<appId>';
const appSecret = '<appSecret>';

const client = new TailchatHTTPClient(host, appId, appSecret)

// ...

router.post('/bot/callback', async (ctx) => {
  const type = ctx.body.type;
  
  if (type === 'message') {
    const payload = ctx.body.payload;
    try {
      const message = await client.replyMessage({
        messageId: payload.messageId,
        author: payload.messageAuthor,
        content: payload.messageSnippet
      }, {
        groupId: payload.groupId,
        converseId: payload.converseId,
        content: `Your message: ${stripMentionTag(payload.messageSnippet)}`,
      })

      console.log('send message success:', message)
    } catch (err) {
      console.log('send message failed:', err)
    }
  }
  
  ctx.body = 'Bot Callback Page';
});
```

请将 `host` `appId` 和 `appSecret` 分别填入在创建时获取到的 `appId` 和 `appSecret`，`host` 填入 `Tailchat` 服务端的地址, 官方 `nightly` 的地址是 `https://tailchat-nightly.moonrailgun.com` 

至于回复的内容并不重要，只需要确保不要主动返回错误信息即可，Tailchat并不关心返回内容

**请注意如果你要把你的代码分享出去的话请保管好你的`appSecret`, 这等价于你的账号的密码**

逻辑非常简单，从请求中拿到消息的内容, 作者, id, 以及所在的群组id, 会话id。以回复的形式将内容发送出去

将该应用部署到线上即可看到效果。

:::info
在测试前请确保你已经开启了机器人能力并填入了正确的回调地址
:::

## 使用其他语言进行开发

既然是网络应用，那么当然不仅仅局限于`nodejs`, 下面是所需要用到的一些网络请求的格式，主要是以开放平台机器人身份向Tailchat服务端发送请求。

官方 `nightly` 的api地址是 `https://tailchat-nightly.moonrailgun.com` , 自部署的请替换成自己的后端地址

### 登录

在所有的请求之前都需要先登录获取jwt token以表明身份，需要发送以下内容:

```
POST /api/openapi/bot/login

Header
Content-Type: application/json

Body
{
  appId: <your app id>,
  token: <md5(appId+appSecret)>,
}

Response
{
  data: {
    jwt: ".........."
  }
}
```

其中请求体的`token`是一个固定值,需要拼接 `appId` 和 `appSecret` 后以`md5`算法进行加密。最后拿到 `jwt`, `jwt` 要在之后的所有请求中在请求头带上

```
Header
X-Token: <your-jwt>
```

### 调用

机器人可以和普通的用户一样调用接口，如:

```
POST /api/xxx

Header
Content-Type: application/json
X-Token: <your-jwt>

Body
{
  ...
}
```

你可以将机器人视为一个普通用户来看待，普通用户所能做的事情机器人都能做，普通用户需要受到的权限限制机器人也会受到。

区别在于普通用户是用可视化进行交互的，而机器人是通过api进行交互的。

#### 发送信息

```
POST /api/chat/message/sendMessage

Header
Content-Type: application/json
X-Token: <your-jwt>

Body
{
  "converseId": "",
  "groupId": "",
  "content": "",
  "plain": "",
  "meta": {},
}
```

#### 回复信息

```
POST /api/chat/message/sendMessage

Header
Content-Type: application/json
X-Token: <your-jwt>

Body
{
  "converseId": "<converId/panelId>",
  "groupId": "<groupId, optional in DM>",
  "content": "<your message content>",
  "plain": "<your plained message, optional>",
  "meta": {
    mentions: ["<replyMessageAuthorId>"],
    reply: {
      _id: "<replyMessageId>",
      author: "<replyMessageAuthor>",
      content: "<replyMessageContent>",
    },
  },
}
```

## 其他文档

- [Tailchat x Laf: 十分钟开发一个对话机器人](/blog/tailchat-laf-robot)
