---
title: "Tailchat x Laf: 十分钟开发一个对话机器人" 
authors: moonrailgun
image: /img/logo.svg
slug: tailchat-laf-robot
keywords:
  - tailchat
  - laf
tags: [Guide]
---

## 简介

[Tailchat](https://github.com/msgbyte/tailchat) 是一个开源的 **noIM(not only IM)** 应用，除了一般的即时通讯功能以外还包含完整的开放平台和插件生态。本次我们就要使用 `Tailchat` 的开放平台.

[Laf](https://github.com/labring/laf) 是一个开源的 **serverless** 云开发，提供云函数、云数据库、云存储等开箱即用的应用资源。本次我们要用的是他提供的云函数。

因为这两个平台都非常方便，所以我们只需要10分钟就能开发一个完整的对话机器人。

## TLDR

### 创建开放平台应用

废话不多说，我们直接开干。

首先我们需要在Tailchat的开放平台中创建一个开放平台应用。

在创建前我们需要先安装相关的插件，因为Tailchat的能力都是封装在不同的插件中的，如果没有安装插件的话部分能力是不可见的。

我们需要安装开放平台插件(com.msgbyte.openapi)与第三方集成(com.msgbyte.integration)插件

![](/img/blog/robot-with-laf/1.png)

然后我们就能在左下角的设置页面看到我们的开放平台插件

快速创建一个应用:

![](/img/blog/robot-with-laf/2.png)

![](/img/blog/robot-with-laf/3.png)

创建完毕后点击 **Enter** 进入应用详情页。

![](/img/blog/robot-with-laf/4.png)

此时我们可以拿到两个东西，一个是 **appid** 用于标识app的唯一id，一个是 **appsecret** 用于进行服务进行交互。可以简单理解为开放平台应用的账户名和密码。

点击小眼睛显示不脱敏的完整秘钥。这两个字段我们接下来要用到。

### 创建laf云函数

接下来我们来创建云函数用于机器人的后台服务。

首先在 [laf](https://laf.dev/) 中登录/注册账号并创建一个应用。

`laf` 为每个账号提供一个免费的实验应用可以用于快速尝试，我们直接创建免费的即可

![](/img/blog/robot-with-laf/5.png)

等待应用启动完毕后我们就可以直接在网页上进行代码的编写。

点击左上角加号创建一个云函数

![](/img/blog/robot-with-laf/6.png)

在左下角依赖中安装 **Tailchat** 官方提供的 `tailchat-client-sdk` 包用于快速开发

![](/img/blog/robot-with-laf/7.png)

点击保存后应用会自动重启，此时你的应用就相当于安装了这个包了。此时我们可以直接引入，如果包里面有ts的类型的话网页编辑器还会有类型提示。

点击函数快速写入如下内容:

```ts
import { TailchatClient, stripMentionTag } from 'tailchat-client-sdk';

const host = '<your tailchat instance backend host>';
const appId = '<appId>';
const appSecret = '<appSecret>';

const client = new TailchatClient(host, appId, appSecret)

export async function main(ctx: FunctionContext) {
  console.log('receive', ctx.body);

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

  return { data: 'hi, laf' }
}
```

在代码顶部的 `host` / `appId` / `appSecret` 分别填入对应的内容，其中 `host` 就是你自己部署的 `Tailchat` 后端的地址。如果你用的是官方的`nightly`环境可以直接填入 `https://tailchat-nightly.moonrailgun.com`

代码逻辑非常简单，就是接收来自`Tailchat`推送的消息，并将接收到的内容原样回复。

完成代码的编辑后点击右上角的发布按钮将代码发布到线上，同时也可以看到`laf`提供了一个可供外网访问的url, 这个url需要记录一下我们之后会用到。

![](/img/blog/robot-with-laf/8.png)

此时，我们的机器人服务就已经完成了。

### 机器人配置

这时我们回到 `Tailchat` 中。我们还有一些步骤尚未完成。

重新打开应用详情，切换到机器人标签。开启机器人功能并将我们在 `laf` 中拿到的 `url` 填入回调地址中

![](/img/blog/robot-with-laf/9.png)

然后把我们的机器人添加到群组中，在群组左上角打开详情

![](/img/blog/robot-with-laf/10.png)

在左边找到集成功能，输入appid找到应用，点击添加机器人到群组按钮。

![](/img/blog/robot-with-laf/11.png)

此时我们在频道中@机器人并输入内容后，就可以看到机器人进行了相应的回复

![](/img/blog/robot-with-laf/12.png)

自此，一个简单的对话机器人就完成了。

如果想要别的功能，直接修改机器人的源码即可。通过机器人我们可以让 Tailchat 与各种各样的服务进行连接。

## 相关连接

- [Tailchat](https://tailchat.msgbyte.com/)
- [Laf](https://laf.dev/)
