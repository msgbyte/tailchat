---
sidebar_position: 4
title: Custom Builtin Plugin
---

In Tailchat's plugin center, you can see that the system has builtin some plugins for users to install by default, and these plugins cannot be uninstalled. For self-deployed enterprise users, it is particularly important to have all members install the enterprise or other preset plugins by default.

Next we will learn how to customize the builtin plugin list

*Because plugins are loaded very early, Tailchat is designed to compile the list of builtin plugins into the source code to ensure that the page loads as quickly as possible. Therefore you need to compile the image manually*

First you need to clone the source code:

```bash
git clone https://github.com/msgbyte/tailchat.git
```

Modify the builtin plugin list:

```bash
cd tailchat
vim client/web/src/plugin/builtin.ts
```

Add your configuration file (generally found in the `manifest.json` file in the plugin directory) to the exported variable `builtinPlugins` array according to the existing plugin list format.

:::info
The list of existing plugins can be seen here [Plugin List](/docs/plugin-list/fe)
:::

When the editing is completed, save it and make sure the current directory is in the root directory of tailchat. At this point you should be able to see the `Dockerfile` file directly in your directory.

Execute the command to compile your own image

```bash
docker build . -t tailchat
```

Where `.` represents the current directory, `-t tailchat` represents the compiled tag is `tailchat`, which can be read directly by the `docker-compose.yml` file

After the compilation is completed, just start it according to the normal operation: `docker compose up -d`

:::info
If you compile the image yourself, it is recommended to configure it above **2C4G**
:::
