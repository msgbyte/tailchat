---
sidebar_position: 1
title: Database management
---

`Tailchat` uses mongodb as the main database to store user information

In `docker`, common operation and maintenance commands are as follows:

```bash
# backup
docker exec -i <IMAGE_NAME> mongodump -d tailchat --archive > ./backup.archive

# restore
docker exec -i <IMAGE_NAME> mongorestore -d tailchat --archive < ./backup.archive
```

Among them `<IMAGE_NAME>` represents the name of the mongodb image, and `-d tailchat` represents the name of the database used, the default database name is `tailchat`, you can modify it through the environment variable `MONGO_URL`

:::info
For user data security, it is recommended to create a scheduled task to regularly back up the database file
:::
