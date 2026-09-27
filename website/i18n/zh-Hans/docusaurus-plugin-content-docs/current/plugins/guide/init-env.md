---
sidebar_position: 1
title: 初始化插件开发环境
---

在开发一个插件之前，我们需要创建一个插件开发环境，这个环境可以是直接复用 Tailchat 官方源码的插件环境([https://github.com/msgbyte/tailchat/tree/master/client/web/plugins](https://github.com/msgbyte/tailchat/tree/master/client/web/plugins))，也可以是一个独立的项目

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

### 服务 Action 的 HTTP 认证

通过 `TcService.registerAction` 注册的 action 默认要求 HTTP 请求通过认证，鉴权白名单内的路由除外。如果某个 action 允许匿名读取，同时需要识别已登录的调用者，可以声明 `optionalAuth: true`：

```ts
this.registerAction('getPublicInfo', this.getPublicInfo, {
  optionalAuth: true,
  params: { id: 'string' },
});
```

启用后，不带 `x-token` 的请求按匿名处理；有效 token 会填充 `ctx.meta.userId`；无效 token 返回 HTTP 401。此配置跟随 action 生效，包括它的 HTTP 路由别名，并且优先于鉴权白名单，无需再注册白名单。服务仍须根据认证身份过滤私有字段。Socket 认证和 action 可见性保持不变。
