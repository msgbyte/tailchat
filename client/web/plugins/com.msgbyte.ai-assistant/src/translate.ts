import { localTrans } from '@capital/common';

export const Translate = {
  name: localTrans({
    'zh-CN': 'AI Assistant',
    'en-US': 'AI Assistant',
  }),
  helpMeTo: localTrans({
    'zh-CN': '帮我:',
    'en-US': 'Help me to:',
  }),
  improveText: localTrans({
    'zh-CN': '改进文本',
    'en-US': 'Improve Text',
  }),
  makeShorter: localTrans({
    'zh-CN': '精简内容',
    'en-US': 'Make Shorter',
  }),
  makeLonger: localTrans({
    'zh-CN': '扩写内容',
    'en-US': 'Make Longer',
  }),
  summaryMessages: localTrans({
    'zh-CN': '总结内容',
    'en-US': 'Summary Messages',
  }),
  translateInputText: localTrans({
    'zh-CN': '翻译输入内容',
    'en-US': 'Translate Input',
  }),
  usage: localTrans({
    'zh-CN': '用时',
    'en-US': 'Usage',
  }),
  serviceBusy: localTrans({
    'zh-CN': '服务器忙，请稍后再试',
    'en-US': 'Server is busy, please try again later',
  }),
  callError: localTrans({
    'zh-CN': '调用失败',
    'en-US': 'Call Error',
  }),
  apply: localTrans({
    'zh-CN': '应用',
    'en-US': 'Apply',
  }),
  prompt: {
    summaryMessages: localTrans({
      'zh-CN':
        '你将得到一串聊天记录，希望你能够对这些记录进行摘要。要求简明扼要，以包含列表的大纲形式输出。',
      'en-US':
        'You will receive a chat record and we hope you can summarize it. Please provide a concise outline format that includes a list.',
    }),
  },
};
