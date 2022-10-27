import { CommandModule } from 'yargs';
import Docker from 'dockerode';
import asTable from 'as-table';
import filesize from 'filesize';
import ora from 'ora';
import Spinnies from 'spinnies';

// https://docs.docker.com/engine/api/v1.41/

const remoteImageName = 'moonrailgun/tailchat:latest';
const targetImage = {
  repo: 'tailchat',
  tag: 'latest',
};
const targetImageName = targetImage.repo + targetImage.tag;

export const dockerCommand: CommandModule = {
  command: 'docker',
  describe: 'Tailchat 插件类型声明',
  builder: (yargs) =>
    yargs
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
