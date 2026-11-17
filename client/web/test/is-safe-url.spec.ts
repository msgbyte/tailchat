import { isSafeUrl } from 'tailchat-shared/utils/url-helper';

describe('isSafeUrl', () => {
  it.each([
    'https://example.com/a?b=1',
    'http://example.com',
    'HTTPS://example.com',
    '/main/group/1',
    'files/a.png',
    '//example.com/x',
  ])('allows %s', (url) => {
    expect(isSafeUrl(url)).toBe(true);
  });

  it.each([
    'javascript:alert(1)',
    'JavaScript:alert(1)',
    ' \x01javascript:alert(1)',
    'java\tscript:alert(1)',
    'java\nscript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'blob:https://example.com/1',
  ])('rejects %j', (url) => {
    expect(isSafeUrl(url)).toBe(false);
  });
});
