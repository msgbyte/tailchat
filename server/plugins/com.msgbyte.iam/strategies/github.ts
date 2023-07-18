import { config } from 'tailchat-server-sdk';
import type { StrategyType } from './types';
import got from 'got';

const clientInfo = {
  id: process.env.IAM_GITHUB_ID,
  secret: process.env.IAM_GITHUB_SECRET,
};

const authorize_uri = 'https://github.com/login/oauth/authorize';
const access_token_uri = 'https://github.com/login/oauth/access_token';
const userinfo_uri = 'https://api.github.com/user';
const redirect_uri = `${config.apiUrl}/api/plugin:com.msgbyte.iam/github/redirect`;

export const GithubStrategy: StrategyType = {
  name: 'github',
  type: 'oauth',
  icon: '/images/avatar/github-dark.svg',
  checkAvailable: () => !!clientInfo.id && !!clientInfo.secret,
  getUrl: () => {
    return `${authorize_uri}?client_id=${clientInfo.id}&redirect_uri=${redirect_uri}`;
  },
  getUserInfo: async (code) => {
    console.log('[github oauth] authorization code:', code);

    const tokenResponse = await got
      .post(access_token_uri, {
        searchParams: {
          client_id: clientInfo.id,
          client_secret: clientInfo.secret,
          code: code,
        },
        headers: {
          accept: 'application/json',
        },
      })
      .json<{ access_token: string }>();

    const accessToken = tokenResponse.access_token;
    console.log(`[github oauth] access token: ${accessToken}`);

    const result = await got
      .get(userinfo_uri, {
        headers: {
          accept: 'application/json',
          Authorization: `token ${accessToken}`,
        },
      })
      .json<{
        id: number;
        login: string;
        name: string;
        email: string;
        avatar_url: string;
      }>();

    console.log(`[github oauth] user info:`, result);

    return {
      id: String(result.id),
      nickname: result.name ?? result.login,
      username: result.login,
      email: result.email,
      avatar: result.avatar_url,
    };
  },
};
