import { UserLoginInfo, model } from 'tailchat-shared';
import _isNil from 'lodash/isNil';
import { getUserJWT } from './jwt-helper';

let _userLoginInfo: UserLoginInfo | null = null;

export function setGlobalUserLoginInfo(loginInfo: UserLoginInfo | null) {
  _userLoginInfo = loginInfo;
}

/**
 * 获取全局用户登录信息
 * 信息来源可能为注册页面或者登录页面
 */
export function getGlobalUserLoginInfo() {
  return _userLoginInfo;
}

/**
 * 尝试自动登录
 */
export async function tryAutoLogin(): Promise<UserLoginInfo> {
  let userLoginInfo = getGlobalUserLoginInfo();
  if (_isNil(userLoginInfo)) {
    // 如果没有全局缓存的数据, 则尝试自动登录
    const token = await getUserJWT();
    if (typeof token !== 'string') {
      throw new Error('Token 格式不合法');
    }

    console.debug('正在尝试使用Token登录');
    userLoginInfo = await model.user.loginWithToken(token);
    if (userLoginInfo === null) {
      throw new Error('Token 内容不合法');
    }

    setGlobalUserLoginInfo(userLoginInfo);
  }

  return userLoginInfo;
}

/**
 * 是否为内置邮箱
 *
 * 内置邮箱则为非用户输入，通过其他途径进来但是没有邮箱属于自动补全的邮箱类型
 * 比如临时用户，比如iam
 */
export function isBuiltinEmail(email: string): boolean {
  if (typeof email !== 'string') {
    // 一般来说内置邮箱都是表示不可用状态，因此如果不是合法输入直接视为true
    return true;
  }

  const domain = email.split('@')[1];

  if (!domain) {
    return true;
  }

  if (domain.endsWith('.msgbyte.com')) {
    return true;
  }

  return false;
}
