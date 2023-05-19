import { localTrans } from '@capital/common';

export const Translate = {
  welcomeText: localTrans({ 'zh-CN': '欢迎词', 'en-US': 'Welcome Text' }),
  welcomeTip: localTrans({
    'zh-CN': '向新成员发送入群欢迎消息',
    'en-US': 'Send welcome message when new member',
  }),
  welcomeDesc: localTrans({
    'zh-CN':
      '清空则视为不启用，包含部分特殊写法，如{nickname}表示用户昵称, {@nickname}表示 @ 对方。同时支持富文本语法。',
    'en-US':
      'If it is empty, it will be regarded as disabled, including some special writing, such as {nickname} means user nickname, {@nickname} means @ target member.Also supports rich text syntax.',
  }),
};
