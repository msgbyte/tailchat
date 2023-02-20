import { CommandModule } from 'yargs';
import ora from 'ora';
import fs from 'fs-extra';
import got from 'got';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import randomString from 'crypto-random-string';
import { withGhProxy } from '../../utils';

// https://docs.docker.com/engine/api/v1.41/

const initWelcome = `================
Initializing Tailchat configuration and environment variables for you
A complete list of environment variables can be accessed at: ${chalk.underline(
  'https://tailchat.msgbyte.com/docs/deployment/environment'
)} to learn more
================`;

const initCompleted = (dir: string) =>
  chalk.green(`================
Congratulations, you have successfully completed the configuration initialization, your configuration file is ready, and you are one step away from a successful deployment!

Your tailchat configuration files are stored in: ${chalk.underline(
    path.join(process.cwd(), dir)
  )}

Run the following command to complete the image download and start:
- ${chalk.bold(`cd ${dir}`)} ${chalk.gray(
    '# Move to the installation directory'
  )}
- ${chalk.bold('tailchat docker update')} ${chalk.gray(
    '# Download/update the official mirror'
  )}
- ${chalk.bold('docker compose up -d')} ${chalk.gray('# Start service')}
================`);

const envUrl = withGhProxy(
  'https://raw.githubusercontent.com/msgbyte/tailchat/master/docker-compose.env'
);
const configUrl = withGhProxy(
  'https://raw.githubusercontent.com/msgbyte/tailchat/master/docker-compose.yml'
);

export const dockerInitCommand: CommandModule = {
  command: 'init',
  describe: 'Initialize Tailchat with docker configuration',
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
          message: 'Configurate storage directory',
        },
        {
          name: 'secret',
          type: 'input',
          default: randomString({ length: 16 }),
          message:
            '(SECRET)Please enter any string, which will be used as the secret key for Tailchat to sign the user identity. Leaking this string will cause the risk of identity forgery. By default, a 16-digit string is randomly generated',
        },
        {
          name: 'apiUrl',
          type: 'input',
          message:
            '(API_URL)Please configure an address that can be accessed by the external network, which will affect the storage path and access address of the file, example: https://tailchat.example.com',
        },
        {
          name: 'fileLimit',
          type: 'number',
          default: 1048576,
          message:
            '(FILE_LIMIT)File upload volume limit, the default is 1048576(1m)',
        },
      ]);

      spinner.start('Start downloading the latest configuration file');
      // eslint-disable-next-line prefer-const
      let [rawEnv, rawConfig] = await Promise.all([
        got(envUrl).then((res) => res.body),
        got(configUrl).then((res) => res.body),
      ]);
      spinner.info('The configuration file is downloaded');

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
          'Do you need to configure the email service? The email service can be used for functions such as password retrieval and email notification.'
        )
      ) {
        const { stmpURI, stmpSender } = await inquirer.prompt([
          {
            name: 'stmpURI',
            type: 'input',
            message:
              '(SMTP_URI) Please configure the SMTP connection address of the mail service, for example: smtps://username:password@example.mailserver.com/?pool=true',
          },
          {
            name: 'stmpSender',
            type: 'input',
            message:
              '(SMTP_SENDER) Email sender, example: "Tailchat" tailchat@example.mailserver.com',
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
              'Do you need to enable email verification? After it is enabled, when the user registers, it is necessary to verify the email address and pass it before continuing to register'
            )
          ) {
            rawEnv = setEnvValue(rawEnv, 'EMAIL_VERIFY', 'true');
          }
        }
      }

      spinner.info(`Creating directory ${dir} ...`);
      await fs.mkdirp(dir);

      spinner.info('Writing configuration file ...');

      await Promise.all([
        fs.writeFile(path.join(dir, 'docker-compose.env'), rawEnv),
        fs.writeFile(path.join(dir, 'docker-compose.yml'), rawConfig),
      ]);
      spinner.succeed('The configuration is initialized');

      console.log(initCompleted(dir));
    } catch (err) {
      spinner.fail('Unexpected initialization of Tailchat with docker');
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
