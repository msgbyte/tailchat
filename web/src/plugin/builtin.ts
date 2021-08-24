import type { PluginManifest } from 'tailchat-shared';

/**
 * 内置插件列表
 *
 * 该列表中的插件会被强制安装
 */
export const builtinPlugins: PluginManifest[] = [
  {
    label: '网页面板插件',
    name: 'com.msgbyte.webview',
    url: '/plugins/com.msgbyte.webview/index.js',
    version: '0.0.0',
    author: 'msgbyte',
    description: '为群组提供创建网页面板的功能',
    requireRestart: false,
  },
];
