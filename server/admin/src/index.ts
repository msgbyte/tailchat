import { buildRouter, Tushan } from 'tushan';
import { User } from './resources/User';
import Koa from 'koa';
import path from 'path';
import session from 'koa-session';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoUri = process.env.MONGO_URL;
const adminPass = process.env.ADMIN_PASS;

async function start() {
  if (!mongoUri) {
    console.warn(`MONGO_URL has not been set.`);
    return;
  }

  if (!adminPass) {
    console.warn(`ADMIN_PASS has not been set.`);
    return;
  }

  const app = new Koa();

  app.keys = ['tushan'];
  app.use(session({ key: 'sess:tushan' }, app));

  const tushan = new Tushan({
    datasourceOptions: {
      type: 'mongodb',
      url: mongoUri,
    } as any,
    resources: [
      {
        entity: User,
        options: {
          label: '用户',
        },
      },
    ],
    pages: [],
  });

  await tushan.initialize();

  const router = await buildRouter({
    tushan,
    auth: {
      local: async (username, password) => {
        if (username === 'tailchat' && password === adminPass) {
          return { username, title: 'Admin' };
        }

        throw new Error(`User not found: ${username}`);
      },
    },
  });
  app.use(router.routes()).use(router.allowedMethods());

  app.listen(6789, () => {
    console.log('服务器已启动:', `http://localhost:6789/admin/`);
  });
}

start();
