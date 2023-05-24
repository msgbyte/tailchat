---
sidebar_position: 9
title: Deployment admin platform (optional)
---

:::info
The feature of `admin` is still being iterated, and it is currently in the early trial version  
We will continue to enrich the internal content in the future
:::

Get the latest `admin` configuration from `github`:
```bash
wget https://raw.githubusercontent.com/msgbyte/tailchat/master/docker/admin.yml 
```

Set the account and password of the `admin` in the environment variable `docker-compose.env`:

```ini
ADMIN_USER=tailchat
ADMIN_PASS=<Write the independent background password here, do not tell others>
```

Then use [Multiple Files](https://docs.docker.com/compose/extends/#understanding-multiple-compose-files) to start the application:
```bash
docker compose -f docker-compose.yml -f admin.yml up -d 
```

*Pay attention to the order, because `admin.yml` depends on `docker-compose.yml`, so it should be placed behind*

At this time, add `/admin/` after the access backend address to access:
```
https://tailchat.example.com/admin/
```

*Note: don't forget to have a `/` at the end*


:::info
New version **admin-next** has been released, you can use follow command to try to use.

```
curl -L "https://raw.githubusercontent.com/msgbyte/tailchat/master/docker/admin-next.yml" -o admin.yml
```
:::
