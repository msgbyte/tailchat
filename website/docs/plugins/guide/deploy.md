---
sidebar_position: 90
title: Deploy Plugin
---

:::info
The deployment strategy of the plugin will be optimized in the future. At present, tailchat is not convenient enough to customize the plugin during deployment, so it may be a little confusing. Therefore, this document only represents the status quo and will be continuously improved in the future
:::

First, let’s talk about the classification of Tailchat plugins. Tailchat plugins are divided into `pure frontend plugins`, `pure backend plugins`, `frontend plugins`

`Pure frontend plugin` is the easiest to understand, which means that the plugin only runs in the frontend code, relies on the existing context for communication, and does not need Tailchat backend support. (In particular, frontend plugins that communicate with custom backends, such as the `com.msgbyte.ai-assistant` plugin)

`Pure backend plugin is` a plugin that communicates with the Tailchat network, without a frontend interface, and calls actions of other services through rpc to achieve some purposes. For the backend plugin, it means that the plugin itself is connected to the Tailchat backend network, has the highest authority, and can access some actions whose visibility is `public` (by default, only actions at the `publish` level can be accessed externally, others level are only accessible to internal services), a frontend-free backend plugin such as `com.msgbyte.simplenotify` plugin

`Frontend plugin` means a plugin with both frontend and backend. It is the most complex but most capable plugin type. It interacts with the backend through the frontend plugin and interacts with other services through the backend plugin without modifying the core code. Can complete most of the development work under the premise of

You can check the corresponding plugin example in this document: [plugin list](/docs/plugin-list/fe)

## Deployment process

The process of deploying different plugins is different

### Pure frontend plugin

For pure frontend plugins, you can place the code in the `client/web/plugins` directory inside the project or use a separate static file service management. Make sure that the js documents of the project can be accessed normally.

If this is a plugin for personal use, you can install it through the manual installation of the plugin center, and enter the json configuration of `manifest.json`. Pay attention to ensure that the addresses in the configuration file can be accessed normally.

If you want all users to see the code, you need to add your own plugin configuration in `client/web/registry.json`.

If you want to be a built-in plugin installed by default, you need to modify the `client/web/src/plugin/builtin.ts` file to let the frontend code load the plugin at startup.

### Pure backend plugin

In order for the plugin to be loaded automatically, you can place the code in the `server/plugins` directory or deploy it independently, just make sure you can connect to the same network (share the same TRANSPORTER)

The plugin service deployed by default will uniformly load all backend plugins in this directory. Need to ensure that the name of the plugin service is `*.service.ts`/`*.service.js`

*If you only want to run in the development environment and ignore it in the production environment, please name the file `*.service.dev.ts`*

You can access the backend `/health` (such as: `http://localhost:11000/health`) route or use the `tailchat connect` tool to view the list of loaded microservices

### Frontend and backend plugins

The deployment of the frontend and backend plugins is similar to that of the backend, but the compilation command needs to be modified so that the frontend code of the frontend and backend plugins can be deployed to the `public/plugins` directory when building

The specific method is: modify `package.json`, add the name of the plugin you want to compile in the `build:server` command

> {BACKEND} in the configuration file refers to the backend address, because the backend address is not necessarily consistent with the frontend address due to the separation of the front and back ends

--------

Remember to rebuild the docker image after all operations are done
