---
sidebar_position: 10
title: 常见问题
---

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
