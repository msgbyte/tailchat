---
sidebar_position: 2
title: Install the docker environment
---

> Because the `Tailchat` environment is a bit complicated for beginners, it provides a `docker-based one-command` environment configuration. But for students who are not familiar with `docker`, `docker` itself may also be a kind of complexity.

> Therefore, in order to facilitate everyone to quickly build `Tailchat`, this article is provided as a guide. Students who have a certain understanding of `docker` can skip this article

> This article takes `linux centos` as an example, the goal is to facilitate the deployment directly on the server. For students who want to use it on other systems (`windows`, `mac`), you can refer to the official documentation to install `docker`

## One-command installation of docker

Officially maintained one-command installation `Docker` script, suitable for students who don’t like to study details

Execute the following operations in sequence on the server terminal

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

If the installation is successful, you can skip the subsequent content.

## Manually install docker and docker compose

Official document: [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

```bash
# If you have installed docker before, you can execute the following command to delete the old one
sudo yum remove docker \
                docker-client \
                docker-client-latest \
                docker-common \
                docker-latest \
                docker-latest-logrotate \
                docker-logrotate \
                docker-engine
```


```bash
sudo yum install -y yum-utils # yum-utils provides the yum-config-manager command

sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

> Install docker and docker-compose plugins

```bash
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

*PS: `docker-compose-plugin` provides the `docker compose` command, the usage is the same as `docker-compose`*

> If `docker ps` shows that the daemon process is not started (Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?), you can execute the following command to start it: `sudo systemctl start docker`

## Install docker-compose separately

If the purchased server has been pre-installed with docker, if you want to install docker-compose separately, you can read this section:

Official document: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

```bash
curl -SL https://github.com/docker/compose/releases/download/v2.4.1/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose # Download binaries
sudo chmod +x /usr/local/bin/docker-compose # give execute permission
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose # Soft link to path, can be called directly
docker-compose --version # The line command returns the version number and the installation is successful
```

## NOTICE

For historical reasons, `docker compose` has a `docker` plugin version and a `docker compose` standalone version. Generally speaking, `docker compose xxx` is equivalent to `docker-compose xxx`

## Reference

- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
