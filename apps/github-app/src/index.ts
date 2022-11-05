import { run } from 'probot';
import { app } from './app';

run(app).then((server) => {
  server.router('/').get('/', (_req, res) => {
    res.send('Hello World! Github app server is working!');
  });
});
