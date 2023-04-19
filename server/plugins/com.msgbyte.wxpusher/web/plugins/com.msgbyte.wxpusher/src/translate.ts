import { localTrans } from '@capital/common';

export const Translate = {
  loadingState: localTrans({
    'zh-CN': '正在检查绑定状态',
    'en-US': 'Checking binding status',
  }),
  binded: localTrans({
    'zh-CN': '已绑定',
    'en-US': 'Binded',
  }),
  currentWXPusherId: localTrans({
    'zh-CN': '当前 wxpusher ID',
    'en-US': 'Current wxpusher uid',
  }),
  loadingQRCode: localTrans({
    'zh-CN': '正在加载绑定二维码',
    'en-US': 'Binding QR code is loading',
  }),
  useWechatBindTip: localTrans({
    'zh-CN': '使用微信扫码绑定 wxpusher',
    'en-US': 'Use wechat scan QRCode to bind wxpusher',
  }),
};
