import { CommandModule } from 'yargs';
import fs from 'fs-extra';
import got from 'got';
import ora from 'ora';
import pMap from 'p-map';

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
      })
      .option('concurrency', {
        describe: 'Concurrency when send request',
        type: 'number',
        default: 1,
      })
      .option('invite', {
        describe: 'Invite Code',
        type: 'string',
      })
      .option('append', {
        describe: 'Append mode',
        type: 'boolean',
      }),
  async handler(args) {
    const url = args.url as string;
    const file = args.file as string;
    const count = args.count as number;
    const concurrency = args.concurrency as number;
    const invite = args.invite as string | undefined;
    const append = (args.append ?? false) as boolean;
    const tokens: string[] = [];
    const start = Date.now();

    const spinner = ora().info(`Register temporary account`).start();

    let i = 0;
    spinner.text = `Progress: ${i}/${count}`;
    await pMap(
      Array.from({ length: count }),
      async () => {
        const token = await registerTemporaryAccount(url, `benchUser-${i}`);
        if (invite) {
          // Apply group invite
          await applyGroupInviteCode(url, token, invite);
        }
        if (append) {
          await fs.appendFile(file, `\n${token}`);
        }

        spinner.text = `Progress: ${++i}/${count}`;
        tokens.push(token);
      },
      {
        concurrency,
      }
    );

    if (!append) {
      spinner.info(`Writing tokens into path: ${file}`);

      await fs.writeFile(file, tokens.join('\n'));
    }

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
      retry: 5,
    })
    .json<{ data: { token: string } }>();

  return res.data.token;
}

async function applyGroupInviteCode(
  url: string,
  token: string,
  inviteCode: string
) {
  await got.post(`${url}/api/group/invite/applyInvite`, {
    json: {
      code: inviteCode,
    },
    retry: 5,
    headers: {
      'X-Token': token,
    },
  });
}
