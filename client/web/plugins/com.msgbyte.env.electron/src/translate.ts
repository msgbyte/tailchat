import { localTrans } from '@capital/common';

export const Translate = {
  deviceInfo: localTrans({
    'zh-CN': '设备信息',
    'en-US': 'Device Info',
  }),
  clientName: localTrans({
    'zh-CN': '客户端名称',
    'en-US': 'Client Name',
  }),
  clientVersion: localTrans({
    'zh-CN': '客户端版本号',
    'en-US': 'Client Version',
  }),
  platform: localTrans({
    'zh-CN': '平台',
    'en-US': 'Platform',
  }),
  newVersionTip: localTrans({
    'zh-CN': '新版本提示',
    'en-US': 'New Version Upgrade Tip',
  }),
  newVersionDesc: localTrans({
    'zh-CN': '发现有新的版本可以安装',
    'en-US': 'A new version was found to be installed',
  }),
  upgradeNow: localTrans({
    'zh-CN': '立即更新',
    'en-US': 'Upgrade Now',
  }),
  checkVersion: localTrans({
    'zh-CN': '检查更新',
    'en-US': 'Check for updates',
  }),
  isLatest: localTrans({
    'zh-CN': '已经是最新版',
    'en-US': 'Already the latest version',
  }),
  nativeWebviewRender: localTrans({
    'zh-CN': '启用原生浏览器内核渲染',
    'en-US': 'Use Native Webview Render',
  }),
  nativeWebviewRenderDesc: localTrans({
    'zh-CN': '解除默认网页访问限制，允许在Tailchat嵌入任意网站内容',
    'en-US':
      'Lift default web page access restrictions and allow any website content to be embedded in Tailchat',
  }),
  nativeWebviewRenderHideTip: localTrans({
    'zh-CN': '组件被遮挡，暂时隐藏网页视图',
    'en-US': 'The component is obscured, temporarily hiding the web view',
  }),
};
