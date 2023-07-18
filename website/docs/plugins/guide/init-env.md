---
sidebar_position: 1
title: Init Plugin Develop Env
---

Before developing a plugin, we need to create a plugin development environment. This environment can directly reuse the plugin environment of Tailchat official source code ([https://github.com/msgbyte/tailchat/tree/master/client/web/plugins](https://github.com/msgbyte/tailchat/tree/master/client/web/plugins)), It can also be an independent project

Here we mainly teach you how to create an independent plugin development environment

## frontend plugin development environment

It is very simple to create a plugin. Before that, if we did not initialize the plugin environment, we need to initialize the development environment first

Let's just find a place to build a project folder:

```bash
mkdir tailchat-plugin-test && cd tailchat-plugin-test
```

Execute in the root directory:

```bash
npm init -y
npm install mini-star
```

Create the configuration file of the `mini-star` in the root directory which named `.ministarrc.js`, the content is as follows:

```js
// .ministarrc.js
const path = require('path');

module.exports = {
  externalDeps: [
    'react',
    'react-router',
    'axios',
    'styled-components',
    'zustand',
    'zustand/middleware/immer',
  ],
};
```

Write a compilation script in `package.json`

```json
{
  //...
  "scripts": {
    // ...
    "plugins:all": "ministar buildPlugin all",
    "plugins:watch": "ministar watchPlugin all",
    // ...
  }
  //...
}
```

## backend plugin development environment

TODO
