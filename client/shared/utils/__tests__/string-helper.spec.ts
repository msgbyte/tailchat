import { isAvailableString, isUrl } from '../string-helper';

describe('string-helper', () => {
  describe('isAvailableString', () => {
    test.each<[any, boolean]>([
      ['any string', true],
      ['', false],
      [1, false],
      [() => {}, false],
      [{}, false],
      [[], false],
      [undefined, false],
      [null, false],
    ])('%p => %p', (url, res) => {
      expect(isAvailableString(url)).toBe(res);
    });
  });

  describe('isUrl', () => {
    test.each<[string, boolean]>([
      ['http://baidu.com', true],
      ['https://baidu.com', true],
      ['ws://baidu.com', true],
      ['wss://baidu.com', true],
      ['baidu.com', false],
      ['baidu', false],
    ])('%s => %p', (url, res) => {
      expect(isUrl(url)).toBe(res);
    });
  });
});
