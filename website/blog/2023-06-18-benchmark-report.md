---
title: The Tailchat benchmark report is freshly released, just takes 1.2 seconds to fully accept broadcast messages in 10k user
authors: moonrailgun
image: /img/logo.svg
slug: benchmark-report
keywords:
  - tailchat
  - benchmark
tags: [Report]
---

As an IM application, `Tailchat` naturally needs to be able to handle high concurrent multiplayer online capabilities.

In order to measure `Tailchat`'s ability to handle a large number of users and give our customers enough confidence, we decided to take the time to test the actual performance in the actual production environment.

Because in order to meet the scale requirements of users with different levels and needs, the underlying design of `Tailchat` is based on a distributed architecture, which means that we can carry business requirements of different scales through horizontal expansion.

However, the disadvantage of distributed is that more resources are spent on data communication and forwarding, and it is not as fast as the traditional centralized architecture in small-scale operations.

This seems to be a contradiction that can't have both fish and bear's paw, but in order to obtain the advantages of both, `Tailchat` has made some special optimizations on single-instance deployment, namely the shortest path principle. This means that if there is and only itself can consume in the mutual calls between microservices, the forwarding stage will be skipped and the request will be sent directly to itself.

This makes the capability of a single machine better than a cluster if the performance is sufficient. And when a single machine cannot support enough business needs, switch to cluster deployment and use multiple instances together to carry high-demand business scale.

![](/img/architecture/transport.excalidraw.png)

## Benchmark test method

In order to measure the performance of Tailchat in multiplayer online situations, we chose the ability to send and receive messages as the measurement standard.

That is: **When several people in a group are online at the same time, the time it takes for a complete link from the start of sending a message to the forwarding of all online users to receive the message**

> Because for the IM project, the traditional 90th/99th percentile data is meaningless, and the most basic ability performance is that all users can receive broadcast messages without loss. Therefore, the requirement for Tailchat is to only look at the 100th percentile data of the time-consuming message dissemination

At the same time, test the **growth performance** of **resident** cpu and memory when multiple people are online

> This test is supported by the cluster service provided by [sealos](https://sealos.io/). sealos is really convenient!

The pressure measurement method is mainly divided into three steps:

1. Register users in batches, and record the token (Token) returned by the system after registration to a local file
1. Load the token stored in the previous step, log in according to the token and establish a persistent connection. After all users have logged in, record the growth of resident resources.
1. After all users have logged in, select a user to connect and send a message to the designated channel of the designated group, and record the start time at the same time. When all connections have received this message, record the end time. At this time, record the end time and calculate the intermediate time consumption. This method counts several sets of data to eliminate errors.


## Benchmark test overview

This pressure test tested the performance of 100 users, 500 users, 1000 users, 2000 users, 5000 users, and 10000 users who are online at the same time and in the same group.

In order to squeeze the performance of `Tailchat` as much as possible, I chose to use the minimum configuration cap to test as many services as possible. In the case of 3 instances, the maximum support reached 800 users, and there was a problem. After expanding to 5 instances, it successfully supported 1,000 users, but when the number of simultaneous online users rose to about 1,300, a bottleneck appeared again. At this time, I guess that it may be caused by the ulimit that comes with the linux system. After all, no relevant directional optimization has been done before this. At this point, I think the cluster test may come to an end temporarily, and I transferred to the window platform.

Sure enough, it lived up to my expectations. There are no relevant restrictions on the windows platform, and the number of online users of `Tailchat` has successfully broken through the limit of 2k, 5k, or even 10k. At this point, I think our stress testing work has met our initial expectations. After all, the same industry has reached the upper limit of the same industry. Of course, I think its upper limit is far more than this, because there is still a lot of room for optimization.

In the highest 10,000-user use case, we tested the elapsed time from message sending to all users receiving the message 5 times. In the end we found that the answer given by `Tailchat` is 1.2 seconds, that is, a message will be sent to all users within 1.2 seconds. I think this data is quite ideal. After all, groups with 10,000 people online at the same time often have more than 100,000 people. Of course, in the follow-up, the situation of a large number of users will be further optimized, and this data will only be a starting point rather than an end point.

## Full Report

The specific benchmark test report can be found in: [Benchmark report](/docs/benchmark/report)
