import { Issuer } from 'openid-client';
import express from 'express';
import axios from 'axios';

const app = express();
const port = 8080;

const API = process.env.API || 'http://localhost:11001';
const clientUrl = `http://localhost:${port}`;
const clientId = process.env.ID || 'tc_649aa2179e97b8b3b2d1004f';
const clientSecret = process.env.SECRET || '4Pt4lccOaztJROs-VhmQf8XBU89-z8rr';

console.log('config:', {
  API,
  clientUrl,
  clientId,
});

const request = axios.create({
  baseURL: API,
  transformRequest: [
    function (data) {
      let ret = '';
      for (const it in data) {
        ret +=
          encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
      }
      ret = ret.substring(0, ret.lastIndexOf('&'));
      return ret;
    },
  ],
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
  },
});

(async () => {
  const tailchatIssuer = await Issuer.discover(
    'https://tailchat-nightly.moonrailgun.com/open/'
  );
  console.log(
    'Discovered issuer',
    tailchatIssuer.issuer,
    tailchatIssuer.metadata
  );

  const client = new tailchatIssuer.Client({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: [`${clientUrl}/cb`],
    response_types: ['code'],
    // id_token_signed_response_alg (default "RS256")
    // token_endpoint_auth_method (default "client_secret_basic")
  });

  app.get('/', (req, res) => {
    const url = client.authorizationUrl({
      scope: 'openid profile',
      // response_mode: 'form_post',
      nonce: Math.random().toString(),
    });
    res.send(`<a href="${url}">登录</a>`);
  });

  app.get('/cb', async (req, res, next) => {
    try {
      const { code } = req.query;

      // 根据获取到的code获取授权码
      const { data: tokenInfo } = await request.post('/open/token', {
        // client_id: 'foo',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${clientUrl}/cb`,
        code,
        grant_type: 'authorization_code',
      });

      console.log('tokenInfo', tokenInfo);

      const { access_token, expires_in, id_token, scope, token_type } =
        tokenInfo;

      console.log('access_token', access_token);

      const { data: userInfo } = await request.post('/open/me', {
        access_token,
      });

      res.json({ userInfo });
    } catch (err) {
      console.error(err.response.data);
      next(err);
    }
  });

  app.listen(port, () => {
    console.log(`请确保回调已经被注册在OIDC服务端的白名单中: ${clientUrl}/cb`);
    console.log(`测试服务地址: http://127.0.0.1:${port}`);
  });
})();
