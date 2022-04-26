import { request } from '../api/request';
import { t } from '../i18n';
import { showErrorToasts } from '../manager/ui';

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

export async function fetchConfig() {
  const { data: config } = await request.get('/api/config/global');

  globalConfig = {
    ...globalConfig,
    ...config,
  };

  return config;
}

/**
 * 加载时立即尝试执行
 */
fetchConfig().catch((e) => {
  showErrorToasts(t('全局配置加载失败'));
  console.error('全局配置加载失败', e);
});
