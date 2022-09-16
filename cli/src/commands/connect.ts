import { CommandModule } from 'yargs';
import { TcBroker } from 'tailchat-server-sdk';
import defaultBrokerConfig from 'tailchat-server-sdk/dist/runner/moleculer.config';
import { config } from 'dotenv';

export const connectCommand: CommandModule = {
  command: 'connect',
  describe: '连接到 Tailchat 节点网络',
  builder: undefined,
  async handler(args) {
    config();

    const broker = new TcBroker({
      ...defaultBrokerConfig,
      transporter: process.env.TRANSPORTER,
    });
    await broker.start();
    broker.repl();
  },
};
