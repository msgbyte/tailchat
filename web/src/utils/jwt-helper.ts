import _isObject from 'lodash/isObject';
import _isNull from 'lodash/isNull';
import jwtDecode from 'jwt-decode';
import { getStorage, refreshTokenGetter } from 'tailchat-shared';

/**
 * 获取完整jwt字符串的载荷信息(尝试解析json)
 * @param jwt 完整的jwt字符串
 */
export function getJWTPayload<T>(jwt: string): Partial<T> {
  try {
    const decoded = jwtDecode<T>(jwt);
    return decoded;
  } catch (e) {
    console.error(`getJWTInfo Error: [jwt: ${jwt}]`, e);
  }

  return {};
}

// JWT的内存缓存
let _userJWT: string | null = null;

/**
 * 设置用户登录标识
 */
export async function setUserJWT(jwt: string | null): Promise<void> {
  _userJWT = jwt; // 更新内存中的缓存

  await getStorage().save('jsonwebtoken', jwt);
  refreshTokenGetter();
}

/**
 * 获取用户登录标识
 */
export async function getUserJWT(): Promise<string> {
  if (_isNull(_userJWT)) {
    const jwt = await getStorage().get('jsonwebtoken');

    _userJWT = jwt; // 将其缓存到内存中

    return jwt;
  }
  return _userJWT;
}

export interface JWTUserInfoData {
  nickname?: string;
  uuid?: string;
  avatar?: string;
}
/**
 * 获取token中的明文信息
 * 明确需要返回一个对象
 */
export async function getJWTUserInfo(): Promise<JWTUserInfoData> {
  try {
    const token = await getUserJWT();
    const info = getJWTPayload(token);
    if (_isObject(info)) {
      return info;
    }
  } catch (e) {
    console.error('getJWTInfo Error:', e);
  }

  return {};
}
