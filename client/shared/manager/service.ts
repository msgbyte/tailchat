import { buildRegFnWithEvent } from './buildReg';

/**
 * 获取服务器地址相关逻辑
 * @default http://127.0.0.1:11000
 */
export const [getServiceUrl, setServiceUrl, onServiceUrlChange] =
  buildRegFnWithEvent<() => string>(
    'serverUrl',
    () => 'http://127.0.0.1:11000'
  );
