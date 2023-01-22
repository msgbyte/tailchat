import { CommandModule } from 'yargs';
import ora from 'ora';
import fs from 'fs-extra';
import got from 'got';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import randomString from 'crypto-random-string';

// https://docs.docker.com/engine/api/v1.41/

const initWelcome = `================
正在为您初始化 Tailchat 配置与环境变量
完整的环境变量列表可以访问: ${chalk.underline(
  'https://tailchat.msgbyte.com/docs/deployment/environment'
)} 以了解更多
================`;

const initCompleted = (dir: string) =>
  chalk.green(`================
恭喜你已经成功完成了配置初始化, 你的配置文件已经准备就绪，距离成功成功部署就差一步了!

你的tailchat配置文件都被存储在: ${chalk.underline(
    path.join(process.cwd(), dir)
  )}

运行以下命令以完成镜像下载与启动:
- ${chalk.bold(`cd ${dir}`)} ${chalk.gray('# 移动到安装目录')}
- ${chalk.bold('tailchat docker update')} ${chalk.gray('# 下载/更新官方镜像')}
- ${chalk.bold('docker compose up')} ${chalk.gray('# 启动服务')}
================`);

const envUrl = withGhProxy(
  'https://raw.githubusercontent.com/msgbyte/tailchat/master/docker-compose.env'
);
const configUrl = withGhProxy(
  'https://raw.githubusercontent.com/msgbyte/tailchat/master/docker-compose.yml'
);

export const dockerInitCommand: CommandModule = {
  command: 'init',
  describe: '初始化Tailchat with docker配置',
  builder: undefined,
  async handler(args) {
    const spinner = ora();
    try {
      console.log(initWelcome);
      const { dir, secret, apiUrl, fileLimit } = await inquirer.prompt([
        {
          name: 'dir',
          type: 'input',
          default: './tailchat',
          message: '配置存放目录',
        },
        {
          name: 'secret',
          type: 'input',
          default: randomString({ length: 16 }),
          message:
            '(SECRET)请输入任意字符串，这将会作为Tailchat进行用户身份签名的秘钥，泄露该字符串则会产生身份伪造的风险, 默认随机生成一个16位字符串',
        },
        {
          name: 'apiUrl',
          type: 'input',
          message:
            '(API_URL)请配置外网能够访问的地址，这个会影响文件的存储路径与访问地址, 示例: https://tailchat.example.com',
        },
        {
          name: 'fileLimit',
          type: 'number',
          default: 1048576,
          message: '(FILE_LIMIT)文件上传体积限制, 默认为 1048576(1m)',
        },
      ]);

      spinner.start('开始下载最新的配置文件');
      // eslint-disable-next-line prefer-const
      let [rawEnv, rawConfig] = await Promise.all([
        got(envUrl).then((res) => res.body),
        got(configUrl).then((res) => res.body),
      ]);
      spinner.info('配置文件下载完毕');

      if (secret) {
        rawEnv = setEnvValue(rawEnv, 'SECRET', secret);
      }

      if (apiUrl) {
        rawEnv = setEnvValue(rawEnv, 'API_URL', apiUrl);
      }

      if (fileLimit) {
        rawEnv = setEnvValue(rawEnv, 'FILE_LIMIT', fileLimit);
      }

      if (
        await promptConfirm(
          '需要配置邮件服务么?邮件服务可以用于密码找回以及邮件通知等功能。'
        )
      ) {
        const { stmpURI, stmpSender } = await inquirer.prompt([
          {
            name: 'stmpURI',
            type: 'input',
            message:
              '(SMTP_URI)请配置邮件服务SMTP的连接地址，示例: smtps://username:password@example.mailserver.com/?pool=true',
          },
          {
            name: 'stmpSender',
            type: 'input',
            message:
              '(SMTP_SENDER)邮件发送人，示例: "Tailchat" tailchat@example.mailserver.com',
          },
        ]);

        if (stmpURI) {
          rawEnv = setEnvValue(rawEnv, 'SMTP_URI', stmpURI);
        }
        if (stmpSender) {
          rawEnv = setEnvValue(rawEnv, 'SMTP_SENDER', stmpSender);
        }

        if (stmpURI && stmpSender) {
          if (
            await promptConfirm(
              '是否需要开启邮箱校验? 开启后当用户注册时需要校验邮箱通过以后才能继续注册'
            )
          ) {
            rawEnv = setEnvValue(rawEnv, 'EMAIL_VERIFY', 'true');
          }
        }
      }

      spinner.info(`正在创建目录 ${dir} ...`);
      await fs.mkdirp(dir);

      spinner.info('正在写入配置文件 ...');

      await Promise.all([
        fs.writeFile(path.join(dir, 'docker-compose.env'), rawEnv),
        fs.writeFile(path.join(dir, 'docker-compose.yml'), rawConfig),
      ]);
      spinner.succeed('配置初始化完毕');

      console.log(initCompleted(dir));
    } catch (err) {
      spinner.fail('Tailchat with docker 初始化出现意外');
      console.error(err);
    }
  },
};

/**
 * 设置环境变量值
 */
function setEnvValue(text: string, key: string, value: string): string {
  const re = new RegExp(`${key}=(.*?)\n`);
  if (re.test(text)) {
    // 配置文件已经有了
    return text.replace(re, `${key}=${value}\n`);
  }

  // 配置文件还没有
  return text + `\n${key}=${value}\n`;
}

/**
 * 设置更多配置的确认项
 */
async function promptConfirm(message: string): Promise<boolean> {
  const { res } = await inquirer.prompt([
    {
      name: 'res',
      type: 'confirm',
      message,
      default: false,
    },
  ]);

  return res;
}

/**
 * 增加github资源代理以优化国内访问速度
 */
function withGhProxy(url: string): string {
  return `https://ghproxy.com/${url}`;
}
