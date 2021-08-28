import { request } from '../api/request';

export interface PluginManifest {
  /**
   * 插件用于显示的名称
   * @example 网页面板插件
   */
  label: string;

  /**
   * 插件名, 插件唯一标识
   * @example com.msgbyte.webview
   */
  name: string;

  /**
   * 插件地址
   */
  url: string;

  /**
   * 插件图标
   * 推荐大小: 128x128
   */
  icon?: string;

  /**
   * 插件版本号
   * 遵循 semver 规则
   *
   * major.minor.patch
   * @example 1.0.0
   */
  version: string;

  /**
   * 插件维护者
   */
  author: string;

  /**
   * 插件描述
   */
  description: string;

  /**
   * 是否需要重启才能应用插件
   */
  requireRestart: boolean;
}

export async function fetchRegistryPlugins(): Promise<PluginManifest[]> {
  const { data } = await request.get('/api/plugin/registry/list');

  return data;
}
