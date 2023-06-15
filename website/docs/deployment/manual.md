---
sidebar_position: 6
title: Manual Deployment
---

:::caution
The content of this chapter requires you to have a certain degree of understanding of nodejs, git, linux. When there are problems such as dependency problems, environmental problems, system problems, etc., you need to have the ability to solve and troubleshoot problems by yourself.

If you do not understand this, it is not recommended that you use the contents of this chapter for deployment. It is recommended to use a unified image for deployment.
:::

## Dependencies

- git
- nodejs v16.18.0 or above
- pnpm v8.3.1 or above
- mongodb
- redis
- minio

## Download the source code

```bash
mkdir msgbyte && cd msgbyte

git clone https://github.com/msgbyte/tailchat.git
```

### Switch to stable code

Because the cloned code is the latest code, it may be unstable for a short period of time, so if you want to switch to the stable code of each version, you can use the tag function of git

For example, if you wanna use `v1.7.6`, you can use the command:

```bash
git checkout v1.7.6
```

## Compile the project

Tailchat is a front-end and back-end separated project. So we have to deal with the front-end code and the back-end code separately

### Install dependencies

We assume you have installed `nodejs v16.18.0+` or above. And installed `pnpm v8.3.1` or above

```bash
cd tailchat
pnpm install
```

This command will take some time to install all the dependencies of Tailchat. When the installation is complete, the internal plug-in will automatically execute the compilation command.

### Building the project

```bash
NODE_ENV=production pnpm build
```

This command will execute the commands for compiling the front-end and back-end management terminals in parallel. And move the front-end product to the `server/dist/public` directory of the server

When the project is built, our product can run normally

:::caution
Please build in `macos` / `linux` environment as much as possible, window does not necessarily fully support shell commands
:::

## Run the project

In order to ensure the horizontal expansion of the project, although the core code of `Tailchat` is written in the same project, it can be divided into multiple subdivided microservices when it is actually started. Selectively enable different services by passing in a combination of different environment variables.

Create an environment variable file in the server directory using the `.env.example` directory as an example

```bash
cp server/.env.example server/dist/.env
vim .env
```

Modify the necessary environment variables to your own, such as `MONGO_URL`, `REDIS_URL`, `MINIO_URL`

then start the service

```bash
SERVICEDIR=services,plugins pnpm start:service
```

> `SERVICEDIR` indicates the directory where the microservice is loaded
