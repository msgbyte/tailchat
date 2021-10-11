import type { UserLoginInfo } from 'tailchat-shared';

let _userLoginInfo: UserLoginInfo;

export function setGlobalUserLoginInfo(loginInfo: UserLoginInfo) {
  _userLoginInfo = loginInfo;
}

/**
 * 获取全局用户登录信息
 * 信息来源可能为注册页面或者登录页面
 */
export function getGlobalUserLoginInfo() {
  return _userLoginInfo;
}
