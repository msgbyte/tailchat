---
sidebar_position: 1
title: Summary
---

:::info
Video Conference solutions require SSL support, so only websites that support https will work properly
:::

`Tailchat` provides those solutions for video and voice calls, you can choose according to the actual situation:
- ~~`tailchat-meeting` self-deploying video conferencing (WIP)~~
- `agora` Acoustic Network integration, for details, see: [Acoustic Network Plug-in Deployment Guide](./agora.md)
- `livekit` Allow self-host solution: [Livekit Plugin Deployment Guide](./livekit.md)


<details>
  <summary>Collapsed content is outdated</summary>
  
  ## Tailchat Meeting

  The video conferencing module is an important part of the suite of `Tailchat` series. Capabilities are provided as follows:
  - Voice communication
  - Video session
  - screen sharing
  - virtual background
  - file transfer
  - chat record

  At the same time, `tailchat-meeting` can also exist as an independent product, and you can quickly initiate/join meetings without logging in

  ### Project repository

  - Open source address: [https://github.com/msgbyte/tailchat-meeting](https://github.com/msgbyte/tailchat-meeting)
  - Open source agreement: Apache 2.0

  :::info Open source statement
  This project is based on secondary development of [edumeet](https://github.com/edumeet/edumeet) and [mediasoup](https://github.com/versatica/mediasoup).

  On this basis, function addition, SDK implementation and code optimization were carried out. If you want to find a looser implementation of the open source protocol (MIT + ISC protocol), you can take a look at these two projects
  :::


  ### Project Architecture

  ![](/img/architecture/meeting.excalidraw.svg)

</details>
