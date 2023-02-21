---
sidebar_position: 1
title: Identity Groups and Permissions
---

Identity groups are a form of dividing user authority points in group management (RBAC).

An identity group is composed of a series of permission point switches, and a user may be composed of multiple identity groups. For example, identity group A has A permission, and identity group B has B permission. User C in group A and identity group B has permission A and permission B. In order to simplify the design of permissions, permission points are implemented through simple `true/false`

More about `RBAC` can be found in the related wiki: https://en.wikipedia.org/wiki/Role-based_access_control I won’t go into details here.

The following mainly talks about how to add/modify permission points in `Tailchat`


## Built-in permissions

Permission points need to be declared on both the front-end and back-end at the same time. The front-end is responsible for the display of the front-end, and the back-end is responsible for the comprehensive permission verification. If there is no permission, the processing interface should directly throw an error.

### Frontend Management

The permission point list of the front end is maintained in `client/shared/utils/role-helper.ts`, including the permission point of the permission point, such as:


```tsx
export const PERMISSION = {
  /**
   * Non-plugin permission points are called core
   */
  core: {
    message: 'core.message',
  },
};
```

And the display of the permission point on the management page:

```tsx
export const getPermissionList = (): PermissionItemType[] => [
  {
    key: PERMISSION.core.message,
    title: t('Send Message'),
    desc: t('Allow members to send messages in text channel'),
    default: true,
  }
];
```

The way to use it is to obtain the permission points maintained under the group through hooks:

```tsx
const [allowSendMessage] = useHasGroupPermission(groupId, [
  PERMISSION.core.message,
]);
```

The way of using arrays is convenient for some business logics that need to have multiple permission points.


### backend

The permission statement of the backend is maintained in `server/packages/sdk/src/services/lib/role.ts`, and the usage method is very simple. as follows:
```ts
const [hasPermission] = await call(ctx).checkUserPermissions(
  groupId,
  userId,
  [PERMISSION.core.message]
);
if (!hasPermission) {
  throw new NoPermissionError(t('no operation permission'));
}
```


## Plugin permissions

TODO
