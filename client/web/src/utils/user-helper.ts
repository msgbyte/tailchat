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
