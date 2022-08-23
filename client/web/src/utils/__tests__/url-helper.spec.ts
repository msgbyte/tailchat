import {
  markAbsoluteUrl,
  urlSearchParse,
  urlSearchStringify,
  appendUrlSearch,
} from '../url-helper';
import _set from 'lodash/set';

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

describe('url search', () => {
  test('urlSearchStringify', () => {
    expect(urlSearchStringify({ foo: 'a', bar: 'b' })).toBe('foo=a&bar=b');
  });

  test('urlSearchParse', () => {
    expect(urlSearchParse('foo=a&bar=b')).toEqual({ foo: 'a', bar: 'b' });
  });

  describe('appendUrlSearch', () => {
    // Mock
    _set(window, 'location.search', '?foo=a&bar=b');

    test('append', () => {
      expect(
        appendUrlSearch({
          foz: 'c',
        })
      ).toBe('foo=a&bar=b&foz=c');
    });

    test('overwrite', () => {
      expect(
        appendUrlSearch({
          foo: 'c',
        })
      ).toBe('foo=c&bar=b');
    });
  });
});
