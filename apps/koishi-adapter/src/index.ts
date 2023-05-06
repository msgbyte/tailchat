import { Context, Schema } from 'koishi';

export const name = 'tailchat';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Config {}

export const Config: Schema<Config> = Schema.object({});

export function apply(ctx: Context) {
  // write your plugin here
  ctx.on('message', (session) => {
    if (session.content === '天王盖地虎') {
      session.send('宝塔镇河妖');
    }
  });
}
