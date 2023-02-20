---
sidebar_position: 1
title: 数据库管理
---

`tailchat` 使用 mongodb 作为主要数据库存储用户信息

在`docker`中，常见的运维命令如下:

```bash
# 备份
docker exec -i <IMAGE_NAME> mongodump -d tailchat --archive > ./backup.archive

# 还原
docker exec -i <IMAGE_NAME> mongorestore -d tailchat --archive < ./backup.archive
```

其中`<IMAGE_NAME>` 表示mongodb镜像名，而`-d tailchat` 表示使用的数据库的名字，默认启动的数据库名为`tailchat`, 你可以通过环境变量`MONGO_URL`进行修改

:::info
为了用户数据安全，建议创建定时任务定期备份数据库文件
:::
