---
title: 是时候正式步入noIM的时代了
authors: moonrailgun
image: /img/logo.svg
keywords:
  - tailchat
tags: [blog]
---

从远至今，已经经历了很多轮沟通方式的变更，从邮件到IRC，再到如今的如 Slack 或者 Discord 这样的包含了音视频通讯的沟通工具，以及如 Telegram, Signal 这样侧重消息隐私安全的聊天工具。如今，我认为现在是时候步入新一代的，noIM(Not only IM) 的阶段。

随着人们的对于信息沟通的方式的需求不断的演进，我们需要在越来越多的平台上进行协作。我们可以在Slack上进行信息的交流，在Figma上沟通设计稿，在Notion上交流文档，在Zoom上进行视频会议等等。随着 Web能力的越发强大，大多数的在线工具都可以在网页上操作。

而这，给 noIM 的概念带来了可能。

noIM，意味着一个即时通讯应用不仅仅做消息的发送与接受 —— 当然消息工具会一直是即时通讯应用迭代的核心 —— 更意味着应当承担一种多人协作的流转工具与职责。因为IM天然的，就代表着互联网时代最基本的沟通与协作方式。我们可以基于IM无缝的连接各种各样的工具。想象一下，我们可以在同一个工具中完成之前需要切换多个工具才能做到的事情，而且这些工具可以通过中心的IM来进行一定程度上的交互。


![](/img/intro/connect-apps.excalidraw.svg)

如Slack, Discord这样优秀的聊天系统也提供了开放平台，让第三方应用能够与聊天应用产生一定的交互，但是我认为这还远远不够，目前的现有的集成方式只不过是在发送一个个链接罢了，在新的时代我们需要更加原生的集成方式。很多东西本就该产生共享与联系——比如账户系统、权限系统、群组关系等。

一个基本的noIM系统应当有一套开放式的设计来让其能够与其他工具以一种原生的方式结合在一起，或者说自己来实现所有的可能的协作方式 —— 如 G Suite，然而这种方式可以做到应用之间流转十分顺畅，但是我认为更好的方式是连接第三方应用用户有选择自己喜好工具的权利，那么设计一套足够开放的设计则是一种必然。

因此，我设计了[Tailchat](https://tailchat.msgbyte.com/) 这样的一种产品，除了拥有和现有的流行项目都有开放平台以外，Tailchat还提供了一套插件机制来帮助实现更加深入的集成。通过 Tailchat 的插件机制, 任何产品都可以直接获取到 Tailchat 的现有的一切上下文，比如用户体系、权限体系等。更加重要的是，Tailchat是开源且开放的，这意味着Tailchat 拥有更好的隐私性，能够很好的开发插件，易于制作独属于用户的工具。在这一点和 VSCode 所要打造的生态是一样的，但是与VSCode不同的是，Tailchat 作为IM天然能够带来更多的交互，这是聊天软件天然的优势。也是我相信noIM能够在未来大放异彩的原因。

Github: [https://github.com/msgbyte/tailchat](https://github.com/msgbyte/tailchat)

官方文档: [https://tailchat.msgbyte.com/](https://tailchat.msgbyte.com/)

在线尝试: [https://nightly.paw.msgbyte.com/](https://nightly.paw.msgbyte.com/)
