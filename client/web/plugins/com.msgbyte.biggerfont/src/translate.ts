import { localTrans } from '@capital/common';

export const Translate = {
  name: localTrans({
    'zh-CN': '放大字号',
    'en-US': 'Increase font size',
  }),
  default: localTrans({ 'zh-CN': '默认', 'en-US': 'Default' }),
  md: localTrans({ 'zh-CN': '中号', 'en-US': 'Middle' }),
  lg: localTrans({
    'zh-CN': '大号',
    'en-US': 'Large',
  }),
  xl: localTrans({
    'zh-CN': '特大号',
    'en-US': 'Extra Large',
  }),
};
