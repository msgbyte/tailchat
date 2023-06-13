---
sidebar_position: 1
title: cli Test Method
---

First of all, you need to make sure that `tailchat-cli` has been installed, and the version is above `1.5.8`. For the installation method, see: [tailchat-cli](../cli/tailchat-cli.md)

You can see the following commands supported by benchmark in the Help command of Tailchat:

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

Among them, we mainly use the `connections` command and the `register` command

## Register test users in batches

First of all, we need to register test users in batches, here we need to use the `register` command

```
tailchat benchmark register <url>

Create Tailchat temporary account and output token

Options:
      --version  Show version number                                   [boolean]
      --file     Account Token Path  [string] [required] [default: "./accounts"]
      --count    Register Count               [number] [required] [default: 100]
      --invite   Invite Code                                            [string]
  -h, --help     Show help                                             [boolean]
      --url      
```

If we need to register accounts locally in batches

```bash
tailchat benchmark register http://127.0.0.1:11000
```

This command will register 100 temporary users under `http://127.0.0.1:11000` service. Note that the '/' is not required at the end.

After the command is executed, the token used for login will be saved to a local file, the default is `./accounts` file.

We can use `--count` to specify the number of registrations, and `--invite` to let it automatically join a test group after registration

like:
```bash
tailchat benchmark register http://127.0.0.1:11000 --count 10000 --invite <invite-code>
```

> Note: In order to ensure the quality of service, the register operation is sent in a serial manner, that is, the subsequent register operation will start after the previous register operation is completed. Therefore, if the number of settings is too large, it may take a long time.

Among them, `<invite-code>` requires the user to create a group and create an invitation link. The format of an invite link is: `http://localhost:11011/invite/<invite-code>`

After completion, we can get the corresponding number of test users to join the group.

## User batch login

We want to test the performance of the server when multiple people are allowed online, we need to use the `connections` command to log in and establish a connection.

The `connections` command will automatically read the token file after batch registration in the previous operation as the user who needs to log in

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

If we want to log in directly to the local service:

```bash
tailchat benchmark connections http://127.0.0.1:11000
```

At this point, we can use the resource detection tool on the server to check the memory usage and CPU usage of the server after all test users are online.

### Message push/receive time detection

In order to test the performance of the Tailchat chat server in an actual session, we can measure the time it takes for a message to be sent from the client to the server and for the server to broadcast the message to all users.

Here we need to specify the target to send the message, as follows:

```bash
tailchat benchmark connections http://127.0.0.1:11000 --groupId <groupId> --converseId <converseId>
```

The format of the address bar in a group session is: `http://localhost:11011/main/group/<groupId>/<converseId>`

When all sessions are accepted, the time spent during the period will be printed
