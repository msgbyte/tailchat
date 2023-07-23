---
sidebar_position: 4
title: Websocket 机器人
---

除了传统的HTTP回调机器人以外，我们还支持基于websocket长连接协议的机器人。

长连接机器人可以如正常用户一样监听所有的消息，并无需通过 `@` 来唤起。

当然，缺点在于在一些只支持http请求的平台如`serverless`等不支持`websocket`的平台不够便利。且目前只有`nodejs`版本的实现。

以下是一个操作示例:

```ts
import { TailchatWsClient } from 'tailchat-client-sdk';

const HOST = process.env.HOST;
const APPID = process.env.APPID;
const APPSECRET = process.env.APPSECRET;

if (!HOST || !APPID || !APPSECRET) {
  console.log('require env: HOST, APPID, APPSECRET');
  process.exit(1);
}

const client = new TailchatWsClient(HOST, APPID, APPSECRET);

client.connect().then(async () => {
  console.log('Login Success!');

  client.onMessage((message) => {
    console.log('Receive message', message);
  });
});
```

其中 `HOST`, `APPID`, `APPSECRET` 分别表示服务器地址，开放平台的id与秘钥。

**注意请不要在公共平台上泄露你的秘钥，秘钥等价于密码**

该操作在连接到服务器后创建了一个事件监听，当接收到任何消息的时候会把message的内容打印出来。

类似的，如果我们需要监听消息的更新事件的话，则可以使用监听消息更新操作

```ts
client.onMessageUpdate((message) => {
  console.log('Receive message', message);
});
```
