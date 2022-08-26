---
sidebar_position: 4
title: "data-tc-role"
---

`Tailchat Role` 是一种通过`data-*`方式来标识DOM的一种方式，表明该节点在`Tailchat`中的角色, 开发者可以通过这来找到对应角色的DOM节点

例如: `[data-tc-role=navbar]`

- `navbar`: 导航栏
- `navbar-personal`: 导航栏中的个人主页
- `navbar-groups`: 导航栏中的群组
- `navbar-settings`: 导航栏中的设置
- `sidebar-personal`: 个人主页中的侧边栏
- `sidebar-group`: 群组中的侧边栏
- `content-personal`: 个人主页中的内容
- `content-group`: 群组页面中的内容
- `modal`: 模态框
- `modal-mask`: 模态框的遮罩层
