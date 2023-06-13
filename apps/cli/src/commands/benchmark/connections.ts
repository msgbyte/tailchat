import { CommandModule } from 'yargs';
import { io, Socket } from 'socket.io-client';
import msgpackParser from 'socket.io-msgpack-parser';
import fs from 'fs-extra';
import ora from 'ora';
import randomString from 'crypto-random-string';

const CLIENT_CREATION_INTERVAL_IN_MS = 5;

export const benchmarkConnectionsCommand: CommandModule = {
  command: 'connections <url>',
  describe: 'Test Tailchat Connections',
  builder: (yargs) =>
    yargs
      .demandOption('url', 'Backend Url')
      .option('file', {
        describe: 'Account Token Path',
        demandOption: true,
        type: 'string',
        default: './accounts',
      })
      .option('groupId', {
        describe: 'Group Id which send Message',
        type: 'string',
      })
      .option('converseId', {
        describe: 'Converse Id which send Message',
        type: 'string',
      }),
  async handler(args) {
    const url = args.url as string;
    const file = args.file as string;
    const groupId = args.groupId as string;
    const converseId = args.converseId as string;

    console.log('Reading account tokens from', file);
    const account = await fs.readFile(file as string, {
      encoding: 'utf8',
    });
    const sockets = await createClients(
      url as string,
      account.split('\n').map((s) => s.trim())
    );

    if (groupId && converseId) {
      // send message test
      const randomMessage = randomString({ length: 16 });
      const spinner = ora()
        .info(`Start message receive test, message: ${randomMessage}`)
        .start();
      const start = Date.now();
      let receiveCount = 0;
      const len = sockets.length;

      function receivedCallback() {
        receiveCount += 1;
        spinner.text = `Receive: ${receiveCount}/${len}`;

        if (receiveCount === len) {
          spinner.succeed(
            `All client received, usage: ${Date.now() - start}ms`
          );
        }
      }

      sockets.forEach((socket) => {
        socket.on('notify:chat.message.add', (message) => {
          const content = message.content;

          if (message.converseId === converseId && randomMessage === content) {
            receivedCallback();
          }
        });
      });

      sockets[0].emit('chat.message.sendMessage', {
        groupId,
        converseId,
        content: randomMessage,
      });
    }
  },
};

async function createClients(
  url: string,
  accountTokens: string[]
): Promise<Socket[]> {
  const maxCount = accountTokens.length;
  const spinner = ora().info(`Create Client Connection to ${url}`).start();

  let i = 0;
  const sockets: Socket[] = [];
  for (const token of accountTokens) {
    await sleep(CLIENT_CREATION_INTERVAL_IN_MS);
    spinner.text = `Progress: ${++i}/${maxCount}`;
    const socket = await createClient(url, token);
    sockets.push(socket);
  }

  spinner.succeed(`${maxCount} clients has been create.`);

  return sockets;
}

function createClient(url: string, token: string): Promise<Socket> {
  return new Promise<Socket>((resolve, reject) => {
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
  }).then(async (socket) => {
    await socket.emitWithAck('chat.converse.findAndJoinRoom', {});

    return socket;
  });
}

export function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
