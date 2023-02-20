import { CommandModule } from 'yargs';
import ora from 'ora';
import Docker from 'dockerode';
import Spinnies from 'spinnies';

const remoteImageName = 'moonrailgun/tailchat:latest';
const targetImage = {
  repo: 'tailchat',
  tag: 'latest',
};
const targetImageName = targetImage.repo + targetImage.tag;

export const dockerUpdateCommand: CommandModule = {
  command: 'update',
  describe: 'Update Tailchat image version',
  builder: undefined,
  async handler(args) {
    const docker = new Docker();

    const spinner = ora().start('Start updating the image');

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

          spinner.info('The remote image has been found, start downloading');

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

      spinner.succeed('Download image complete');

      const image = docker.getImage(remoteImageName);

      if (!image) {
        spinner.fail(
          'An exception occurred, the downloaded image was not found'
        );
        return;
      }

      spinner.info('Updating image tags');

      await image.tag(targetImage);

      spinner.succeed('The image tag has been updated');
    } catch (err) {
      spinner.fail(
        'An update error occurred, please check the network configuration'
      );
      console.error(err);
    }
  },
};
