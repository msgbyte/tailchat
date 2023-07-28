---
sidebar_position: 3
title: 外部存储
---

## 背景

随着使用规模的推移，用户对 Tailchat 文件系统的存储成本会逐步上升，因此私有化部署的对象存储服务`minio`可能会有很高的磁盘存储成本。为了降低成本 Tailchat 提供了使用外部第三方对象存储服务的解决方案

## 前提条件

- 该服务需要支持 `aws s3` 存储协议
- `Tailchat` 版本在 `1.8.7+`

## 配置

你需要通过环境变量配置如下:
- `MINIO_URL`: s3服务地址
- `MINIO_USER`: s3服务用户名
- `MINIO_PASS`: s3服务密码
- `MINIO_BUCKET_NAME`: s3服务 bucket 名
- `MINIO_PATH_STYLE`: 路径模式，`VirtualHosted` or `Path`
- `STATIC_URL`: 上传后的静态路径地址，默认走服务器中转，如果想要走外部存储直连的话需要改为外部可访问的地址

> 对于 `aliyunoss` 我们可以参考该文档获得内容相关帮助: https://www.alibabacloud.com/help/en/oss/developer-reference/use-amazon-s3-sdks-to-access-oss

## 数据迁移

如果你是从私有化部署的 `minio` 服务迁移到公有云上，那么你需要对旧的数据进行迁移。

迁移文件: `files/**`

你可以通过`docker volume inspect tailchat_storage` 获取到存储卷的相信内容，其中 `Mountpoint` 表示路径，把 `<Mountpoint>/tailchat/files` 目录打包上传到对应的

### 数据库迁移脚本(可选)

> 这不是一个必须的操作, 因为就算不迁移也会按照原来的路径去走服务器中转

TODO: 欢迎共建
