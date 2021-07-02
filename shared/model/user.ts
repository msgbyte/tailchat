import { request } from '../api/request';

/**
 * 邮箱登录
 * @param email 邮箱
 * @param password 密码
 */
export async function loginWithEmail(email: string, password: string) {
  const data = await request.post('/api/user/login', {
    email,
    password,
  });

  return data;
}
