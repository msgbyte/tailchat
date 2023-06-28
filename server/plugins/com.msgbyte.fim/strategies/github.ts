import { config } from 'tailchat-server-sdk';
import type { StrategyType } from './types';
import got from 'got';

const clientInfo = {
  id: process.env.FIM_GITHUB_ID,
  secret: process.env.FIM_GITHUB_SECRET,
};

const authorize_uri = 'https://github.com/login/oauth/authorize';
const access_token_uri = 'https://github.com/login/oauth/access_token';
const userinfo_uri = 'https://api.github.com/user';
const redirect_uri = `${config.apiUrl}/api/plugin:com.msgbyte.fim/github/redirect`;

export const GithubStrategy: StrategyType = {
  name: 'github',
  checkAvailable: () => !!clientInfo.id && !!clientInfo.secret,
  getUrl: () => {
    return `${authorize_uri}?client_id=${clientInfo.id}&redirect_uri=${redirect_uri}`;
  },
  getUserInfo: async (code) => {
    console.log('authorization code:', code);

    const tokenResponse = await got(access_token_uri, {
      method: 'POST',
      searchParams: {
        client_id: clientInfo.id,
        client_secret: clientInfo.secret,
        code: code,
      },
      headers: {
        accept: 'application/json',
      },
    }).json<{ access_token: string }>();

    const accessToken = tokenResponse.access_token;
    console.log(`access token: ${accessToken}`);

    const result = await got(userinfo_uri, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `token ${accessToken}`,
      },
    }).json<{ id: number; name: string; email: string; avatar_url: string }>();

    return {
      id: String(result.id),
      nickname: result.name,
      email: result.email,
      avatar: result.avatar_url,
    };
  },
};
