---
sidebar_position: 7
title: Environment Variable
---

## Environment Variable

| Name | Default Value | Description |
| ----- | ------ | --- |
| PORT | 11000 | Gateway service port number |
| SECRET | tailchat | encryption key, used for JWT |
| STATIC_HOST | "{BACKEND}" | Externally accessible static service address, used for file service access, the default is the dynamic server address inferred from the front-end request, if it is expected to be stored in a third-party OSS, it needs to be modified |
| API_URL | http://127.0.0.1:11000 | Externally accessible url address, used for issuer issuance on open platforms or as a fallback for file services |
| MONGO_URL | - | Database service address |
| REDIS_URL | - | Redis service address |
| MINIO_URL | - | File service address (minio) |
| MINIO_USER | - | File service username |
| MINIO_PASS | - | File service password |
| MINIO_BUCKET_NAME | tailchat | file service bucket name |
| SMTP_SENDER | - | Mail service sender (example: `"Tailchat" example@163.com`) |
| SMTP_URI | - | mail service connection address (example: `smtp://username:password@smtp.example.com/?pool=true`) |
| FILE_LIMIT | 1048576 | File/image upload size limit, the default is 1m, please enter a number(unit: byte) |
| EMAIL_VERIFY | - | Whether to enable email verification, if it is "1" or "true", add email verification control when registering |
| DISABLE_LOGGER | - | Whether to disable the log output, if "1" or "true" turn off the log on the fly |
| DISABLE_USER_REGISTER | - | Whether to disable the user register, if "1" or "true" turn off this method |
| DISABLE_GUEST_LOGIN | - | Whether to disable the guest login, if "1" or "true" turn off this method |
| DISABLE_CREATE_GROUP | - | Whether to disable user create group, if "1" or "true" turn off this method |
| DISABLE_PLUGIN_STORE | - | Whether to hide user plugin store entry, if "1" or "true" turn off this method |
| DISABLE_ADD_FRIEND | - | Whether to hide user add friend entry, if "1" or "true" turn off this method |

> Some examples of environment variables can be seen: https://github.com/msgbyte/tailchat/blob/master/server/.env.example

### Use files to configure environment variables

- - If starting locally, copy `.env.example` to `.env` and edit
  ```bash
  mv .env.example .env
  vi .env
  ```

- If it is started by `docker-compose`, you can directly edit `docker-compose.env`, and use `docker compose up -d` directly after the modification to take effect

### About the use of environment variables with spaces

If your environment variable value contains spaces, in order for the system to recognize that this is a complete string instead of treating spaces as separators. You need to wrap a double quotes around the outside.

For example:

```bash
SMTP_SENDER="\"Tailchat\" example@163.com" # If there are repeated double quotes, they need to be escaped with an escape character
```


-------------

:::caution
Some environment variable modifications may need to clear the cache to take effect
:::
