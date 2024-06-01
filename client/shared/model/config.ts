import { request } from '../api/request';
import { useGlobalConfigStore } from '../store/globalConfig';
import { defaultGlobalConfig } from '../utils/consts';

/**
 * 后端的全局设置
 */
export interface GlobalConfig {
  /**
   * Tianji 配置
   */
  tianji: {
    scriptUrl?: string;
    websiteId?: string;
  };

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

  /**
   * 服务器入口背景图
   */
  serverEntryImage?: string;

  /**
   * 是否禁用 Socketio 的 Msgpack 解析器
   */
  disableMsgpack?: boolean;

  /**
   * 是否禁用注册功能
   */
  disableUserRegister?: boolean;

  /**
   * 是否禁用游客登录
   */
  disableGuestLogin?: boolean;

  /**
   * 是否禁用创建群组功能
   */
  disableCreateGroup?: boolean;

  /**
   * 是否禁用插件中心
   */
  disablePluginStore?: boolean;

  /**
   * 是否禁用添加好友功能
   */
  disableAddFriend?: boolean;

  /**
   * 是否禁用遥测
   */
  disableTelemetry?: boolean;

  announcement?:
    | false
    | {
        id: string;
        text: string;
        link?: string;
      };
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
