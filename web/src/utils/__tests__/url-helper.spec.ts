import { markAbsoluteUrl } from '../url-helper';

describe('markAbsoluteUrl', () => {
  test.each([
    ['bar', 'https://www.example.com/foo/bar'],
    ['./bar', 'https://www.example.com/foo/bar'],
    ['../bar', 'https://www.example.com/bar'],
    ['/bar', 'https://www.example.com/bar'],
    ['https://www.baidu.com', 'https://www.baidu.com/'],
    ['https://www.baidu.com/search', 'https://www.baidu.com/search'],
  ])('%s', (input, output) => {
    expect(markAbsoluteUrl(input)).toBe(output);
  });
});
