---
sidebar_position: 20
title: Livekit Plugin Deployment Guide
---

`Livekit` is an open source video conferencing solution based on the `Apache-2.0` open source protocol, allowing self-host, supporting video conferencing, live streaming, recording and other scenarios

You can use his cloud service or self-host. Below I will introduce how to integrate `Livekit` into `Tailchat`:

## Cloud Services

First enter the Livekit cloud platform: [https://cloud.livekit.io/](https://cloud.livekit.io/), in the first time you enter, you need to create a project:

It will ask some questions, just answer them according to the situation.

![](/img/advanced-usage/livekit/1.png)

After completion, we will enter the console main dashboard:

![](/img/advanced-usage/livekit/2.png)

### Get the required environment variables

For the plugin to work, we need the following environment variables:

- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`

Among them, `LIVEKIT_URL` can be obtained directly from the console, in the form of `wss://********.livekit.cloud`

In the `Settings` menu on the left, we need to create a pair of secret keys by ourselves

![](/img/advanced-usage/livekit/3.png)

![](/img/advanced-usage/livekit/4.png)

![](/img/advanced-usage/livekit/5.png)

Here we can get `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET`.

Record and fill in the environment variables and start `Tailchat`.

### Start the webhook

![](/img/advanced-usage/livekit/6.png)

If you need the above-mentioned channel online prompts to be updated immediately, you need to start a `webhook-receiver` separately to accept pushes from `livekit` and forward the received events to `Tailchat`, so that `Tailchat` can update all groups Display of group membership.

The official `docker-compose` configuration has been prepared for you with one click, just like `admin`:

```bash
wget https://raw.githubusercontent.com/msgbyte/tailchat/master/docker/livekit.yml
docker compose -f docker-compose.yml -f livekit.yml up -d
```

At this point you can see a `tailchat-livekit-webhook-receiver` service in the docker running container.

Then we switch to the `livekit` console and add our address in the `webhook`.

![](/img/advanced-usage/livekit/7.png)

Generally `https://<your tailchat url>/livekit/webhook`, remember to choose the same key pair as the service

![](/img/advanced-usage/livekit/8.png)

> PS: There may be some delays in cloud applications.

## Self-host

See the official documentation for self-host: [https://docs.livekit.io/oss/deployment/](https://docs.livekit.io/oss/deployment/)

In addition to the different deployment methods and configuration first, others are the same as using cloud services
