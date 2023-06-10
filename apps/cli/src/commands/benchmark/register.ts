import { CommandModule } from 'yargs';
import fs from 'fs-extra';
import got from 'got';

export const benchmarkRegisterCommand: CommandModule = {
  command: 'register',
  describe: 'Create Tailchat temp account and output token',
  builder: (yargs) =>
    yargs
      .option('url', {
        describe: 'Backend Url',
        demandOption: true,
        type: 'string',
      })
      .option('accountPath', {
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
    for (let i = 0; i < count; i++) {
      const token = await registerTemporaryAccount(
        args.url as string,
        `benchUser-${i}`
      );
      tokens.push(token);
    }

    await fs.writeFile(args.accountPath as string, tokens.join('\n'));
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
    .json<{ token: string }>();

  return res.token;
}
