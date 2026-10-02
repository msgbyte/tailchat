---
sidebar_position: 9
title: 部署管理后台(可选)
---

:::info
管理后台的功能还在不断迭代中，目前正处于前期体验版  
后续会不断丰富内部的内容
:::

从`github`获取最新的管理后台配置:
```bash
wget https://raw.githubusercontent.com/msgbyte/tailchat/master/docker/admin.yml 
```

在环境变量 `docker-compose.env` 中设置管理后台的账号和密码:
```ini
ADMIN_USER=tailchat
ADMIN_PASS=<这里写入独立的后台密码, 不要告知其他人>
```

然后使用[多文件方式](https://docs.docker.com/compose/extends/#understanding-multiple-compose-files)启动应用:
```bash
docker compose -f docker-compose.yml -f admin.yml up -d 
```

*注意先后顺序，因为`admin.yml`依赖`docker-compose.yml`所以要放在后面*

此时访问后台地址后面追加`/admin/`即可访问:
```
https://tailchat.example.com/admin/
```

*注意不要忘记在最后有一个`/`*

## 审计日志

管理后台会把操作记录写入 `audit_logs` 集合，可以在后台的「审计日志」页面检索，内容包括:

- 每一次后台登录尝试，以及通过管理后台发起的所有写操作，记录后台账号、请求路径、请求内容、结果、IP 和 User-Agent;
- 在 Tailchat 中进行的群组管理操作，如角色、成员、面板、邀请码和群组设置的变更以及管理员删除消息，记录操作人的用户 ID、群组 ID 和操作参数。

审计记录只追加，无法在管理后台中修改或删除。密码、令牌等敏感字段在写入前会被脱敏。记录会一直保留，需要清理时请自行在 MongoDB 中处理。

<details>
  <summary>关于弃用的旧版admin</summary>
  
  旧版本 <strong>admin-old</strong> 将于v1.8.6版本被移除，如果你依旧期望使用旧版本，可以切换到之前的版本获取

</details>
