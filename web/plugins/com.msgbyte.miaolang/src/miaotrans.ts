import Miao from 'miao-lang';
import { Translate } from './translate';
import { getLanguage } from '@capital/common';

export function encode(human: string): string {
  return Miao.encode(human, {
    calls: Translate.calls,
    halfwidthSymbol: getLanguage() !== 'zh-CN',
  });
}

export function decode(miao: string): string {
  return Miao.decode(miao);
}

export function isMiao(input: string): boolean {
  return Miao.isMiao(input);
}
