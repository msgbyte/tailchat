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
  {
    label: 'BBCode',
    name: 'com.msgbyte.bbcode',
    url: '/plugins/com.msgbyte.bbcode/index.js',
    version: '0.0.0',
    author: 'msgbyte',
    description: 'BBCode 格式消息内容解析',
    requireRestart: true,
  },
  {
    label: '消息通知插件',
    name: 'com.msgbyte.notify',
    url: '/plugins/com.msgbyte.notify/index.js',
    version: '0.0.0',
    author: 'msgbyte',
    description: '为应用增加通知的能力',
    requireRestart: true,
  },
  {
    label: '初始引导插件',
    name: 'com.msgbyte.intro',
    url: '/plugins/com.msgbyte.intro/index.js',
    version: '0.0.0',
    author: 'msgbyte',
    description: '为应用首次打开介绍应用的能力',
    requireRestart: true,
  },
];
