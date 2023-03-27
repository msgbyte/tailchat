---
title: Tailchat 群晖部署记录
authors: reacher
image: /img/logo.svg
keywords:
  - tailchat
  - deploy
tags: [blog]
---

- 应用名: Tailchat
- 官网: https://tailchat.msgbyte.com/zh-Hans/(中文)
- GitHub: https://github.com/msgbyte/tailchat

----------

部署环境及方式: 白群晖720+,docker-compose部署, 有二级域名及ssl证书。

部署步骤:

1. git下载docker配置文件
  Docker目录下新建tailchat文件夹,并将以下文件存于文件夹中:
  > https://github.com/msgbyte/tailchat/blob/master/docker-compose.env
  > https://github.com/msgbyte/tailchat/blob/master/docker-compose.yml

2. 修改docker-compose.env
  > SECRET=:加密秘钥,自定义字符串
  > API_URL=:对外可访问的url地址
  > ADMIN_USER=:管理员用户
  > ADMIN_PASS=:管理员密码

3. 拉取镜像及开启服务
  ssh到群晖,切换到/volume1/docker/tailchat文件夹,运行: `docker-compose up -d`部署完成。

4. 外网访问配置-路由器
  打开路由器端口转发功能,增加一条转发记录,8800到群晖的8800端口

5. 群晖反代设置
  控制面板 > 登录门户 > 高级 > 反向代理服务器 > 新增
  ```
  来源:https,域名,端口:8800
  目的:http,群晖IP,端口:11000
  ```
  自定义标题 > 新增 > websocket, 自动增加两条数据,点击保存。

6. 通过https访问系统。
