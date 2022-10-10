import AdminJS from 'adminjs';
import { buildAuthenticatedRouter } from '@adminjs/koa';
import AdminJSMongoose from '@adminjs/mongoose';
import Koa from 'koa';
import { mongoose } from '@typegoose/typegoose';
import dotenv from 'dotenv';
import path from 'path';
import { getResources } from './resources';
import serve from 'koa-static';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoUri = process.env.MONGO_URL;
const adminPass = process.env.ADMIN_PASS;

AdminJS.registerAdapter(AdminJSMongoose);

async function run() {
  if (!mongoUri) {
    console.warn(`MONGO_URL has not been set.`);
    return;
  }

  if (!adminPass) {
    console.warn(`ADMIN_PASS has not been set.`);
    return;
  }

  const app = new Koa();
  app.keys = ['tailchat-admin-secret'];
  const mongooseDb = await mongoose.connect(mongoUri);

  const adminJs = new AdminJS({
    branding: {
      companyName: 'tailchat',
      logo: '/images/logo.svg',
      favicon: '/images/logo.svg',
      softwareBrothers: false,
    },
    databases: [mongooseDb],
    rootPath: '/admin',
    resources: getResources(),
    // dashboard: {
    //   component: AdminJS.bundle('./dashboard'),
    // },
  });

  const router = buildAuthenticatedRouter(adminJs, app, {
    authenticate: async (email, password) => {
      if (email === 'tailchat@msgbyte.com' && password === adminPass) {
        return { email, title: 'Admin' };
      }

      return null;
    },
  });

  app.use(router.routes()).use(router.allowedMethods());
  app.use(serve(path.resolve(__dirname, '../static')));

  app.listen(14100, () => {
    console.log('AdminJS is under http://localhost:14100/admin');
    console.log(`please login with: tailchat@msgbyte.com/${adminPass}`);
  });
}

run();
