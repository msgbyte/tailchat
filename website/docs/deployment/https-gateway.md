---
sidebar_position: 8
title: Build https gateway (optional)
---

In `Tailchat`, some services are strongly dependent on `https`, such as audio and video calls, embedding external `https` media resources and web pages, etc.

At the same time, for the safety of users(client to server), we highly recommend that `Tailchat` be provided externally as `https` service.

![](/img/architecture/https-gateway.excalidraw.svg)

If you have no related experience, and only deploy `Tailchat` service on the same machine (without occupying **80**/**443** port), then we recommend `swag` from `Tailchat` Configuration begins.

:::info
You can see the original configuration in [Github](https://github.com/msgbyte/tailchat/tree/master/docker)
:::

Pull the required configuration file directly by the following command
```bash
wget https://raw.githubusercontent.com/msgbyte/tailchat/master/docker/swag.yml
wget https://raw.githubusercontent.com/msgbyte/tailchat/master/docker/swag.env.example -O swag.env
mkdir config
wget https://raw.githubusercontent.com/msgbyte/tailchat/master/docker/config/nginx.conf -O ./config/nginx.conf
```

After completion, you should see the following three files in the current directory:
- `swag.yml`
- `swag.env`
- `config/nginx.conf`

Modify the content of `swag.env`, change the value of `URL` to the domain name, such as: `URL=tailchat.example.com`

:::info
The `https` protocol relies on the domain name for certificate verification, so it is necessary to assign a domain name in advance to point to the target server
:::

The address of the domain name needs to create an A pointing record in the management background of the purchased domain name.

After assigning the domain name we can start the service.

```bash
docker compose -f ./swag.yml up -d
```

If everything goes well, the `swag` service has automatically applied for a certificate for you and started the reverse proxy service. At this time, if you visit `https://tailchat.example.com` in the browser, you can see the familiar The interface is already there.
