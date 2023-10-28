---
sidebar_position: 10
title: SMTP Service (optional)
---

`Tailchat` includes email services, used in scenarios such as **password recovery**, **mail authentication**

Only simple mail service (SMTP) is used in `Tailchat` because only one-way sending mail is required and no receiving mail is required.

In order to enable the service, we need to set the following in the environment variable:

- `SMTP_SENDER`: sender information, the general format is `xxx@example.com` or `"YourName" xxx@example.com`
- `SMTP_URI`: SMTP mail service address, follow the international common URI format: `<protocol>://<username>:<password>@<host>:<port>/<other-info>`

## Auxiliary testing using cli

If you are not familiar with SMTP service, in order to improve detection efficiency, you can choose to use `tailchat-cli` to quickly help you verify the reliability of SMTP service

> For usage of tailchat-cli, see [tailchat-cli](../cli/tailchat-cli.md)

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

You can verify URI availability with `tailchat smtp verify`, no email is actually sent during this operation. Similar to account login

If there are still problems after the verification is passed, you can use `tailchat smtp test` to actually send a test email to help you troubleshoot the problem, because there are many possibilities in the actual production environment, such as bounced letters caused by audit problems of various service providers, such as The degree of verification is different. For example, some service providers allow custom sender names, and some have strict requirements on them.


## SMTP_URI example

Because the services provided by different service providers are different, only some of the content can be cited here for demonstration. If you have other URIs that can be used as examples, please submit a PR to help us improve the documentation together:

- `smtps://<username>:<password>@smtp.exmail.qq.com/?pool=true`
- `smtps://<username>:<password>@smtp.163.com/?pool=true`
