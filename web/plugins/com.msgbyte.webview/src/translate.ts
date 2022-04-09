import { localTrans } from '@capital/common';

export const Translate = {
  webpanel: localTrans({ 'zh-CN': '网页面板', 'en-US': 'Webview Panel' }),
  customwebpanel: localTrans({
    'zh-CN': '自定义网页面板',
    'en-US': 'Custom Webview Panel',
  }),
  customwebpanelPlaceholder: localTrans({
    'zh-CN': '建议在第三方页面编辑完毕后粘贴到此处',
    'en-US': 'Recommended to paste it here after editing the third-party page',
  }),
  notfound: localTrans({
    'zh-CN': '加载失败, 面板信息不存在',
    'en-US': 'Loading failed, panel info does not exist',
  }),
  website: localTrans({
    'zh-CN': '网址',
    'en-US': 'Website',
  }),
  htmlcode: localTrans({
    'zh-CN': 'HTML代码',
    'en-US': 'HTML Code',
  }),
};
