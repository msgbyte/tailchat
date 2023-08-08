---
sidebar_position: 11
title: 前端分离部署(CDN部署前端)(可选)
---

有可能会出现前后端分开部署的情况，比如想要把前端代码单独放在对象存储中管理，增加CDN支持。则需要单独编译前端代码。

后端代码依旧建议使用 `docker` 来部署

为了单独编译前端代码，你需要下载源码来手动编译

```bash
git clone https://github.com/msgbyte/tailchat.git
cd tailchat

# 你可以通过 git checkout v1.8.8 来切换不同的发行版本

pnpm install # 你需要使用 `pnpm` 来安装依赖，使用其他的包管理工具可能会出现问题
```

耐心等待依赖安装完毕

进入前端代码中，进行编译

```bash
cd client/web
SERVICE_URL=<your-api-url> pnpm build
```

确保 `SERVICE_URL` 的值是后端的地址，形如: `http://127.0.0.1:11000`

编译完毕后你可以在 `tailchat/client/web/dist` 目录下获得所有的前端文件。

> 另外，如果出现刷新页面后报404. 需要配置类似 [静态网站托管时，把根目录下的 index.html 文件设置为默认首页] 这样的配置
