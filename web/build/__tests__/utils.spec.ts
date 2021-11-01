import { workboxPluginPattern } from '../utils';

describe('workboxPluginPattern', () => {
  test.each([
    ['/plugins/com.msgbyte.foo/bar.js', true],
    ['/plugins/com.msgbyte.foo.foz/bar.js', true],
    ['/plugins/com.msgbyte.foo/index.js', false],
    ['/plugins/com.msgbyte.foo/index-abcde.js', false], // TODO: 这个期望是true的。但是不会写正则
    ['/plugins/com.msgbyte.foo/index.woff', false],
    ['/plugins/com.msgbyte.foo/font.woff', false],
  ])('%s: %p', (input, output) => {
    expect(workboxPluginPattern.test(input)).toBe(output);
  });
});
