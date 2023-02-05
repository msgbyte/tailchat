import { request } from '../api/request';
import { globalActions } from '../redux/slices';
import { defaultGlobalConfig } from '../redux/slices/global';
import { reduxStore } from '../redux/store';

/**
 * 后端的全局设置
 */
export interface GlobalConfig {
  /**
   * 上传文件体积
   * 默认1m
   */
  uploadFileLimit: number;
  /**
   * 是否在注册时校验邮箱
   */
  emailVerification: boolean;
}

export function getGlobalConfig(): GlobalConfig {
  return reduxStore.getState().global.config;
}

export async function fetchGlobalClientConfig(): Promise<GlobalConfig> {
  const { data: config } = await request.get('/api/config/client');

  reduxStore.dispatch(
    globalActions.setGlobalConfig({
      ...defaultGlobalConfig,
      ...config,
    })
  );

  return config;
}
