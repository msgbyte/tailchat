---
sidebar_position: 50
title: 常见问题
---

## 部署相关

### 如何更新版本？

和部署时获取镜像一样

```bash
docker pull moonrailgun/tailchat
docker tag moonrailgun/tailchat tailchat
```

然后重启应用即可, 如 `docker compose up -d`

### 如何使用指定版本?

```bash
docker pull moonrailgun/tailchat:1.8.4
docker tag moonrailgun/tailchat:1.8.4 tailchat
```

在拉取镜像的时候指定版本号即可

## 服务端相关

### Websocket 连接访问不正确，表现形式是可以注册但是无法打开主界面

如果使用了 nginx 进行反向代理。请确保nginx的配置支持websocket，一个参考的配置如下:

```
server {
  server_name demo.example.com;

  listen 443 ssl;

  access_log  /var/log/nginx/host.access.log  main;

  location / {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-real-ip $remote_addr;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_redirect off;
    proxy_pass http://127.0.0.1:11000/;
  }
}
```

### 内网可以访问外网无法访问?

可以启动一个简单的http服务看下是不是docker-proxy层的问题。*该问题可能会出现在腾讯轻量云的docker-ce镜像机器上, 可以选择使用centos7镜像重装*

```bash
docker run --rm --name nginx-test -p 8080:80 nginx
```

### 启动时会出现随机hash的volume

见: [https://github.com/msgbyte/tailchat/issues/79](https://github.com/msgbyte/tailchat/issues/79)

### 发送邮件时出现 `502 Invalid paramenters`

如果提示类似: `Error: Mail command failed: 502 Invalid paramenters`

```
code:'EENVELOPE',
response: '502 Invalid paramenters',
responseCode: 502,
command: 'MAIL FROM'
```

请检查你的`SMTP_SENDER`内容是否正确，一般的格式是 `xxx@example.com` 或 `"YourName" xxx@example.com`

## 开放平台相关

如果开放平台部署在代理之后，如果出现访问 `/open/.well-known/openid-configuration` 结果的json中endpoint不正确的情况，请尝试修改代理的配置。

如nginx:

```
location / {
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;

  proxy_pass http://127.0.0.1:11000;
  proxy_redirect off;
}
```
