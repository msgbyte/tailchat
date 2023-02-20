---
sidebar_position: 1
title: Rich text syntax
---

## For normal users

Tailchat has a built-in `com.msgbyte.bbcode` plugin for rich text message support (and it is installed by default).

The following is a list of syntaxes currently supported by the `bbcode` plugin:

| Keyword | Description | Usage Example | Preview |
| ------ | ----- | ------ | ----- |
| b | bold text | `[b]foo[/b]` | <b>foo</b> |
| i | text italic | `[i]foo[/i]` | <i>foo</i> |
| u | underline text | `[u]foo[/u]` | <ins>foo</ins> |
| s | strikethrough text | `[s]foo[/s]` | <del>foo</del> |
| url | hyperlink | <div style={{width: 400}}>`[url]https://tailchat.msgbyte.com[/url]` / `[url=https://tailchat.msgbyte.com ]Official website[/url]`</div> | <a>https://tailchat.msgbyte.com</a> / <a href="https://tailchat.msgbyte.com">official website</a> |
| img | Image | `[img]https://tailchat.msgbyte.com/img/logo.svg[/img]` | <div style={{width: 60}}><img src="https:/ /tailchat.msgbyte.com/img/logo.svg" /></div> |
| at | Mention | `[at=<hereisuserid>]moonrailgun[/at]` | - |
| emoji | expression | `[emoji]smile[/emoji]` | - |
| markdown / md | markdown syntax support | `[markdown]## Heading[/markdown]` | - |

## For plugin developers

If your plugin needs to use unified rich text support, please implement this in your rendering function:

```jsx
import { getMessageRender } from '@capital/common';

const Component = (text: string) => {
  return <div>{getMessageRender(text)}</div>
}
```
