import { CommandModule } from 'yargs';
import ora from 'ora';
import fs from 'fs-extra';
import got from 'got';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

// https://docs.docker.com/engine/api/v1.41/

const initWelcome = chalk.green(`================
恭喜你已经成功安装了, 你的配置文件已经准备就绪，距离成功就差一步了!

你的tailchat配置文件都被存储在: ${chalk.underline(
  path.join(process.cwd(), './tailchat')
)}

运行以下命令以完成镜像下载与启动:
- ${chalk.bold('cd tailchat')} ${chalk.gray('# 移动到安装目录')}
- ${chalk.bold('tailchat docker update')} ${chalk.gray('# 下载/更新官方镜像')}
- ${chalk.bold('docker compose up')} ${chalk.gray('# 启动服务')}
================`);

const envUrl =
  'https://ghproxy.com/https://raw.githubusercontent.com/msgbyte/tailchat/master/docker-compose.env';
const configUrl =
  'https://ghproxy.com/https://raw.githubusercontent.com/msgbyte/tailchat/master/docker-compose.yml';

export const dockerInitCommand: CommandModule = {
  command: 'init',
  describe: '初始化Tailchat with docker配置',
  builder: undefined,
  async handler(args) {
    const spinner = ora();
    try {
      spinner.start('开始下载最新的配置文件');
      const [rawEnv, rawConfig] = await Promise.all([
        got(envUrl).then((res) => res.body),
        got(configUrl).then((res) => res.body),
      ]);
      spinner.info('配置文件下载完毕');

      // TODO: 需要实现交互式初始化，引导用户配置SECRET，API_URL, SMTP 服务

      spinner.info('正在创建目录 tailchat ...');
      await fs.mkdir('./tailchat');

      spinner.info('正在写入配置文件 ...');

      await Promise.all([
        fs.writeFile('./tailchat/docker-compose.env', rawEnv),
        fs.writeFile('./tailchat/docker-compose.yml', rawConfig),
      ]);

      spinner.succeed('配置初始化完毕');
      console.log(initWelcome);
    } catch (err) {
      spinner.fail('Tailchat with docker 初始化出现意外');
      console.error(err);
    }
  },
};
