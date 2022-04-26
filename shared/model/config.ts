import { request } from '../api/request';

/**
 * 后端的全局设置
 */
export interface GlobalConfig {
  /**
   * 上传文件体积
   * 默认1m
   */
  uploadFileLimit: number;
}

let globalConfig = {
  uploadFileLimit: 1 * 1024 * 1024,
};

export function getGlobalConfig() {
  return {
    ...globalConfig,
  };
}

export async function fetchGlobalConfig(): Promise<GlobalConfig> {
  const { data: config } = await request.get('/api/config/global');

  globalConfig = {
    ...globalConfig,
    ...config,
  };

  return config;
}
