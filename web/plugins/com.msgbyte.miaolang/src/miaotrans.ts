import Miao from 'miao-lang';
import { Translate } from './translate';

export function encode(human: string): string {
  return Miao.encode(human, {
    calls: Translate.calls,
  });
}

export function decode(miao: string): string {
  return Miao.decode(miao);
}

export function isMiao(input: string): boolean {
  return Miao.isMiao(input);
}
