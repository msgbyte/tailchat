---
sidebar_position: 1
title: 命令行工具测试方式
---

首先需要确保已经安装了 `tailchat-cli`, 版本在 `1.5.8` 以上, 安装方式见: [命令行工具 tailchat-cli](../cli/tailchat-cli.md)

你可以在 Tailchat 的 Help 指令看到benchmark支持的如下命令:

```
tailchat benchmark

Tailchat Benchmark Test

Commands:
  tailchat benchmark message            Stress testing through Tailchat network
                                        requests (suitable for pure business
                                        testing)
  tailchat benchmark connections <url>  Test Tailchat Connections
  tailchat benchmark register <url>     Create Tailchat temporary account and
                                        output token

Options:
      --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
```

其中我们主要使用的是`connections`命令与`register`命令

## 批量注册测试用户

首先我们需要批量注册测试用户, 这里我们需要用到`register`命令 

```
tailchat benchmark register <url>

Create Tailchat temporary account and output token

Options:
      --version  Show version number                                   [boolean]
      --file     Account Token Path  [string] [required] [default: "./accounts"]
      --count    Register Count               [number] [required] [default: 100]
      --invite   Invite Code                                            [string]
  -h, --help     Show help                                             [boolean]
      --url                                                           [required]
```

如我们需要在本地批量注册账号

```bash
tailchat benchmark register http://127.0.0.1:11000
```

该命令会在`http://127.0.0.1:11000`服务下注册100个临时用户。注意结尾不需要'/'。

命令执行完毕后，会将用于登录的 token 保存到本地文件，默认是`./accounts`文件。

我们可以用`--count`指定注册的数量, 以及用`--invite` 来让其在注册后自动加入某个测试群组

如:
```bash
tailchat benchmark register http://127.0.0.1:11000 --count 10000 --invite <invite-code>
```

> 注意: 为了保证服务质量，注册操作是以串行方式进行发送的，即前一个注册操作完成后后一个注册操作才会开始。因此如果设定数量过大的话可能会导致耗时很长。

其中`<invite-code>`需要用户自行创建群组并创建一个邀请链接。一个邀请链接的格式形如: `http://localhost:11011/invite/<invite-code>`

完成后我们就可以获得对应数量的测试用户加入群组。

## 用户批量登录

我们要测试服务器在允许多人在线情况下的表现，我们需要使用`connections`命令来登录并建立连接。

`connections`命令会自动读取上个操作批量注册后的token文件作为需要登录的用户

```
tailchat benchmark connections <url>

Test Tailchat Connections

Options:
      --version     Show version number                                [boolean]
      --file        Account Token Path
                                     [string] [required] [default: "./accounts"]
      --groupId     Group Id which send Message                         [string]
      --converseId  Converse Id which send Message                      [string]
  -h, --help        Show help                                          [boolean]
      --url                                                           [required]
```

如我们要直接登录到本地的服务:

```bash
tailchat benchmark connections http://127.0.0.1:11000
```

此时我们可以通过服务端的资源检测工具查看当测试用户都上线后服务端的内存占用与cpu占用情况。

### 消息推送用时检测

为了测试Tailchat聊天服务器在实际会话中的表现，我们可以检测一条消息从客户端发送给服务端并且服务端将消息广播到所有用户所需要的用时。

这里我们需要指定要发送消息的目标，如下

```bash
tailchat benchmark connections http://127.0.0.1:11000 --groupId <groupId> --converseId <converseId>
```

在群组会话中的地址栏格式形如: `http://localhost:11011/main/group/<groupId>/<converseId>`

当所有会话接受完毕后，会打印出期间的耗时
