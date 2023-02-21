---
sidebar_position: 2
title: Deploy Tailchat Meeting
---

The video conferencing service `Tailchat Meeting` can exist as an independent application. In this section, we will describe how to deploy `Tailchat Meeting` independently

The following content is based on the `docker` environment, please ensure that the server has the most basic `docker` environment.

If you haven't installed `docker` + `docker-compose`, you can check the document [Install docker environment](../deployment/install-docker.md)

## Fast deployment

```bash
git clone https://github.com/msgbyte/tailchat-meeting --depth=1
```

> NOTE: Next, the host mode of docker will be used for installation. That means, `docker-compose` will automatically bind the host port

The ports that need to be reserved by the server are as follows:
- swag (server gateway, nginx enhanced version, the port can be modified through the configuration file tailchat-meeting/compose/nginx.conf)
   - 80
   - 443
- tailchat-meeting
   - 13001
   - 40000-49999 (for RTC service, dynamic occupancy)
-redis
   - 6379

**The above ports will be exposed on the host machine. For the sake of server security, it is recommended to configure a suitable firewall policy, and only expose the necessary ports 443 and 40000-49999**

```bash
cd tailchat-meeting/compose
cp docker-compose.env.example docker-compose.env
vi docker-compose.env
```

Modify environment variables.
The environment variables are as follows:

```
# Internal IP
MEDIASOUP_IP=
# Public IP
MEDIASOUP_ANNOUNCED_IP=

# swag
URL=
SUBDOMAINS=
TZ=Asia/Shanghai
```

其中

- If you only deploy on a single machine, `MEDIASOUP_IP` and `MEDIASOUP_ANNOUNCED_IP` can both fill in the public network ip of the server, **But for service providers with flexible deployment networks (such as domestic AWS, Tencent Cloud, Alibaba Cloud, etc.) must strictly follow the notes to fill in the internal IP and public network IP** (because the external network IP provided by this type of service provider is not bound to the network card)
- `tailchat-meeting` is based on **webrtc** service, so it strongly depends on https/wss protocol. The swag service can automatically apply for an https certificate for you, but you must assign a valid domain name and ensure that the dns point has been pointed to the server.
  - More related documents can be viewed [README](https://github.com/linuxserver/docker-letsencrypt/blob/master/README.md)
  - Sample configuration:
  ```bash
  URL=meeting.example.com # 这里请填入
  SUBDOMAINS= # 该参数用于多域名证书申请，可留空
  ```


After the modification, you can directly execute the following command

```bash
docker compose up -d
```

`docker compose` will automatically download images from the network and build `tailchat-meeting`

Building may take time and resources. Especially for building the frontend code, please be patient if you use a server with a low server.

> In the real world test, the time-consuming reference of a small resource server with 1 core and 2G is as follows:
> - Download dependencies: 3 minutes
> - Compile frontend code: 5 minutes

Visit `https://meeting.example.com` to see `tailchat-meeting` page

## Combined usage

For fool-proof deployment, it only needs one command to execute. If there are ready-made gateway services (such as nginx, caddy, etc.) and redis instances, you can selectively start the services.

For example:

```bash
docker compose up tailchat-meeting -d # Only run the tailchat-meeting instance
```


## Reasons for using host mode

The core RTC service of `tailchat-meeting` needs to apply for a port at runtime, but this function cannot be realized for docker. Pre-applying for a certain range of port bindings will not only waste meaningless ports, but also occupy a lot of resources and kill the system instantly when starting.

**It should be noted that please do not expose the 6379 port where redis is located, which may cause security risks. **
