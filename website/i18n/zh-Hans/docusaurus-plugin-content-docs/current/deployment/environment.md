---
sidebar_position: 7
title: 环境变量
---

## 环境变量

| 变量名 | 默认值 | 描述 |
| ----- | ------ | --- |
| PORT | 11000 | 网关服务端口号 |
| SECRET | tailchat | 加密秘钥, 用于JWT |
| STATIC_HOST | "{BACKEND}" | 对外可访问的静态服务主机，用于文件服务访问, 默认为动态根据前端请求推断出的服务端地址，如果期望存储在第三方OSS中需要进行修改 |
| STATIC_URL | "{BACKEND}/static/" | 对外可访问的静态服务完整地址前缀，用于文件服务访问, 默认为动态根据前端请求推断出的服务端地址，如果期望存储在第三方OSS中需要进行修改, 如果设置了本变量则上面的 `STATIC_HOST` 值无效 |
| API_URL | http://127.0.0.1:11000 | 对外可访问的url地址，用于开放平台的issuer签发或者作为文件服务的fallback |
| MONGO_URL | - | 数据库服务地址 |
| REDIS_URL | - | Redis服务地址 |
| MINIO_URL | - | 文件服务地址(minio) |
| MINIO_USER | - | 文件服务用户名 |
| MINIO_PASS | - | 文件服务密码 |
| MINIO_BUCKET_NAME | tailchat | 文件服务存储桶名 |
| MINIO_PATH_STYLE | "Path" | 是否使用路径形式的s3通信格式, `Path` 为 `Path Style`, `VirtualHosted` 为 `Virtual hosted style` |
| MINIO_SSL | false | 是否使用加密连接文件存储服务, 如果为 "1" 或者 "true" 则使用SSL协议 |
| SMTP_SENDER | - | 邮件服务发件人(示例: `"Tailchat" example@163.com`) |
| SMTP_URI | - | 邮件服务连接地址(示例: `smtp://username:password@smtp.example.com/?pool=true`) |
| FILE_LIMIT | 1048576 | 文件/图片上传的大小限制，默认为1m，请输入数字，（单位: 字节） |
| EMAIL_VERIFY | - | 是否开启邮箱校验, 如果为 "1" 或者 "true" 则在注册时增加邮箱校验控制 |
| REQUEST_TIMEOUT | 10000 | 请求超时毫秒数，请求超过该时间没有完成会抛出 `RequestTimeout` 错误。 如果需要禁用请求超时限制传：0 |
| TIANJI_SCRIPT_URL | - | Tianji 脚本 URL，如需监控 Tailchat 用户使用情况，可在天际网站代码模式中获取 (例如：`https://tianji.example.com/tracker.js`) |
| TIANJI_WEBSITE_ID | - | Tianji 网站 id |
| DISABLE_SOCKET_MSGPACK | - | 是否禁用socket使用messagepack, 如果为 "1" 或者 "true" 则禁用该功能 |
| DISABLE_LOGGER | - | 是否禁用日志输出, 如果为 "1" 或者 "true" 则在运行中关闭日志 |
| DISABLE_USER_REGISTER | - | 是否关闭用户注册功能, 如果为 "1" 或者 "true" 则关闭该功能 |
| DISABLE_GUEST_LOGIN | - | 是否关闭用户游客登录功能, 如果为 "1" 或者 "true" 则关闭该功能 |
| DISABLE_CREATE_GROUP | - | 是否关闭用户创建群组功能, 如果为 "1" 或者 "true" 则关闭该功能 |
| DISABLE_PLUGIN_STORE | - | 是否隐藏用户插件中心功能, 如果为 "1" 或者 "true" 则关闭该功能 |
| DISABLE_ADD_FRIEND | - | 是否隐藏用户添加好友功能, 如果为 "1" 或者 "true" 则关闭该功能 |
| DISABLE_TELEMETRY | - | 是否关闭遥测报告功能, 遥测是完全匿名的，如果为 "1" 或者 "true" 则关闭该功能 |

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

### 如何清理缓存

一些环境变量的改动可能涉及到缓存的更新，如 `FILE_LIMIT`, 因为配置信息是需要发送到客户端的。

因此可能会出现修改环境变量后在客户端上的表现还是和以前一样的情况。这时候你需要清空旧的缓存来让更新生效。

以下有几种方案可以清理缓存:

- `docker compose down` 后执行 `docker compose up -d`. 这是因为 `redis` 服务的数据并没有被持久化，把服务关了再重启相当于一个全新的环境
- 手动进入 `redis` 服务清理名称包含 `config.client` 的缓存项，这里面包含了返回给客户端的配置项
- 进入 `admin` 管理后台的缓存管理页面。点击`清理配置缓存`按钮
