import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import { OAuthClient } from 'tailchat-server-sdk';
const app = express();
const port = 8080;

const API = process.env.API || 'http://localhost:11001';
const clientUrl = `http://localhost:${port}`;
const clientId = process.env.ID;
const clientSecret = process.env.SECRET;

if (!clientId || !clientSecret) {
  throw new Error('环境变量缺失, 请设置环境变量 ID 和 SECRET');
}

console.log('config:', {
  API,
  clientUrl,
  clientId,
});

const tailchatClient = new OAuthClient(API, clientId, clientSecret);

app.get('/', async (req, res) => {
  let html = (
    await fs.readFile(path.resolve(__dirname, './app.html'))
  ).toString();
  html = html
    .replace('<API>', API)
    .replace('<clientId>', clientId)
    .replace('<clientUrl>', clientUrl);

  res.send(html);
});

app.get('/cb', async (req, res, next) => {
  try {
    const { code, state } = req.query;

    console.log('code', code);

    // 根据获取到的code获取授权码
    const { access_token } = await tailchatClient.getToken(
      String(code),
      `${clientUrl}/cb`
    );

    console.log('access_token', access_token);

    const { data: userInfo } = await tailchatClient.getUserInfo(access_token);

    res.json({ userInfo });
  } catch (err: any) {
    console.error(err.response.data);
    next(err);
  }
});

app.listen(port, () => {
  console.log(`请确保回调已经被注册在OIDC服务端的白名单中: ${clientUrl}/cb`);
  console.log(`测试服务地址: http://127.0.0.1:${port}`);
});
