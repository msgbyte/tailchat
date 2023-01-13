import { TcBroker } from 'tailchat-server-sdk';
import brokerConfig from '../../../moleculer.config';

const transporter = process.env.TRANSPORTER;
export const broker = new TcBroker({
  ...brokerConfig,
  metrics: false,
  logger: false,
  transporter,
});

broker.start().then(() => {
  console.log('已链接上Tailchat网络, TRANSPORTER: ', transporter);
});
