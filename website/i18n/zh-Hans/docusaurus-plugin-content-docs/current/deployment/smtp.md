---
sidebar_position: 10
title: SMTP 服务(可选)
---

`Tailchat` 包含邮件服务, 使用的场景如 **密码找回**、**邮件认证**

因为仅需要单向的发送邮件而无需接受邮件，因此在 `Tailchat` 中仅使用简单邮件服务(SMTP).

为了启用该服务，我们需要在环境变量中设置如下内容:

- `SMTP_SENDER`: 发送人信息, 一般的格式是 `xxx@example.com` 或 `"YourName" xxx@example.com`
- `SMTP_URI`: SMTP 邮件服务地址, 遵循国际通用 URI 格式: `<protocol>://<username>:<password>@<host>:<port>/<other-info>`

## 使用 cli 进行辅助测试

如果你对 SMTP 服务不熟，为了提高检测效率你可以选择使用 `tailchat-cli` 来快速帮你验证 smtp 服务可靠性

> 关于 tailchat-cli 的使用见 [tailchat-cli](../cli/tailchat-cli.md)

```
tailchat smtp

SMTP Service

Commands:
  tailchat smtp verify  Verify smtp sender service
  tailchat smtp test    Send test email with smtp service

Options:
      --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
```

你可以使用 `tailchat smtp verify` 验证 URI 可用性，在这个操作中是不会实际发送邮件的。类似于账号登录

如果验证通过后依旧有问题，你可以使用`tailchat smtp test`来实际发送测试邮件来帮助你排查问题，因为实际生产环境中可能性非常多，比如各个服务商的审核问题导致的退信，比如验证程度不一样如有的服务商允许自定义发信人名称有的对其有严格的要求

## SMTP_URI 示例

因为不同的服务商提供的服务各有差异, 这里只能举出部分内容用于演示。如果你有其他的可以作为示例的 URI 欢迎提交 PR 来帮助我们一起完善文档:

- `smtps://<email-address>:<password>@smtp.exmail.qq.com/?pool=true`
- `smtps://<email-address>:<password>@smtp.163.com/?pool=true`
