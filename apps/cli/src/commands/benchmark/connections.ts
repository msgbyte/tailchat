import { CommandModule } from 'yargs';
import { io, Socket } from 'socket.io-client';
import msgpackParser from 'socket.io-msgpack-parser';
import fs from 'fs-extra';

const CLIENT_CREATION_INTERVAL_IN_MS = 5;

export const benchmarkConnectionsCommand: CommandModule = {
  command: 'connections',
  describe: 'Test Tailchat Connections',
  builder: (yargs) =>
    yargs
      .option('url', {
        describe: 'Url',
        demandOption: true,
        type: 'string',
      })
      .option('accountPath', {
        describe: 'Account Token Path',
        demandOption: true,
        type: 'string',
      }),
  async handler(args) {
    const account = await fs.readFile(args.accountPath as string, {
      encoding: 'utf8',
    });
    createClients(
      args.url as string,
      account.split('\n').map((s) => s.trim())
    );
  },
};

async function createClients(url: string, accountTokens: string[]) {
  const maxCount = accountTokens.length;

  for (const token of accountTokens) {
    await sleep(CLIENT_CREATION_INTERVAL_IN_MS);
    await createClient(url, token);
  }

  console.log(`${maxCount} clients has been create.`);
}

function createClient(url: string, token: string): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const socket = io(url, {
      transports: ['websocket'],
      auth: {
        token,
      },
      forceNew: true,
      parser: msgpackParser,
    });
    socket.once('connect', () => {
      // 连接成功
      resolve(socket);
    });
    socket.once('error', () => {
      reject();
    });

    socket.on('disconnect', (reason) => {
      console.log(`disconnect due to ${reason}`);
    });
  });
}

export function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
