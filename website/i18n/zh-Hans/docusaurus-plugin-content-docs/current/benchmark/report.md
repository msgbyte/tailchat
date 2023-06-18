---
sidebar_position: 2
title: 压测报告
---

## 集群压测

:::info

测试版本: v1.7.6

测试集群基本信息:
- mongo: **0.2**cpu **256**Mi内存 单实例
- redis: **0.1**cpu **64**Mi内存 单实例
- minio: **0.1**cpu **128**Mi内存 单实例
- tailchat: **0.2**cpu **512**Mi内存 3实例

> 测试服务为完整服务，即加载了service和plugins的完整服务，没有进行任何为数据好看而做的任何定向优化(可以通过控制减少加载的服务以及关闭部分不必要的能力来获得更好的性能)
> 
> 其中, cpu型号为: `Intel(R) Xeon(R) CPU @ 2.20GHz`
> 
> 服务器网络使用的是`新加坡 谷歌云`，测试机器是使用的 `电信 上海`. 实际有一定网络损耗. 本次压测由 sealos 提供集群服务.
:::

### 测试方式

测试方式由一个实际观察者 + 若干个由cli启动的虚拟用户构成。测试方法见: [cli](./cli.md)

主要命令如下:

```
tailchat benchmark register https://<xxxxxx>.cloud.sealos.io --invite <inviteCode>
tailchat benchmark connections https://<xxxxxx>.cloud.sealos.io
tailchat benchmark connections https://<xxxxxx>.cloud.sealos.io --groupId <groupId> --converseId <converseId> --messageNum 5
```

> 以下关于cpu/内存的描述都是多个实例的平均值

### 百人在线测试

#### 在线情况

仅登录一个实际用户的情况下，系统占用情况为:
- cpu: 0.90 %
- 内存: 176.3 Mi

登录 100 个在线用户以后，系统占用情况为:
- cpu: 14.80 % -> 8.89% -> 1.33%(因为实际观察者一次性获取了所有的100个用户在线信息)
- 内存: 179.37 Mi

#### 消息发送情况

测试5次所有消息发送与接收情况

```
✔ 100 clients has been create.
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

### 500人在线测试

#### 在线情况

不登录任何用户的情况下，系统占用情况为:
- cpu: 0.92 %
- 内存: 208.5533 Mi


登录 500 个在线用户以后，系统占用情况为:
- cpu: 3.30%
- 内存: 241.1933 Mi

#### 消息发送情况

测试5次所有消息发送与接收情况

```
✔ 500 clients has been create.
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

### 千人在线测试

#### 在线情况

不登录任何用户的情况下，系统占用情况为:
- cpu: 0.88 %
- 内存: 202.978 Mi

> 当我建立800以上的连接的时候，会触发大量的`transport close`错误无法建立连接
>
> 为了让能够同时承载1000人，我选择进行水平扩容，将实例数拓展成5个实例

登录 1000 个在线用户以后，系统占用情况为:
- cpu: 3.27%
- 内存: 210.876 Mi

#### 消息发送情况

测试5次所有消息发送与接收情况

```
✔ 1000 clients has been create.
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

## 单机压测

:::info
测试版本: v1.7.6

测试环境基本信息:

- NAS部署依赖(DS220plus): Intel Celeron J4025, 2GB DDR4
  - mongo
  - redis
  - minio
- 家用机, cpu: i7-8700K, 32G内存
  - tailchat
:::

### 2000人在线测试

#### 消息发送情况

测试5次所有消息发送与接收情况

```
✔ 2000 clients has been create.
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

### 5000人在线测试

#### 消息发送情况

测试5次所有消息发送与接收情况

```
✔ 5000 clients has been create.
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



### 万人在线测试

#### 消息发送情况

测试5次所有消息发送与接收情况

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
