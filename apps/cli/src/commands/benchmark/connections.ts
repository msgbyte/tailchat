import { CommandModule } from 'yargs';
import { io, Socket } from 'socket.io-client';
import msgpackParser from 'socket.io-msgpack-parser';
import fs from 'fs-extra';
import ora from 'ora';
import randomString from 'crypto-random-string';
import pMap from 'p-map';

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
      .option('concurrency', {
        describe: 'Concurrency when create connection',
        type: 'number',
        default: 1,
      })
      .option('groupId', {
        describe: 'Group Id which send Message',
        type: 'string',
      })
      .option('converseId', {
        describe: 'Converse Id which send Message',
        type: 'string',
      })
      .option('messageNum', {
        describe: 'Times which send Message',
        type: 'number',
        default: 1,
      }),
  async handler(args) {
    const url = args.url as string;
    const file = args.file as string;
    const groupId = args.groupId as string;
    const converseId = args.converseId as string;
    const messageNum = args.messageNum as number;
    const concurrency = args.concurrency as number;

    console.log('Reading account tokens from', file);
    const account = await fs.readFile(file as string, {
      encoding: 'utf8',
    });
    const sockets = await createClients(
      url as string,
      account.split('\n').map((s) => s.trim()),
      concurrency
    );

    if (groupId && converseId) {
      // send message test
      for (let i = 0; i < messageNum; i++) {
        console.log('Start send message test:', i + 1);
        await sendMessage(sockets, groupId, converseId);
      }
    }
  },
};

async function createClients(
  url: string,
  accountTokens: string[],
  concurrency: number
): Promise<Socket[]> {
  const maxCount = accountTokens.length;
  const spinner = ora().info(`Create Client Connection to ${url}`).start();

  let i = 0;
  const sockets: Socket[] = [];
  await pMap(
    accountTokens,
    async (token) => {
      await sleep(CLIENT_CREATION_INTERVAL_IN_MS);
      const socket = await createClient(url, token);
      spinner.text = `Progress: ${++i}/${maxCount}`;
      sockets.push(socket);
    },
    {
      concurrency,
    }
  );

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

async function sendMessage(
  sockets: Socket[],
  groupId: string,
  converseId: string
) {
  return new Promise<void>((resolve) => {
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
        spinner.succeed(`All client received, usage: ${Date.now() - start}ms`);
        resolve();
      }
    }

    sockets.forEach((socket) => {
      socket.on('notify:chat.message.add', (message) => {
        const content = message.content;

        if (message.converseId === converseId && randomMessage === content) {
          socket.off('notify:chat.message.add');

          receivedCallback();
        }
      });
    });

    sockets[0].emit('chat.message.sendMessage', {
      groupId,
      converseId,
      content: randomMessage,
    });
  });
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
