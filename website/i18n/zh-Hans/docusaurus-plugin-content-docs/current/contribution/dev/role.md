---
sidebar_position: 1
title: 身份组与权限
---

身份组是在群组管理中划分用户权限点的形式(RBAC)。

身份组是由一系列权限点的开关组合而成的，而一个用户可能是由多个身份组组合而成的，比如身份组A拥有A权限，身份组B拥有B权限，那么作为同时拥有身份组A和身份组B的用户C则拥有权限A和权限B。为了简化权限的设计，权限点则是通过简单的`true/false`实现的

更多关于 `RBAC` 可以查看相关wiki: https://en.wikipedia.org/wiki/Role-based_access_control 在此不做赘述。

下面主要讲讲在 `Tailchat` 是如何增加/修改权限点的

## 内置权限

权限点需要同时在前端和后端均做一次声明，前端负责前端的显示，后端负责做兜底的权限校验。如果没有权限的话处理接口应当直接范围一个报错。

### 前端管理

前端的权限点列表维护在 `client/shared/utils/role-helper.ts` 中, 包含权限点的权限点位, 如:

```tsx
export const PERMISSION = {
  /**
   * 非插件的权限点都叫core
   */
  core: {
    message: 'core.message',
  },
};
```

以及权限点的在管理页面中的显示:
```tsx
export const getPermissionList = (): PermissionItemType[] => [
  {
    key: PERMISSION.core.message,
    title: t('发送消息'),
    desc: t('允许成员在文字频道发送消息'),
    default: true,
  }
];
```

使用方式则是通过hooks获取维护在群组下的权限点:

```tsx
const [allowSendMessage] = useHasGroupPermission(groupId, [
  PERMISSION.core.message,
]);
```

使用数组的方式便于一些业务逻辑需要拥有多个权限点。


### 后端

后端的权限声明则是在 `server/packages/sdk/src/services/lib/role.ts` 中维护，使用方式也非常简单。如下：
```ts
const [hasPermission] = await call(ctx).checkUserPermissions(
  groupId,
  userId,
  [PERMISSION.core.message]
);
if (!hasPermission) {
  throw new NoPermissionError(t('没有操作权限'));
}
```


## 插件权限

TODO
