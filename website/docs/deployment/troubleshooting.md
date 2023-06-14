---
sidebar_position: 10
title: Troubleshooting
---

## Server related

### The Websocket connection access is incorrect, the manifestation is that it can be registered but the main interface cannot be opened

If nginx is used for reverse proxy. Please ensure that the configuration of nginx supports websocket, a reference configuration is as follows:

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

### Internal Network can be accessed but External Network can not be accessed?

You can start a simple http service to see if it is a problem with the docker-proxy layer. *This problem may occur on the docker-ce image machine of Tencent lighthouse, you can choose to use the centos7 image to reinstall*

```bash
docker run --rm --name nginx-test -p 8080:80 nginx
```

### There will be a random hash volume at startup

See: [https://github.com/msgbyte/tailchat/issues/79](https://github.com/msgbyte/tailchat/issues/79)

### Getting `502 Invalid paramenters` when sending mail

If the prompt is similar to: `Error: Mail command failed: 502 Invalid paramenters`

```
code:'EENVELOPE',
response: '502 Invalid paramenters',
responseCode: 502,
command: 'MAIL FROM'
```

Please check whether your `SMTP_SENDER` content is correct, the general format is `xxx@example.com` or `"YourName" xxx@example.com`

## Openapi platform related

If the open platform is deployed behind a proxy, if the endpoint in the JSON of the access `/open/.well-known/openid-configuration` result is incorrect, please try to modify the configuration of the proxy to forward real ip.

Such as nginx:

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
