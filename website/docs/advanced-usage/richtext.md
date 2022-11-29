---
sidebar_position: 1
title: 富文本语法
---

## 对于普通用户

Tailchat 内置了 `com.msgbyte.bbcode` 插件用于对富文本消息做支持(且是默认安装的)。

以下是目前 `bbcode` 插件支持的语法列表：

| 关键字 | 描述 | 用法示例 | 预览 |
| ------ | ----- | ------ | ----- |
| b | 文本加粗 | `[b]foo[/b]` | <b>foo</b> |
| i | 文本倾斜 | `[i]foo[/i]` | <i>foo</i> |
| u | 文本下划线 | `[u]foo[/u]` | <ins>foo</ins> |
| s | 文本删除线 | `[s]foo[/s]` | <del>foo</del> |
| url | 超链接 | <div style={{width: 400}}>`[url]https://tailchat.msgbyte.com[/url]` / `[url=https://tailchat.msgbyte.com]官网[/url]`</div> | <a>https://tailchat.msgbyte.com</a> / <a href="https://tailchat.msgbyte.com">官网</a> |
| img | 图片 | `[img]https://tailchat.msgbyte.com/img/logo.svg[/img]` | <div style={{width: 60}}><img src="https://tailchat.msgbyte.com/img/logo.svg" /></div>  |
| at | 提及 | `[at=<hereisuserid>]moonrailgun[/at]` | - |
| emoji | 表情 | `[emoji]smile[/emoji]` | - |
| markdown / md | markdown语法支持 | `[markdown]## Heading[/markdown]` | - |

## 对于插件开发者

如果你的插件需要使用统一的富文本支持，请在你的渲染函数中这样实现:

```jsx
import { getMessageRender } from '@capital/common';

const Component = (text: string) => {
  return <div>{getMessageRender(text)}</div>
}
```
