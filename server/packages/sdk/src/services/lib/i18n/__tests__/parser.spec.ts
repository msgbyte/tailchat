import { parseLanguageFromHead } from '../parser';

describe('parseLanguageFromHead', () => {
  test.each([
    // zh
    ['zh-CN,zh;q=0.9', 'zh-CN'],
    ['zh-TW,zh;q=0.9', 'zh-CN'],
    ['zh;q=0.9', 'zh-CN'],
    ['zh', 'zh-CN'],

    // en
    ['en-US,en;q=0.8,sv', 'en-US'],
    ['en-GB,en;q=0.8,sv', 'en-US'],
    ['en;q=0.8,sv', 'en-US'],
    ['en', 'en-US'],

    // other
    ['de-CH;q=0.8,sv', 'en-US'],
    ['jp', 'en-US'],
  ])('%s', (input, output) => {
    expect(parseLanguageFromHead(input)).toBe(output);
  });
});
