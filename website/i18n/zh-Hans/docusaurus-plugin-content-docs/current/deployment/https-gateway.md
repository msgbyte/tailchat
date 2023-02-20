---
sidebar_position: 8
title: 搭建 https 网关(可选)
---

在 `Tailchat` 中，有一些服务是强依赖 `https` 的，比如音视频通话、嵌入外部的 `https` 媒体资源与网页等。

同时为了用户的安全性，我们非常建议将 `Tailchat` 对外以 `https` 服务的形式提供。

![](/img/architecture/https-gateway.excalidraw.svg)

如果你没有相关的经验，且在同一台机器上只部署了 `Tailchat` 服务(没有占用 **80**/**443** 端口)，那么我们推荐从 `Tailchat` 自带的 `swag` 配置开始。

:::info
你可以在 [Github](https://github.com/msgbyte/tailchat/tree/master/docker) 看到原始的配置内容
:::

通过以下命令直接拉取所需要的配置文件
```bash
wget https://raw.githubusercontent.com/msgbyte/tailchat/master/docker/swag.yml
wget https://raw.githubusercontent.com/msgbyte/tailchat/master/docker/swag.env.example -O swag.env
mkdir config
wget https://raw.githubusercontent.com/msgbyte/tailchat/master/docker/config/nginx.conf -O ./config/nginx.conf
```

完成后应该会在在当前目录看到以下三个文件:
- `swag.yml`
- `swag.env`
- `config/nginx.conf`

修改`swag.env`的内容，将 `URL` 的值改为域名, 如: `URL=tailchat.example.com`

:::info
`https`协议是依赖域名做证书校验的，因此需要提前分配一个域名指向目标服务器
:::

域名的地址需要在购买域名的管理后台创建一条A指向记录。

在分配好域名后我们就可以启动服务了。

```bash
docker compose -f ./swag.yml up -d
```

如果一切顺利的话，此时`swag`服务已经自动为你申请了一个证书并启动了反向代理服务，此时在浏览器访问 `https://tailchat.example.com` 的话可以看到熟悉的界面已经出现了。
