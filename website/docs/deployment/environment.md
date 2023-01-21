---
sidebar_position: 7
title: 环境变量
---

## 环境变量

| 变量名 | 默认值 | 描述 |
| ----- | ------ | --- |
| PORT | 11000 | 网关服务端口号 |
| SECRET | tailchat | 加密秘钥, 用于JWT |
| API_URL | http://127.0.0.1:11000 | 对外可访问的url地址，用于文件服务访问 |
| MONGO_URL | - | 数据库服务地址 |
| REDIS_URL | - | Redis服务地址 |
| MINIO_URL | - | 文件服务地址(minio) |
| MINIO_USER | - | 文件服务用户名 |
| MINIO_PASS | - | 文件服务密码 |
| MINIO_BUCKET_NAME | tailchat | 文件服务存储桶名 |
| SMTP_SENDER | - | 邮件服务发件人(示例: `"Tailchat" example@163.com`) |
| SMTP_URI | - | 邮件服务连接地址(示例: `smtp://username:password@smtp.example.com/?pool=true`) |
| FILE_LIMIT | 1048576 | 文件/图片上传的大小限制，默认为1m，请输入数字 |
| EMAIL_VERIFY | - | 是否开启邮箱校验, 如果为 "1" 或者 "true" 则在注册时增加邮箱校验控制 |

> 部分环境变量示例可见: https://github.com/msgbyte/tailchat/blob/master/server/.env.example

### 使用文件进行配置环境变量

- 如果是本地方式启动，请复制 `.env.example` 到 `.env` 然后进行编辑
  ```bash
  mv .env.example .env
  vi .env
  ```

- 如果是 `docker-compose` 启动，可以直接编辑 `docker-compose.env`, 改动后直接使用 `docker compose up -d` 即可生效
