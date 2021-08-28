import Miao from 'miao-lang';

export function encode(human: string): string {
  return Miao.encode(human);
}

export function decode(miao: string): string {
  return Miao.decode(miao);
}

export function isMiao(input: string): boolean {
  return Miao.isMiao(input);
}
