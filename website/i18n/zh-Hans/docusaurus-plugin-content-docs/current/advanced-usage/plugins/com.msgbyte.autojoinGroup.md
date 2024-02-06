---
sidebar_position: 4
title: 自动加入群组
---

`com.msgbyte.autojoinGroup`

只需要配置环境：`AUTOJOIN_GROUP_ID=xxxxx`并重新启动服务器

您应该从admin或web端手动创建群组。 然后就可以得到一个groupId。

在 Web端，您可以从 url 获取groupId，形如：`/main/group/<groupId>/<panelId>`

> 用户注册后如果想加入多个群组，可以用英文逗号`,`分割
>
> 例如：AUTOJOIN_GROUP_ID=xxxxx,xxxx
