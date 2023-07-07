---
sidebar_position: 3
title: Bot
---

Open platform bot are interactive robot solutions

Main process below:

- Create openapp
- Get appid and appsecret
- Enter the bot page and enable the bot ability
- Fill in the callback address with the public http service address that can be accessed
- Go back to the group page, enter the appid in the group details integration function, find the app you just created, and add it to the group
- In the group @bot and enter text, tailchat will send an http request with message content to the address shown in the callback address
- Receive the request sent by tailchat in the bot service, and send a response to the corresponding panel of the corresponding group through the bot

Of course, [create in Tailchat before you start anything](./create)

Let's take a look at the actual development process of the bot:

## Development with SDK (Node.js)

Tailchat provides sdk as a rapid development tool, `tailchat-client-sdk`, you can install it with the following command

```bash
npm install tailchat-client-sdk
```

Taking `koa` as an example, we first create a simple `koa` service as follows:

Create a node project:

```bash
mkdir tailchat-bot && cd tailchat-bot
npm init -y
npm install koa koa-router tailchat-client-sdk
```

Create `server.js` file:

```js
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

// Define route
router.get('/', async (ctx) => {
  ctx.body = 'Hello, World!';
});

router.post('/bot/callback', async (ctx) => {
  ctx.body = 'Bot Callback Page';
});

// Register middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

At this point we have established two basic routes, `/` and `/bot/callback`, and listened to `3000` port, note that `/bot/callback` listens to **POST** requests

At this point we execute `node server.js` to see that our application will be started.

Now we need to add some logic, for example, if we want to implement a repeating bot, then modify the implementation of `/bot/callback` route as follows:

```js
import { TailchatClient, stripMentionTag } from 'tailchat-client-sdk';

const host = '<your tailchat instance backend host>';
const appId = '<appId>';
const appSecret = '<appSecret>';

const client = new TailchatClient(host, appId, appSecret)

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

Please fill in `host`, `appId` and `appSecret` into the `appId` and `appSecret` obtained during creation, and `host` into the address of the `Tailchat` server, the official address of `nightly` is `https //tailchat-nightly.moonrailgun.com`

The content of the reply is not important, just make sure not to actively return an error message, Tailchat does not care about the returned content

**Please note that if you want to share your code, please keep your `appSecret`, which is equivalent to your account password**

The logic is very simple. Get the message content, author, id, group id, and converse id from the request. Send content as a reply

Deploy the application online to see the effect.

:::info
Before testing, please make sure you have enabled the bot ability and filled in the correct callback address
:::

## Develop in other languages

Since it is a network application, it is of course not limited to `nodejs`. The following are the formats of some network requests that need to be used, mainly sending requests to the Tailchat server as an open platform bot.

The official `nightly` api address is `https://tailchat-nightly.moonrailgun.com`, please replace it with your own backend address for self-deployment

### Login

Before all requests, you need to log in to obtain the jwt token to indicate your identity, and you need to send the following content:

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

The `token` of the request body is a fixed value, which needs to be encrypted with the `md5` algorithm after splicing `appId` and `appSecret`. Finally get `jwt`, `jwt` must be on the request header in all subsequent requests

```
Header
X-Token: <your-jwt>
```

### Call

Robots can call the interface like ordinary users, such as:

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

You can treat the bot as an ordinary user. The bot can do everything that ordinary users can do, and the bot will also be subject to the permission restrictions that ordinary users need to be subject to.

The difference is that regular users interact with visualizations, while bots interact with APIs.

#### Send Message

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

#### Reply message

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

## Additional Documentation

- [Tailchat x Laf: Develop a chatbot in 10 minutes](/blog/tailchat-laf-bot)
