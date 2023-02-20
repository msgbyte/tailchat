---
sidebar_position: 2
title: Icon 图标
---

```ts
import { Icon } from '@capital/component';
```

`tailchat` 的 icon 解决方案来自 `iconify`

使用方法很简单:
- 在下述网站中选择想要的图标: [https://icon-sets.iconify.design/](https://icon-sets.iconify.design/)
- 复制选中的key。传给 `Icon` 组件, 示例:
  ```tsx
  <Icon icon="mdi:account" />
  ```

推荐使用`mdi`来统一化图标视觉设计:
[https://icon-sets.iconify.design/mdi/](https://icon-sets.iconify.design/mdi/)
