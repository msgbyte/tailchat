import express from 'express';
import ViteExpress from 'vite-express';
import mongoose from 'mongoose';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
import { apiRouter } from './router/api';

const app = express();

const port = Number(process.env.ADMIN_PORT || 13000);

if (!process.env.MONGO_URL) {
  console.error('Require env: MONGO_URL');
  process.exit(1);
}

// 链接数据库
mongoose.connect(process.env.MONGO_URL, (error: any) => {
  if (!error) {
    return console.info('Datebase connected');
  }
  console.error('Datebase connect error', error);
});

app.use(compression());
app.use(express.json());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// Remix fingerprints its assets so we can cache forever.
app.use(
  '/build',
  express.static('public/build', { immutable: true, maxAge: '1y' })
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', { maxAge: '1h' }));

app.use(morgan('tiny'));

app.use('/admin/api', apiRouter);

app.use((err: any, req: any, res: any, next: any) => {
  res.status(500);
  res.json({ error: err.message });
});

if (process.env.NODE_ENV === 'production') {
  ViteExpress.config({
    mode: 'production',
  });
}

ViteExpress.listen(app, port, () =>
  console.log(
    `Server is listening on port ${port}, visit with: http://localhost:${port}/admin/`
  )
);
