# tailchat-server

## Build development environment

Checkout more detail in [https://tailchat.msgbyte.com/docs/deployment/dev](https://tailchat.msgbyte.com/docs/deployment/dev)

#### 服务端插件安装方式

安装所有插件
```
pnpm plugin:install all
```

安装单个插件
```
pnpm plugin:install com.msgbyte.tasks
```

## 单节点部署

#### docker-compose 一键部署

请确保已经安装了:
- docker
- docker-compose(或者docker compose plugin)


在项目根目录下执行
```bash
docker compose build # 需要编译
docker compose up -d
```

## DevOps

### Database management

Checkout more detail in [https://tailchat.msgbyte.com/docs/devops/mongodb](https://tailchat.msgbyte.com/docs/devops/mongodb)

### 通过docker volume

#### 备份
```bash
docker run -it --rm --volumes-from <DOCKER_CONTAINER_NAME> -v ${PWD}:/opt/backup --name export busybox sh

# 进入容器
tar -zcvf /opt/backup/data.tar <DATA_PATH>

exit
```
此处<DATA_PATH>, 如果是minio则为`/data/`如果是mongo则为`/data/db`

#### 恢复
```bash
docker run -it --rm --volumes-from <DOCKER_CONTAINER_NAME> -v ${PWD}:/opt/backup --name importer busybox sh
tar -zxvf /opt/backup/data.tar
exit
```


## Benchmark

### Case 1
<!--
部署环境
```
hash: 4771a830b0787280d53935948c99c340c81de977
env: development
cpu: i7-8700K
memory: 32G
节点数: 1
测试终端: tailchat-cli
测试脚本: bench --time 60 --num 10000 "chat.message.sendMessage" '{"converseId": "61fa58845aff4f8a3e68ccf3", "groupId": "61fa58845aff4f8a3e68ccf4", "content": "123"}'

备注:
- 使用`Redis`作为消息中转中心, `Redis`部署在局域网的nas上
- 使用一个真实账户作为消息推送的接收方
```

```
Benchmark result:

  3,845 requests in 1m, 0 error

  Requests/sec: 64

  Latency:
    Avg:       15ms
    Min:        9ms
    Max:       91ms
```
-->
### Case 2

<!-- TODO -->
