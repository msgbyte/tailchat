import { localTrans } from '@capital/common';

export const Translate = {
  uplink: localTrans({
    'zh-CN': '上行网络',
    'en-US': 'Uplink',
  }),
  downlink: localTrans({
    'zh-CN': '下行网络',
    'en-US': 'Downlink',
  }),
  isSpeaking: localTrans({
    'zh-CN': '正在发言',
    'en-US': 'is Speaking',
  }),
  nomanSpeaking: localTrans({
    'zh-CN': '无人发言',
    'en-US': 'No one Speaking',
  }),
  startCall: localTrans({
    'zh-CN': '发起/加入通话',
    'en-US': 'Start/Join Call',
  }),
  startCallContent: localTrans({
    'zh-CN': '是否通过声网插件在当前会话开启/加入音视频通讯？',
    'en-US':
      'Do you want to enable audio and video communication in the current session through the Agora plugin?',
  }),
  expand: localTrans({
    'zh-CN': '展开',
    'en-US': 'expand',
  }),
  foldup: localTrans({
    'zh-CN': '收起',
    'en-US': 'foldup',
  }),
  joinTip: localTrans({
    'zh-CN': '正在加入通话...',
    'en-US': 'Joining call...',
  }),
  repeatTip: localTrans({
    'zh-CN': '当前已有正在进行中的通话, 请先结束上一场通话',
    'en-US':
      'There is currently an active call, please end the previous call first',
  }),
  hangUp: localTrans({
    'zh-CN': '挂断',
    'en-US': 'Hang Up',
  }),
  openCamera: localTrans({
    'zh-CN': '开启摄像头',
    'en-US': 'Open Camera',
  }),
  closeCamera: localTrans({
    'zh-CN': '关闭摄像头',
    'en-US': 'Close Camera',
  }),
  openMic: localTrans({
    'zh-CN': '开启麦克风',
    'en-US': 'Open Mic',
  }),
  closeMic: localTrans({
    'zh-CN': '关闭麦克风',
    'en-US': 'Close Mic',
  }),
  openScreensharing: localTrans({
    'zh-CN': '开启屏幕共享',
    'en-US': 'Open Screensharing',
  }),
  closeScreensharing: localTrans({
    'zh-CN': '关闭屏幕共享',
    'en-US': 'Close Screensharing',
  }),
  someoneScreenName: localTrans({
    'zh-CN': ' 的屏幕',
    'en-US': "'s Screen",
  }),
};
