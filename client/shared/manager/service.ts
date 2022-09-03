import { buildRegFnWithEvent } from './buildReg';

/**
 * 获取服务器地址相关逻辑
 * @default window.location.origin (前后端一体)
 */
export const [getServiceUrl, setServiceUrl, onServiceUrlChange] =
  buildRegFnWithEvent<() => string>('serverUrl', () => window.location.origin);
