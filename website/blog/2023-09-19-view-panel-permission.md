---
title: Group view panel permission problem
authors: moonrailgun
image: /img/logo.svg
slug: view-panel-permission
keywords:
  - tailchat
tags: []
---

Because of new version of group permission, all group user which create group before cannot view panel because of lost view panel permission.

To batch update all group permission, you may need this script below.

Go into mongodb bash, you can use script in bash like its operation: `docker exec -it <your-mongodb-container-name> mongo`



### switch to tailchat db

```
use tailchat
```

### update all group and append `core.viewPanel` permission to all group

```
db.groups.updateMany({}, { $addToSet: { fallbackPermissions: "core.viewPanel" } })
```
