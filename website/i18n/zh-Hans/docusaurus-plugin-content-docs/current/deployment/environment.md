---
sidebar_position: 7
title: 环境变量
---

## 环境变量

| 变量名 | 默认值 | 描述 |
| ----- | ------ | --- |
| PORT | 11000 | 网关服务端口号 |
| SECRET | tailchat | 加密秘钥, 用于JWT |
| STATIC_HOST | "{BACKEND}" | 对外可访问的静态服务地址，用于文件服务访问, 默认为动态根据前端请求推断出的服务端地址，如果期望存储在第三方OSS中需要进行修改 |
| API_URL | http://127.0.0.1:11000 | 对外可访问的url地址，用于开放平台的issuer签发或者作为文件服务的fallback |
| MONGO_URL | - | 数据库服务地址 |
| REDIS_URL | - | Redis服务地址 |
| MINIO_URL | - | 文件服务地址(minio) |
| MINIO_USER | - | 文件服务用户名 |
| MINIO_PASS | - | 文件服务密码 |
| MINIO_BUCKET_NAME | tailchat | 文件服务存储桶名 |
| SMTP_SENDER | - | 邮件服务发件人(示例: `"Tailchat" example@163.com`) |
| SMTP_URI | - | 邮件服务连接地址(示例: `smtp://username:password@smtp.example.com/?pool=true`) |
| FILE_LIMIT | 1048576 | 文件/图片上传的大小限制，默认为1m，请输入数字，（单位: 字节） |
| EMAIL_VERIFY | - | 是否开启邮箱校验, 如果为 "1" 或者 "true" 则在注册时增加邮箱校验控制 |
| DISABLE_LOGGER | - | 是否禁用日志输出, 如果为 "1" 或者 "true" 则在运行中关闭日志 |
| DISABLE_USER_REGISTER | - | 是否关闭用户注册功能, 如果为 "1" 或者 "true" 则关闭该功能 |
| DISABLE_GUEST_LOGIN | - | 是否关闭用户游客登录功能, 如果为 "1" 或者 "true" 则关闭该功能 |
| DISABLE_CREATE_GROUP | - | 是否关闭用户创建群组功能, 如果为 "1" 或者 "true" 则关闭该功能 |
| DISABLE_PLUGIN_STORE | - | 是否隐藏用户插件中心功能, 如果为 "1" 或者 "true" 则关闭该功能 |

> 部分环境变量示例可见: https://github.com/msgbyte/tailchat/blob/master/server/.env.example

### 使用文件进行配置环境变量

- 如果是本地方式启动，请复制 `.env.example` 到 `.env` 然后进行编辑
  ```bash
  mv .env.example .env
  vi .env
  ```

- 如果是 `docker-compose` 启动，可以直接编辑 `docker-compose.env`, 改动后直接使用 `docker compose up -d` 即可生效


### 关于带空格的环境变量的使用

如果你的环境变量值包含空格，为了让系统能够识别这是一个完整的字符串而不是把空格视为分隔符。你需要在外部包一层双引号。

如下：

```bash
SMTP_SENDER="\"Tailchat\" example@163.com" # 如果有重复的双引号需要使用转义符对其进行转义
```

-----------

:::caution
部分环境变量修改可能需要清理缓存后才能生效
:::
