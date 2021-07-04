import { request } from '../api/request';

export interface UserBaseInfo {
  _id: string;
  email: string;
  nickname: string;
  avatar: string | null;
}

export interface UserLoginInfo extends UserBaseInfo {
  token: string;
  createdAt: string;
}

export interface FriendRequest {
  from: string;
  to: string;
  message: string;
}

/**
 * 邮箱登录
 * @param email 邮箱
 * @param password 密码
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<UserLoginInfo> {
  const { data } = await request.post('/api/user/login', {
    email,
    password,
  });

  return data;
}

/**
 * 使用 Token 登录
 * @param token JWT令牌
 */
export async function loginWithToken(token: string): Promise<UserLoginInfo> {
  const { data } = await request.post('/api/user/resolveToken', {
    token,
  });

  return data;
}

/**
 * 邮箱注册账号
 * @param email 邮箱
 * @param password 密码
 */
export async function registerWithEmail(
  email: string,
  password: string
): Promise<UserLoginInfo> {
  const { data } = await request.post('/api/user/register', {
    email,
    password,
  });

  return data;
}
