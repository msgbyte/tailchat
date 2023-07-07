---
sidebar_position: 1
title: About Open App
---

Open platform is a common and traditional way of interacting between applications. For some simple requirements, we can implement data transfer between applications through an open platform.

In Tailchat. At present, it mainly provides two forms of open platform application capabilities: `OAuth` and `Bot`

## Features

### OAuth

`OAuth` enables external applications to log in through `Tailchat` accounts, just like `Google`, `Github` login methods, which can facilitate users to create a unified user platform based on `Tailchat`

:::info
The difference from the `com.msgbyte.iam` plugin: `iam` plugin provides a way to log in to `Tailchat` with an external account, such as using a `Github` account to log in to `Tailchat`, while the OAuth capability of the open platform is based on `Tailchat` account to log in to other platforms.
:::

### Bot

`Bot` endows chatbots with interactive application capabilities, which means that Tailchat can not only passively receive external messages, but also actively forward internal chat requests to external applications for processing.

[Learn more](./bot)

## Prerequisites

Before using the relevant capabilities of the open platform, please ensure that the corresponding plug-in is installed, and ensure that the administrator has deployed the relevant capabilities of the open platform.

As a user, you need to install the `com.msgbyte.integration` plugin to add the application to your group

As a developer of open platform applications, you need to additionally install `com.msgbyte.openapi` to display the interfaces required by open platform applications
