---
sidebar_position: 4
title: Websocket Bot
---

In addition to traditional HTTP callback bots, we also support bots based on the websocket long connection protocol.

The long-connection robot can listen to all messages like a normal user, and does not need to be invoke by `@`.

Of course, the disadvantage is that it is not convenient for some platforms that only support http requests, such as `serverless` and other platforms that do not support `websocket`. And currently only the `nodejs` version is implemented.

Here is an example in here:

```ts
import { TailchatWsClient } from 'tailchat-client-sdk';

const HOST = process.env.HOST;
const APPID = process.env.APPID;
const APPSECRET = process.env.APPSECRET;

if (!HOST || !APPID || !APPSECRET) {
  console.log('require env: HOST, APPID, APPSECRET');
  process. exit(1);
}

const client = new TailchatWsClient(HOST, APPID, APPSECRET);

client.connect().then(async() => {
  console.log('Login Success!');

  client.onMessage((message) => {
    console.log('Receive message', message);
  });
});
```

Among them, `HOST`, `APPID`, `APPSECRET` represent the server address, the id and secret key of the open platform respectively.

**Please do not upload your secret key on the public platform, the secret key is equivalent to the password**

This operation creates an event listener after connecting to the server, and when any message is received, the content of the message will be printed out.

Similarly, if we need to subscribe the update event of the message, we can use the subscribe message update operation

```ts
client.onMessageUpdate((message) => {
  console.log('Receive message', message);
});
```
