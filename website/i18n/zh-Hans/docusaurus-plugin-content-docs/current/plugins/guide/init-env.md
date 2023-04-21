---
sidebar_position: 1
title: 初始化插件开发环境
---

在开发一个插件之前，我们需要创建一个插件开发环境，这个环境可以是直接复用 Tailchat 官方源码的环境(https://github.com/msgbyte/tailchat/tree/master/client/web/plugins)，也可以是一个独立的项目

这里主要教大家怎么创建一个独立的插件开发环境

## 前端插件开发环境

创建一个插件非常简单, 在此之前如果我们没有初始化插件环境的话需要先初始化一下开发环境

我们先随便找个地方建一个项目文件夹:

```bash
mkdir tailchat-plugin-test && cd tailchat-plugin-test
```

在根目录下执行:

```bash
npm init -y
npm install mini-star
```

在根目录创建 `mini-star` 的配置文件 `.ministarrc.js`，内容如下:

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

在 `package.json` 中写入编译脚本

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

## 后端插件开发环境

TODO
