import { localTrans } from '@capital/common';

export const Translate = {
  fimLogin: localTrans({
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
};
