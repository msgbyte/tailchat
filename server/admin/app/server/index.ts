import path from 'path';
import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import { createRequestHandler } from '@remix-run/express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { apiRouter } from './router/api';

// 链接数据库
mongoose.connect(process.env.MONGO_URL!, (error: any) => {
  if (!error) {
    return console.info('Datebase connected');
  }
  console.error('Datebase connect error', error);
});

const BUILD_DIR = path.join(process.cwd(), 'build');

const app = express();

app.use(compression());
app.use(bodyParser());

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

app.all(
  '/admin/*',
  process.env.NODE_ENV === 'development'
    ? (req, res, next) => {
        purgeRequireCache();

        return createRequestHandler({
          build: require(BUILD_DIR),
          mode: process.env.NODE_ENV,
        })(req, res, next);
      }
    : createRequestHandler({
        build: require(BUILD_DIR),
        mode: process.env.NODE_ENV,
      })
);

const port = process.env.ADMIN_PORT || 3000;

app.listen(port, () => {
  console.log(
    `Express server listening on port ${port}, visit with: http://localhost:${port}/admin/`
  );
});

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
