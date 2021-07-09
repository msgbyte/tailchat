import { buildRegFn } from './buildRegFn';

/**
 * 获取服务器地址相关逻辑
 */
export const [getServerUrl, setServerUrl] = buildRegFn<() => string>(
  'serverUrl',
  () => 'http://127.0.0.1:11000'
);
