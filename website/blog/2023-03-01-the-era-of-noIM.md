---
title: It's time to officially step into the era of noIM
authors: moonrailgun
image: /img/logo.svg
keywords:
  - tailchat
  - noIM
tags: [blog]
---

From far to now, there have been many rounds of changes in communication methods, from email to IRC, to today's communication tools such as Slack or Discord that include audio and video communication, and chats such as Telegram and Signal that focus on message privacy and security. Now, I think it's time to step into a new stage, the noIM (Not Only IM) stage.

As people's needs for information communication methods continue to evolve, we need to collaborate on more and more platforms. We can exchange information on Slack, communicate design drafts on Figma, exchange documents on Notion, conduct video conferences on Zoom, and so on. With the growing power of the Web, most of the online tools can be operated on the web.

This brings possibility to the concept of noIM.

noIM means that an instant messaging application is not only for sending and receiving messages – of course, messaging tools will always be the core of instant messaging application iterations – but also means that it should undertake a multi-person collaborative circulation tool and responsibility. Because IM is the natural way, it represents the most basic way of communication and collaboration on the Internet. We can seamlessly connect various tools based on IM. Imagine that, we can do things in the same tool that we needed to switch between multiple tools before, and these tools can interact to a certain extent through the central IM.

![](/img/intro/connect-apps.excalidraw.svg)

Excellent chat systems such as Slack and Discord also provide an open platform, allowing third-party applications to interact with chat applications, but I don't think that's enough. Current integration methods simply send links, in the new era, we need a more native integration method. Many things should be shared and connected–such as account system, permission system, group relationship, etc.

A basic noIM system should have an open design to allow it to be combined with other tools in a native way, or to implement all possible collaboration methods by itself - such as G Suite, in this way, the flow between applications can be very smooth, but I think a better way is to connect third-party application users to have the right to choose their favorite tools, so it is inevitable to design a sufficiently open design.

So I designed a product like Tailchat. In addition to having an open platform with existing popular projects, Tailchat also provides a set of plugin mechanisms to help achieve deeper integration. Through Tailchat's plugin mechanism, any product can directly obtain all existing contexts of Tailchat, such as user system, permission system, etc. More importantly, Tailchat is an open source and open platform, which means Tailchat has better privacy, can develop plugins very well, and it's easy to make tools unique to users. This is the same as the ecology that VSCode wants to create, but unlike VSCode, Tailchat, as an IM, can naturally bring more interactions, which is a natural advantage of chat software. This is also why I believe that noIM can shine in the future.

Github: [https://github.com/msgbyte/tailchat](https://github.com/msgbyte/tailchat)

Office Website: [https://tailchat.msgbyte.com/](https://tailchat.msgbyte.com/)

Try in online: [https://nightly.paw.msgbyte.com/](https://nightly.paw.msgbyte.com/)
