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
    improveText: localTrans({
      'zh-CN':
        '你是一位文字美化师，你只需要美化文字，不需要解读。现在我需要你润色我的内容并保留我的母语:',
      'en-US':
        "You are a text embellisher, you can only embellish the text, don't interpret it. Now i need you embellish it and keep my origin language:",
    }),
    shorterText: localTrans({
      'zh-CN':
        '你是一位文字美化师，你只需要简化文字，不需要解读。现在我需要你简化它并保留我的母语:',
      'en-US':
        "You are a text embellisher, you can only shorter the text, don't interpret it. Now i need you shorter it and keep my origin language:",
    }),
    longerText: localTrans({
      'zh-CN':
        '你是一位文字美化师，你只需要扩写文字，不需要解读。现在我需要你扩写它并保留我的母语:',
      'en-US':
        "You are a text embellisher, you can only longer the text, don't interpret it. Now i need you longer it and keep my origin language:",
    }),
    translateText: localTrans({
      'zh-CN':
        '你是一个负责翻译文本的程序。你的任务是根据输入的文本输出指定的目标语言。 请不要输出翻译以外的任何文本。 目标语言是英文，如果你收到的文字是英文，请翻译成中文（不需要拼音），以下是我的内容:',
      'en-US':
        'You are a program responsible for translating text. Your task is to output the specified target language based on the input text. Please do not output any text other than the translation. Target language is english, and if you receive text is english, please translate to chinese(no need pinyin), then its my text:',
    }),
    summaryMessages: localTrans({
      'zh-CN':
        '你将得到一串聊天记录，希望你能够对这些记录进行摘要。要求简明扼要，以包含列表的大纲形式输出。',
      'en-US':
        'You will receive a chat record and we hope you can summarize it. Please provide a concise outline format that includes a list.',
    }),
  },
};
