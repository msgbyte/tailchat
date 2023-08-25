import express from 'express';
import path from 'path';
import ejs from 'ejs';

const app = express();
const port = process.env.PORT || 8080;

const publicDir = path.resolve(__dirname, '../../../public');
const viewRootDir = path.resolve(
  __dirname,
  '../../../services/openapi/oidc/views'
);

app.use(express.static(publicDir));

app.get('/', (req, res) => {
  res.send(
    `<ul>${['/login', '/authorize', '/error']
      .map((p) => `<li><a href=${p}>${p}</a></li>`)
      .join('\n')}</ul>`
  );
});

app.get('/login', async (req, res) => {
  const data = {
    uid: 'fooooooooo',
  };
  const html = await ejs.renderFile(
    path.resolve(viewRootDir, './login.ejs'),
    data
  );

  res.send(html);
});

app.get('/error', async (req, res) => {
  const data = {
    text: 'fooooooooo',
  };
  const html = await ejs.renderFile(
    path.resolve(viewRootDir, './error.ejs'),
    data
  );

  res.send(html);
});

app.get('/authorize', async (req, res) => {
  const data = {
    logoUri: 'loginUrl',
    clientName: 'Test',
    uid: 'foooo',
    details: {},
    params: {},
    session: '',
  };
  const html = await ejs.renderFile(
    path.resolve(viewRootDir, './authorize.ejs'),
    data
  );

  res.send(html);
});

app.listen(port, () => {
  console.log(`Server: http://127.0.0.1:${port}`);
});
