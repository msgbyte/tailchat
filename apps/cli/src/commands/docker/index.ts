import { CommandModule } from 'yargs';
import Docker from 'dockerode';
import asTable from 'as-table';
import filesize from 'filesize';
import ora from 'ora';
import Spinnies from 'spinnies';
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

const remoteImageName = 'moonrailgun/tailchat:latest';
const targetImage = {
  repo: 'tailchat',
  tag: 'latest',
};
const targetImageName = targetImage.repo + targetImage.tag;

export const dockerCommand: CommandModule = {
  command: 'docker',
  describe: 'Tailchat 镜像管理',
  builder: (yargs) =>
    yargs
      .command(
        'init',
        '初始化Tailchat with docker配置',
        (yargs) => {},
        async (args) => {
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
        }
      )
      .command(
        'doctor',
        'docker环境检查',
        (yargs) => {},
        async (args) => {
          const docker = new Docker();

          const images = await docker.listImages();
          const tailchatImages = images.filter((image) =>
            (image.RepoTags ?? []).some((tag) => tag.includes('tailchat'))
          );

          console.log('Tailchat 镜像列表');
          console.log(
            asTable.configure({ delimiter: ' | ' })(
              tailchatImages.map((image) => ({
                tag: (image.RepoTags ?? []).join(','),
                id: image.Id.substring(0, 12),
                size: filesize(image.Size),
              }))
            )
          );

          const info = await docker.info();
          console.log('info', info);
        }
      )
      .command(
        'update',
        '更新Tailchat镜像版本',
        (yargs) => {},
        async (args) => {
          const docker = new Docker();

          const spinner = ora().start('开始更新镜像');

          try {
            const pullSpinnies = new Spinnies();

            await new Promise<void>((resolve, reject) => {
              const taskMap = new Map<string, Spinnies.SpinnerOptions>();

              // 这里有个类型问题，不会返回任何值
              docker.pull(remoteImageName, {}, (err, stream) => {
                if (err) {
                  reject(err);
                  return;
                }

                spinner.info('已找到远程镜像, 开始下载');

                docker.modem.followProgress(
                  stream,
                  (err, output) => {
                    // onFinish
                    // console.log('finish', err, output);

                    if (err) {
                      pullSpinnies.stopAll('stopped');
                      reject(err);
                    } else {
                      pullSpinnies.stopAll('succeed');

                      spinner.succeed(output[1]?.status);
                      spinner.succeed(output[2]?.status);
                      resolve();
                    }
                  },
                  (event) => {
                    if (!event.id) {
                      console.log(event.status); // 可能是完成后的信息打印，直接输出
                      return;
                    }
                    const text = `[${event.id}] ${event.status}${
                      event.progress ? ':' : ''
                    } ${event.progress ?? ''}`;

                    // onProcess
                    if (taskMap.has(event.id)) {
                      pullSpinnies.update(event.id, {
                        text,
                      });

                      if (event.status === 'Pull complete') {
                        pullSpinnies.succeed(event.id);
                      }
                    } else {
                      taskMap.set(
                        event.id,
                        pullSpinnies.add(event.id, {
                          text,
                        })
                      );
                    }
                  }
                );
              });
            });

            spinner.succeed('下载镜像完毕');

            const image = docker.getImage(remoteImageName);

            if (!image) {
              spinner.fail('出现异常，没有找到下载的镜像');
              return;
            }

            spinner.info('正在更新镜像标签');

            await image.tag(targetImage);

            spinner.succeed('镜像标签更新完毕');
          } catch (err) {
            spinner.fail('更新出现错误, 请检查网络配置');
            console.error(err);
          }
        }
      )
      .demandCommand(),
  handler(args) {},
};
