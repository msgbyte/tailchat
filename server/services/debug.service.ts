import { TcService, TcPureContext } from 'tailchat-server-sdk';
import { sleep } from '../lib/utils';

export default class TestService extends TcService {
  get serviceName(): string {
    return 'debug';
  }

  onInit(): void {
    this.registerAction('hello', this.echo, {
      params: {
        name: [{ type: 'string', optional: true }],
      },
    });
    this.registerAction('sleep', this.sleep, {
      params: {
        second: 'number',
      },
    });
  }

  // Action
  echo(ctx: TcPureContext<{ name: string }>): string {
    console.log(ctx.meta);
    return `Hello ${
      ctx.params.name ?? ctx.meta.t('匿名用户')
    }, \nHere is your meta info: ${JSON.stringify(ctx.meta, null, 2)}`;
  }

  // Action
  async sleep(ctx: TcPureContext<{ second: number }>) {
    await sleep(ctx.params.second * 1000);

    return true;
  }
}
