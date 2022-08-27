---
sidebar_position: 10
title: 常见问题
---

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
