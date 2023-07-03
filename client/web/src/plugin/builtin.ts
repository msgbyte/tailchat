import type { PluginManifest } from 'tailchat-shared';
import _compact from 'lodash/compact';

const isOffical = [
  'nightly.paw.msgbyte.com', //
  //'localhost:11011'
].includes(location.host);

/**
 * 内置插件列表
 *
 * 该列表中的插件会被强制安装
 */
export const builtinPlugins: PluginManifest[] = _compact([
  {
    label: 'Web Panel Plugin',
    'label.zh-CN': '网页面板插件',
    name: 'com.msgbyte.webview',
    url: '/plugins/com.msgbyte.webview/index.js',
    version: '0.0.0',
    author: 'msgbyte',
    description: 'Provides groups with the ability to create web panels',
    'description.zh-CN': '为群组提供创建网页面板的功能',
    documentUrl: '/plugins/com.msgbyte.webview/README.md',
    requireRestart: false,
  },
  {
    label: 'BBCode Mmessage Interpreter',
    'label.zh-CN': 'BBCode 消息解释器',
    name: 'com.msgbyte.bbcode',
    url: '/plugins/com.msgbyte.bbcode/index.js',
    version: '0.0.0',
    author: 'msgbyte',
    description:
      'A plugin for supporting bbcode syntax to interpret rich text messages',
    'description.zh-CN': '一个用于支持bbcode语法解释富文本消息的插件',
    requireRestart: true,
  },
  {
    label: 'Message notification plugin',
    'label.zh-CN': '消息通知插件',
    name: 'com.msgbyte.notify',
    url: '/plugins/com.msgbyte.notify/index.js',
    version: '0.0.0',
    author: 'msgbyte',
    description: 'Ability to add notifications to apps',
    'description.zh-CN': '为应用增加通知的能力',
    requireRestart: true,
  },
  {
    label: 'Intro plugin',
    'label.zh-CN': '初始引导插件',
    name: 'com.msgbyte.intro',
    url: '/plugins/com.msgbyte.intro/index.js',
    version: '0.0.0',
    author: 'msgbyte',
    description:
      'Turn on the ability to introduce the app for the first time for the app',
    'description.zh-CN': '为应用首次打开介绍应用的能力',
    requireRestart: true,
  },
  {
    label: 'Markdown Panel',
    'label.zh-CN': 'Markdown 面板',
    name: 'com.msgbyte.mdpanel',
    url: '/plugins/com.msgbyte.mdpanel/index.js',
    version: '0.0.0',
    author: 'moonrailgun',
    description: 'Add markdown panel support',
    'description.zh-CN': '增加 Markdown 面板支持',
    requireRestart: true,
  },
  {
    label: 'Identity and Access Management',
    'label.zh-CN': 'IAM 插件',
    name: 'com.msgbyte.iam',
    url: '{BACKEND}/plugins/com.msgbyte.iam/index.js',
    version: '0.0.0',
    author: 'moonrailgun',
    description:
      'Provide Tailchat with the function of conveniently accessing external account systems',
    'description.zh-CN': '为Tailchat提供方便的接入外部账户系统的功能',
    requireRestart: true,
  },
  // isOffical
  isOffical && {
    label: 'Posthog',
    name: 'com.msgbyte.posthog',
    url: '/plugins/com.msgbyte.posthog/index.js',
    icon: '/plugins/com.msgbyte.posthog/assets/icon.png',
    version: '0.0.0',
    author: 'moonrailgun',
    description: 'Posthog Statistics',
    'description.zh-CN': 'Posthog 数据统计',
    requireRestart: true,
  },
  isOffical && {
    label: 'Sentry',
    name: 'com.msgbyte.sentry',
    url: '/plugins/com.msgbyte.sentry/index.js',
    icon: '/plugins/com.msgbyte.sentry/assets/icon.png',
    version: '0.0.0',
    author: 'moonrailgun',
    description: 'Sentry error handling',
    'description.zh-CN': 'Sentry 错误处理',
    requireRestart: true,
  },
  isOffical && {
    label: 'User Location',
    'label.zh-CN': '用户地理位置',
    name: 'com.msgbyte.user.location',
    url: '/plugins/com.msgbyte.user.location/index.js',
    version: '0.0.0',
    author: 'moonrailgun',
    description: 'Add geographic location records for user information',
    'description.zh-CN': '为用户信息增加地理位置记录',
    requireRestart: true,
  },
  isOffical && {
    label: 'AI Assistant',
    name: 'com.msgbyte.ai-assistant',
    url: '/plugins/com.msgbyte.ai-assistant/index.js',
    icon: '/plugins/com.msgbyte.ai-assistant/assets/icon.png',
    version: '0.0.0',
    author: 'moonrailgun',
    description: 'Add chatgpt into Tailchat',
    requireRestart: true,
  },
]);
