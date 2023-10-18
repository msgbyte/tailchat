---
sidebar_position: 3
title: External Storage
---

## Background

As the usage scale progresses, the user's storage cost for the Tailchat file system will gradually increase, so the privatized deployment of the object storage service `minio` may have high disk storage costs. In order to reduce costs Tailchat provides a solution to use external third-party object storage services

## Prerequisites

- The external storage service needs to support `aws s3` storage protocol
- `Tailchat` version in `1.8.7+`

## Config

You need to configure the environment variables as follows:
- `MINIO_URL`: s3 service address
- `MINIO_USER`: s3 service username
- `MINIO_PASS`: s3 service password
- `MINIO_BUCKET_NAME`: s3 service bucket name
- `MINIO_PATH_STYLE`: path mode, optional values: `VirtualHosted` or `Path`
- `STATIC_URL`: The uploaded static path address, which is transferred by the server by default. If you want to directly connect to external storage, you need to change it to an externally accessible address

> For `aliyunoss`, we can refer to this document for content-related help: https://www.alibabacloud.com/help/en/oss/developer-reference/use-amazon-s3-sdks-to-access-oss

## Data migration

If you are migrating from a privately deployed `minio` service to a public cloud, then you need to migrate the old data.

Migration files: `files/**`

You can get the trusted content of the storage volume through `docker volume inspect tailchat_storage`, where `Mountpoint` represents the path, package and upload the `<Mountpoint>/tailchat/files` directory to the corresponding

### Database migration script (optional)

> This is not a necessary operation, because even if you do not migrate, you will follow the original path to transfer to the server

TODO: Welcome to co-construction
