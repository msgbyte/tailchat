---
title: 群组查看面板权限问题
authors: moonrailgun
image: /img/logo.svg
slug: view-panel-permission
keywords:
  - tailchat
tags: []
---

由于新版本的群组权限，所有之前创建群组的群组用户都无法查看面板，因为失去了查看面板权限。

要批量更新所有群组权限，您可能需要下面的脚本。

进入 `mongodb bash`，您可以在bash中使用脚本，如下操作：`docker exec -it <your-mongodb-container-name> mongo`

### 切换到 tailchat 数据库

```
use tailchat
```

### 更新所有组并向所有组附加 `core.viewPanel` 权限

```
db.groups.updateMany({}, { $addToSet: {fallbackPermissions: "core.viewPanel" } })
```
