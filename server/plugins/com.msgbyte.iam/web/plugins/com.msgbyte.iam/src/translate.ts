import { localTrans } from '@capital/common';

export const Translate = {
  iamLogin: localTrans({
    'zh-CN': '第三方登录',
    'en-US': 'Third party login',
  }),
  loginFailed: localTrans({
    'zh-CN': '登录失败',
    'en-US': 'Login Failed',
  }),
  accountExistedTip: localTrans({
    // 'zh-CN': '账号已存在，你应该在登录后绑定账号',
    // 'en-US': 'Account Existed, You should bind provider account after login',
    'zh-CN': '账号已存在，请使用账号密码登录',
    'en-US': 'Account Existed, please log in with account password',
  }),
  infoDeviantTip: localTrans({
    // 'zh-CN': '账号已存在，你应该在登录后绑定账号',
    // 'en-US': 'Account Existed, You should bind provider account after login',
    'zh-CN': '账号信息异常，请使用账号密码登录',
    'en-US': 'Account Info Deviant, please log in with account password',
  }),
  notSupportMobile: localTrans({
    'zh-CN': '第三方登录功能暂不支持移动端使用',
    'en-US': 'The third-party login function does not support mobile use',
  }),
};
