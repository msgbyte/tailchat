---
sidebar_position: 1
title: 简单部署
---

## 简介

Kubernetes 是一个开源的容器编排平台，用于自动化部署、扩展和管理容器化应用程序。它提供了一种容器编排的方法，可以自动化容器的部署、调度、负载均衡和故障恢复等任务，使得容器化应用程序可以在分布式系统中高效地运行。

Kubernetes 的优点包括：
- 自动化：Kubernetes 可以自动化容器的部署、调度、负载均衡和故障恢复等任务，减少了人工干预的工作量。
- 可扩展性：Kubernetes 可以在大规模集群中管理数千个容器化应用程序，具有良好的水平扩展性和垂直扩展性。
- 灵活性：Kubernetes 支持多种容器运行时和多种云平台，可以在不同的环境中部署和管理应用程序。
- 可靠性：Kubernetes 提供了强大的故障恢复机制和自我修复能力，可以确保应用程序的高可用性和可靠性。
- 社区支持：Kubernetes 是一个活跃的开源项目，有庞大的社区支持和生态系统，可以快速获取更新和支持。


## 快速入门

如果您想要在 Kubernetes 上部署 Tailchat 项目，那么您可以在项目目录中的 `docker/simple/k8s` 子目录中找到已经准备好的简单 Tailchat 部署配置。这些配置文件包括了用于运行 Tailchat 的 Kubernetes 资源定义，例如 StatefulSet、Service 和 依赖的数据库、持久化存储 等等。这些资源定义可以让您快速地在 Kubernetes 上部署一个简单的 Tailchat 项目，而无需手动创建和配置这些资源。

:::info
需要注意的是，本教程部署的 Tailchat 不包含完整的 Tailchat 生态如**开放平台**与**Admin后台管理平台**
:::

### 环境依赖

为了开始本章的内容，我们假设你已经准备好了一个可用的 kubernetes 环境，关于如何搭建 k8s 环境本节不进行赘述。

### 开始

首先我们需要clone项目仓库:

```bash
git clone git@github.com:msgbyte/tailchat.git
```

将工作目录切到配置文件目录

```bash
cd docker/simple/k8s
```

此时我们可以看到有许多已经准备好了的配置文件，我们可以通过一条命令直接启动:

```bash
kubectl apply -f namespace.yml -f pv.yml -f mongo.yml -f minio.yml -f redis.yml -f tailchat.yml
```

这条命令会依次执行创建`namespace`、创建`pv`和`pvc`、创建`mongodb`、`minio`、`redis`等必须的第三方中间件，最后启动一个多实例的 `tailchat` 服务。

你可以通过以下命令检测各个服务的状态:

```bash
kubectl get svc -n tailchat
```

### 路由与负载均衡。

当所有的服务都就绪后，我们的Tailchat服务目前已经在集群中运行起来了，但是此时我们还无法访问，因为还没有暴露在外部。

对于本地测试，我们可以用`port forward`功能将一个pod的端口映射到本地。而在生产环境，我们则需要构建路由转发。

以 `traefik` 为例:

> Traefik 是一款开源的反向代理和负载均衡器，专门用于处理容器化应用程序和微服务架构中的流量路由和负载均衡。Traefik 支持多种后端服务，包括 Docker、Kubernetes、Mesos、Swarm、Consul、Etcd 等等。它可以自动地发现和配置后端服务，并根据规则将流量路由到相应的服务实例。

#### 安装helm, 并增加仓库地址

`helm` 的安装不做赘述。我们执行以下命令将`traefik`添加到仓库列表

```bash
helm repo add traefik https://helm.traefik.io/traefik
```

#### 在 tailchat 命名空间中安装traefik

```bash
helm install traefik traefik/traefik -n tailchat
```

#### 启动 ingress 资源声明

```bash
kubectl apply -f ingress.yml
```

如果一切正常，则通过以下命令可以看到如下输出

```bash
kubectl get services -n tailchat
```

![](/img/kubernetes/traefik-svc.png)

#### 设置DNS服务

你可以在上述的`ingress.yml`中修改域名地址配置，默认是 `http://tailchat.internal.com/`

如果不期望修改或者没有域名则可以通过修改`hosts`文件来实现:
```bash
sudo vim /etc/hosts
```

然后增加如下路径:

```
127.0.0.1 tailchat.internal.com
```

现在你可以打开浏览器并打开`http://tailchat.internal.com`来访问部署在k8s中的tailchat服务

当然，你也可以访问如下地址检测服务可用性:
```
http://tailchat.internal.com/health
```
