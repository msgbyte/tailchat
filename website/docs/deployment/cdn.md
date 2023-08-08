---
sidebar_position: 11
title: CDN Deployment (optional)
---

There may be cases where front-end and back-end are deployed separately. For example, if you want to manage front-end code separately in object storage, add CDN support. You need to compile the front-end code separately.

Backend code is still recommended to use `docker` to deploy

In order to compile the front-end code separately, you need to download the source code and compile it manually

```bash
git clone https://github.com/msgbyte/tailchat.git
cd tailchat

# You can switch between different distributions by git checkout v1.8.8

pnpm install # You need to use `pnpm` to install dependencies, using other package management tools may cause problems
```

Wait patiently for dependencies to be installed

Enter the front-end code and compile it

```bash
cd client/web
SERVICE_URL=<your-api-url> pnpm build
```

Make sure the value of `SERVICE_URL` is the address of your api backend, for example: `http://127.0.0.1:11000`

After compiling, you can get all the front-end files in the `tailchat/client/web/dist` directory.
