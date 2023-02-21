---
sidebar_position: 7
title: Environment Variable
---

## Environment Variable

| Name | Default Value | Description |
| ----- | ------ | --- |
| PORT | 11000 | Gateway service port number |
| SECRET | tailchat | encryption key, used for JWT |
| API_URL | http://127.0.0.1:11000 | Externally accessible url address, used for file service access |
| MONGO_URL | - | Database service address |
| REDIS_URL | - | Redis service address |
| MINIO_URL | - | File service address (minio) |
| MINIO_USER | - | File service username |
| MINIO_PASS | - | File service password |
| MINIO_BUCKET_NAME | tailchat | file service bucket name |
| SMTP_SENDER | - | Mail service sender (example: `"Tailchat" example@163.com`) |
| SMTP_URI | - | mail service connection address (example: `smtp://username:password@smtp.example.com/?pool=true`) |
| FILE_LIMIT | 1048576 | File/image upload size limit, the default is 1m, please enter a number |
| EMAIL_VERIFY | - | Whether to enable email verification, if it is "1" or "true", add email verification control when registering |
| DISABLE_LOGGER | - | Whether to disable the log output, if "1" or "true" turn off the log on the fly |

> Some examples of environment variables can be seen: https://github.com/msgbyte/tailchat/blob/master/server/.env.example

### Use files to configure environment variables

- - If starting locally, copy `.env.example` to `.env` and edit
  ```bash
  mv .env.example .env
  vi .env
  ```

- If it is started by `docker-compose`, you can directly edit `docker-compose.env`, and use `docker compose up -d` directly after the modification to take effect
