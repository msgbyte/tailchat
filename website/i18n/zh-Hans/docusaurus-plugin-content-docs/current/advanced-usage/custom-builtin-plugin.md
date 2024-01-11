---
sidebar_position: 4
title: 自定义内置插件
---

在 Tailchat 的插件中心中可以看到系统已经内置了一部分插件默认给用户安装，且这部分插件是不可被卸载的。而对于自部署的企业用户来说，让所有的成员都默认安装上企业或者预设好的其他插件尤为重要。

接下来我们将学习如何自定义内置插件列表

*因为插件的加载时机很早，因此在 Tailchat 的设计中会将内置插件列表编译到源码中以确保尽可能快的加载页面。因此你需要手动编译镜像*

首先需要下载源码:

```bash
git clone https://github.com/msgbyte/tailchat.git
```

修改内置插件列表:

```bash
cd tailchat
vim client/web/src/plugin/builtin.ts
```

将你的配置文件(一般可以在插件目录的`manifest.json`文件中找到)按照已有的插件列表格式添加到导出的变量`builtinPlugins` 数组中。

:::info
已有的插件列表可以在这里看到 [插件列表](/docs/plugin-list/fe)
:::

当编辑完成后保存，确保当前目录在tailchat的根目录。此时你的目录下应该可以直接看到 `Dockerfile` 文件

执行命令编译自己的镜像

```bash
docker build -t tailchat .
```

其中 `.` 表示当前目录，`-t tailchat` 表示编译的标签是 `tailchat`, 这可以直接被 `docker-compose.yml` 文件读取

编译完成后按照正常操作启动即可 `docker compose up -d`

:::info
自己编译镜像建议配置在 **2C4G** 以上
:::
