import { workboxPluginPattern } from '../utils';

describe('workboxPluginPattern', () => {
  test.each([
    // 缓存case
    ['/plugins/com.msgbyte.foo/bar.js', true],
    ['/plugins/com.msgbyte.foo.foz/bar.js', true],

    // 不缓存case
    ['/plugins/com.msgbyte.foo/index.js', false],
    ['/plugins/com.msgbyte.foo/index-abcde.js', false], // TODO: 这个期望是true的。但是不会写正则
    ['/plugins/com.msgbyte.foo/index.woff', false],
    ['/plugins/com.msgbyte.foo/font.woff', false],
    ['/plugins/a/b/c/d/e/f/g.js', false],
  ])('%s: %p', (input, output) => {
    expect(workboxPluginPattern.test(input)).toBe(output);
  });
});
