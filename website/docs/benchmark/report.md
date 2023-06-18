---
sidebar_position: 2
title: Benchmark Report
---

## Cluster benchmark test

:::info

Test version: v1.7.6

Basic information of the test cluster:
- mongo: **0.2**cpu **256**Mi memory single instance
- redis: **0.1**cpu **64**Mi memory single instance
- minio: **0.1**cpu **128**Mi memory single instance
- tailchat: **0.2**cpu **512**Mi memory 3 instances

> The test service is a complete service, that means, a complete service loaded with services and plugins, without any directional optimization for data to look good (better performance can be obtained by controlling the services that reduce loading and turning off some unnecessary capabilities )
>
> Among them, the cpu model is: `Intel(R) Xeon(R) CPU @ 2.20GHz`
>
> The server network uses `Singapore Google Cloud`, and the test machine uses `Telecom Shanghai`. Actually, there is a certain network loss. The cluster service is provided by sealos for this pressure test.
:::

### Test method

The test mode consists of an actual observer + several virtual users started by cli. See the test method: [cli](./cli.md)

The main commands are as follows:

```
tailchat benchmark register https://<xxxxxx>.cloud.sealos.io --invite <inviteCode>
tailchat benchmark connections https://<xxxxxx>.cloud.sealos.io
tailchat benchmark connections https://<xxxxxx>.cloud.sealos.io --groupId <groupId> --converseId <converseId> --messageNum 5
```

> The following descriptions about cpu/memory are the average value of multiple instances

### 100 user online test

#### Online Status

When only one actual user is logged in, the system occupancy is:
- cpu: 0.90%
- Memory: 176.3 Mi

After logging in 100 online users, the system occupancy is:
- cpu: 14.80 % -> 8.89% -> 1.33% (because the actual observer gets all 100 user online information at one time)
- Memory: 179.37 Mi

#### Message sending status

Test the sending and receiving of all messages 5 times

```
✔ 100 clients have been created.
Start send message test: 1
ℹ Start message receive test, message: 0c55e168904f02a3
✔ All client received, usage: 420ms
Start send message test: 2
ℹ Start message receive test, message: 6f000fb91dc85fe1
✔ All client received, usage: 89ms
Start send message test: 3
ℹ Start message receive test, message: 79cce2beee015c5f
✔ All client received, usage: 89ms
Start send message test: 4
ℹ Start message receive test, message: 8df7c58fdadb30aa
✔ All client received, usage: 96ms
Start send message test: 5
ℹ Start message receive test, message: 97c782b36312022c
✔ All client received, usage: 98ms
```

### 500 user online test

#### Online Status

When no user is logged in, the system occupancy is:
- cpu: 0.92%
- Memory: 208.5533 Mi

After logging in 500 online users, the system occupancy is:
- cpu: 3.30%
- Memory: 241.1933 Mi

#### Message sending status

Test the sending and receiving of all messages 5 times

```
✔ 500 clients have been created.
Start send message test: 1
ℹ Start message receive test, message: ef39144e96ce3ab8
✔ All client received, usage: 497ms
Start send message test: 2
ℹ Start message receive test, message: 5a86b397aab8ff92
✔ All client received, usage: 406ms
Start send message test: 3
ℹ Start message receive test, message: 69066c6d4a4402b0
✔ All client received, usage: 403ms
Start send message test: 4
ℹ Start message receive test, message: 3b066befc54b4835
✔ All client received, usage: 424ms
Start send message test: 5
ℹ Start message receive test, message: 3a6ef9cc7e8e6eac
✔ All client received, usage: 752ms
```

### 1k user online test

#### Online Status

When no user is logged in, the system occupancy is:
- cpu: 0.88%
- Memory: 202.978 Mi

> When I establish more than 800 connections, a large number of `transport close` errors will be triggered and the connection cannot be established
>
> In order to be able to carry 1000 people at the same time, I choose to expand the capacity horizontally and expand the number of instances to 5 instances

After logging in 1000 online users, the system occupancy is:
- cpu: 3.27%
- Memory: 210.876 Mi

#### Message sending status

Test the sending and receiving of all messages 5 times

```
✔ 1000 clients have been created.
Start send message test: 1
ℹ Start message receive test, message: e65050aa6d4237bb
✔ All client received, usage: 2194ms
Start send message test: 2
ℹ Start message receive test, message: a7b02d30e25f02d0
✔ All client received, usage: 954ms
Start send message test: 3
ℹ Start message receive test, message: 75aa655a94cb308f
✔ All client received, usage: 988ms
Start send message test: 4
ℹ Start message receive test, message: 106b8830443002d9
✔ All client received, usage: 733ms
Start send message test: 5
ℹ Start message receive test, message: 0593646f9c7da288
✔ All client received, usage: 738ms
```

## Standalone benchmark test

:::info
Test version: v1.7.6

Basic information of the test environment:

- NAS deployment dependency (DS220plus): Intel Celeron J4025, 2GB DDR4
  -mongo
  - redis
  -minio
- PC, cpu: i7-8700K, 32G memory
  - tailchat
:::

### 2k user online test

#### Message sending status

Test the sending and receiving of all messages 5 times

```
✔ 2000 clients have been created.
Start send message test: 1
ℹ Start message receive test, message: 8f4edd63886d80eb
✔ All client received, usage: 244ms
Start send message test: 2
ℹ Start message receive test, message: 20e0bc3e2ea1365c
✔ All client received, usage: 246ms
Start send message test: 3
ℹ Start message receive test, message: 7bed6a2cb12238a5
✔ All client received, usage: 248ms
Start send message test: 4
ℹ Start message receive test, message: 6f49353efa2467fc
✔ All client received, usage: 245ms
Start send message test: 5
ℹ Start message receive test, message: 850bed7ed8fa860c
✔ All client received, usage: 248ms
```

### 5k user online test

#### Message sending status

Test the sending and receiving of all messages 5 times

```
✔ 5000 clients have been created.
Start send message test: 1
ℹ Start message receive test, message: 85e2624234b8c66a
✔ All client received, usage: 933ms
Start send message test: 2
ℹ Start message receive test, message: ae025dd881ef5ae7
✔ All client received, usage: 714ms
Start send message test: 3
ℹ Start message receive test, message: 55a6c359fe74c90f
✔ All client received, usage: 691ms
Start send message test: 4
ℹ Start message receive test, message: 9eaefcc761c77c8c
✔ All client received, usage: 644ms
Start send message test: 5
ℹ Start message receive test, message: 856a49a1528ad5e1
✔ All client received, usage: 787ms
```


### 10k user online test

#### Message sending status

Test the sending and receiving of all messages 5 times

```
✔ 10000 clients has been create.
Start send message test: 1
ℹ Start message receive test, message: 06b6bf829b66cca9
✔ All client received, usage: 1219ms
Start send message test: 2
ℹ Start message receive test, message: 3a544d3c0e6d8a14
✔ All client received, usage: 1189ms
Start send message test: 3
ℹ Start message receive test, message: b1d0ea01481b6717
✔ All client received, usage: 1089ms
Start send message test: 4
ℹ Start message receive test, message: af3512e57ce2ad0e
✔ All client received, usage: 1142ms
Start send message test: 5
ℹ Start message receive test, message: d09db4b9a348b32a
✔ All client received, usage: 1232ms
```
