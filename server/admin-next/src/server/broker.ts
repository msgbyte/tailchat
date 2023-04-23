import { TcBroker, SYSTEM_USERID } from 'tailchat-server-sdk';
import brokerConfig from '../../../moleculer.config';

const transporter = process.env.TRANSPORTER;
export const broker = new TcBroker({
  ...brokerConfig,
  metrics: false,
  logger: false,
  transporter,
});

broker.start().then(() => {
  console.log('Linked to Tailchat network, TRANSPORTER: ', transporter);
});

export function callBrokerAction<T>(
  actionName: string,
  params: any,
  opts?: Record<string, any>
): Promise<T> {
  return broker.call(actionName, params, {
    ...opts,
    meta: {
      ...opts?.meta,
      userId: SYSTEM_USERID,
    },
  });
}
