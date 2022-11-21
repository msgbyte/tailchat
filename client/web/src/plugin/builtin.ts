import type { PluginManifest } from 'tailchat-shared';
import _compact from 'lodash/compact';

const isOffical = [
  'nightly.paw.msgbyte.com',
  // 'localhost:11011',
].includes(location.host);

/**
 * 内置插件列表
 *
 * 该列表中的插件会被强制安装
 */
export const builtinPlugins: PluginManifest[] = _compact([
  {
    label: '网页面板插件',
    name: 'com.msgbyte.webview',
    url: '/plugins/com.msgbyte.webview/index.js',
    version: '0.0.0',
    author: 'msgbyte',
    description: '为群组提供创建网页面板的功能',
    documentUrl: '/plugins/com.msgbyte.webview/README.md',
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
  isOffical && {
    label: 'Posthog',
    name: 'com.msgbyte.posthog',
    url: '/plugins/com.msgbyte.posthog/index.js',
    version: '0.0.0',
    author: 'moonrailgun',
    description: 'Posthog 数据统计',
    requireRestart: true,
  },
  isOffical && {
    label: 'Sentry',
    name: 'com.msgbyte.sentry',
    url: '/plugins/com.msgbyte.sentry/index.js',
    version: '0.0.0',
    author: 'moonrailgun',
    description: 'Sentry 错误处理',
    requireRestart: true,
  },
]);
