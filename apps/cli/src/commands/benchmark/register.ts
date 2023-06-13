import { CommandModule } from 'yargs';
import fs from 'fs-extra';
import got from 'got';
import ora from 'ora';

export const benchmarkRegisterCommand: CommandModule = {
  command: 'register <url>',
  describe: 'Create Tailchat temporary account and output token',
  builder: (yargs) =>
    yargs
      .example(
        '$0 benchmark register http://127.0.0.1:11000',
        'Register account in local server'
      )
      .demandOption('url', 'Backend Url')
      .option('file', {
        describe: 'Account Token Path',
        demandOption: true,
        type: 'string',
        default: './accounts',
      })
      .option('count', {
        describe: 'Register Count',
        demandOption: true,
        type: 'number',
        default: 100,
      }),
  async handler(args) {
    const count = args.count as number;
    const tokens: string[] = [];
    const start = Date.now();

    const spinner = ora().info(`Register temporary account`).start();

    for (let i = 0; i < count; i++) {
      spinner.text = `Progress: ${i + 1}/${count}`;

      const token = await registerTemporaryAccount(
        args.url as string,
        `benchUser-${i}`
      );
      tokens.push(token);
    }

    spinner.info(`Writing tokens into path: ${args.file}`);

    await fs.writeFile(args.file as string, tokens.join('\n'));

    spinner.succeed(`Register completed! Usage: ${Date.now() - start}ms`);
  },
};

async function registerTemporaryAccount(
  url: string,
  nickname: string
): Promise<string> {
  const res = await got
    .post(`${url}/api/user/createTemporaryUser`, {
      json: {
        nickname,
      },
    })
    .json<{ data: { token: string } }>();

  return res.data.token;
}
