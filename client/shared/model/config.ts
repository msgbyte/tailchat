import { request } from '../api/request';
import { useGlobalConfigStore } from '../store/globalConfig';
import { defaultGlobalConfig } from '../utils/consts';

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

  /**
   * 服务器名
   */
  serverName?: string;
}

export function getGlobalConfig(): GlobalConfig {
  return useGlobalConfigStore.getState();
}

export async function fetchGlobalClientConfig(): Promise<GlobalConfig> {
  const { data: config } = await request.get('/api/config/client');

  useGlobalConfigStore.setState({
    ...defaultGlobalConfig,
    ...config,
  });

  return config;
}
