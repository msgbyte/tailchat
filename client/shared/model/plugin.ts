import { request } from '../api/request';

export interface PluginManifest {
  /**
   * 插件用于显示的名称
   * @example 网页面板插件
   */
  label: string;
  'label.zh-CN'?: string;

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
  'description.zh-CN'?: string;

  /**
   * 是否需要重启才能应用插件
   */
  requireRestart: boolean;

  /**
   * 文档的链接
   * 如果是markdown则解析, 如果是html则使用iframe
   */
  documentUrl?: string;
}

/**
 * 获取服务端插件中心的插件列表
 *
 * 后端动态
 */
export async function fetchRegistryPlugins(): Promise<PluginManifest[]> {
  const { data } = await request.get('/api/plugin/registry/list');

  return data;
}

/**
 * 获取服务器安装的插件列表
 *
 * 后端固定
 */
export async function fetchServiceRegistryPlugins(): Promise<PluginManifest[]> {
  const { data } = await request.get('/registry-be.json');

  return data;
}

/**
 * 获取本地固定的registry
 *
 * 前端固定
 */
export async function fetchLocalStaticRegistryPlugins(): Promise<
  PluginManifest[]
> {
  const { data } = await request.get('/registry.json', { baseURL: '' });

  return data;
}
